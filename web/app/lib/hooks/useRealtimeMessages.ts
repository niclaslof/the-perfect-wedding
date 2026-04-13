"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { ChatMessage } from "@/app/lib/types";

type MessageWithGuest = ChatMessage & { guest?: { name: string } };

export function useRealtimeMessages(channelId: string | null, guestName?: string) {
  const [messages, setMessages] = useState<MessageWithGuest[]>([]);
  const [loading, setLoading] = useState(true);
  const lastFetchRef = useRef<string>("");

  // Load messages via API
  const loadMessages = useCallback(async (silent = false) => {
    if (!channelId) return;
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`/api/chat/messages?channel_id=${channelId}`);
      const data = await res.json();
      const fetched = data.messages || [];
      // Only update if messages actually changed (avoids flickering)
      const key = fetched.map((m: MessageWithGuest) => m.id).join(",");
      if (key !== lastFetchRef.current) {
        lastFetchRef.current = key;
        setMessages((prev) => {
          // Preserve optimistic messages that haven't been confirmed yet
          const optimistic = prev.filter((m) => m.id.startsWith("optimistic-"));
          const realIds = new Set(fetched.map((m: MessageWithGuest) => m.id));
          const remainingOptimistic = optimistic.filter(
            (m) => !fetched.some((f: MessageWithGuest) => f.content === m.content && f.guest?.name === m.guest?.name)
          );
          return [...fetched, ...remainingOptimistic];
        });
      }
    } catch {
      // Silently fail
    }
    if (!silent) setLoading(false);
  }, [channelId]);

  // Initial load
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Poll every 3 seconds for new messages (reliable, works everywhere)
  useEffect(() => {
    if (!channelId) return;
    const interval = setInterval(() => loadMessages(true), 3000);
    return () => clearInterval(interval);
  }, [channelId, loadMessages]);

  // Send message: optimistic add + API call
  async function sendMessage(content: string, guestId?: string) {
    if (!channelId || !content.trim()) return;

    const optimisticMsg: MessageWithGuest = {
      id: `optimistic-${Date.now()}`,
      channel_id: channelId,
      guest_id: guestId || "",
      content: content.trim(),
      created_at: new Date().toISOString(),
      guest: { name: guestName || "Du" },
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel_id: channelId, content: content.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMsg.id ? data.message : m))
        );
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    }
  }

  return { messages, loading, sendMessage, refresh: loadMessages };
}
