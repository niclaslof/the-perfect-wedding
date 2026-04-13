"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/app/lib/supabase";
import type { ChatMessage } from "@/app/lib/types";

type MessageWithGuest = ChatMessage & { guest?: { name: string } };

export function useRealtimeMessages(channelId: string | null, guestName?: string) {
  const [messages, setMessages] = useState<MessageWithGuest[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Load initial messages via API (gets guest names via join)
  const loadMessages = useCallback(async () => {
    if (!channelId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/chat/messages?channel_id=${channelId}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch {
      // Silently fail
    }
    setLoading(false);
  }, [channelId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Subscribe to realtime — listen for INSERTs from OTHER clients
  useEffect(() => {
    if (!channelId) return;

    const channel = supabase
      .channel(`chat:${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `channel_id=eq.${channelId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          // Add to messages if not already present (avoids duplicates from optimistic add)
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            // We don't have guest name from realtime payload, refetch
            loadMessages();
            return prev;
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [channelId, loadMessages]);

  // Send message: optimistic add + API call
  async function sendMessage(content: string, guestId?: string) {
    if (!channelId || !content.trim()) return;

    // Optimistic: add message to UI immediately
    const optimisticMsg: MessageWithGuest = {
      id: `optimistic-${Date.now()}`,
      channel_id: channelId,
      guest_id: guestId || "",
      content: content.trim(),
      created_at: new Date().toISOString(),
      guest: { name: guestName || "Du" },
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    // Send via API
    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel_id: channelId, content: content.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        // Replace optimistic message with real one
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMsg.id ? data.message : m))
        );
      }
    } catch {
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    }
  }

  return { messages, loading, sendMessage, refresh: loadMessages };
}
