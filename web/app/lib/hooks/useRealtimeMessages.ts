"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";
import type { ChatMessage } from "@/app/lib/types";

type MessageWithGuest = ChatMessage & { guest?: { name: string } };

export function useRealtimeMessages(channelId: string | null) {
  const [messages, setMessages] = useState<MessageWithGuest[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial messages
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

  // Subscribe to realtime
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
        async (payload) => {
          // Fetch the message with guest name
          const newMsg = payload.new as ChatMessage;
          // We need guest name — fetch it
          const res = await fetch(`/api/chat/messages?channel_id=${channelId}`);
          const data = await res.json();
          setMessages(data.messages || []);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId]);

  async function sendMessage(content: string) {
    if (!channelId || !content.trim()) return;
    await fetch("/api/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel_id: channelId, content }),
    });
  }

  return { messages, loading, sendMessage, refresh: loadMessages };
}
