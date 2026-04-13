"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "@/app/components/SessionProvider";
import PageLayout from "@/app/components/ui/PageLayout";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import { useRealtimeMessages } from "@/app/lib/hooks/useRealtimeMessages";

type Channel = {
  id: string;
  channel_type: "group" | "dm";
  name: string | null;
  display_name: string;
};

export default function ChatPage() {
  const { guest } = useSession();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, loading: loadingMessages, sendMessage } = useRealtimeMessages(activeChannel);

  useEffect(() => {
    fetch("/api/chat/channels")
      .then((r) => r.json())
      .then((d) => {
        const chs = d.channels || [];
        setChannels(chs);
        if (chs.length > 0) setActiveChannel(chs[0].id);
      })
      .finally(() => setLoadingChannels(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    await sendMessage(input.trim());
    setInput("");
    setSending(false);
  }

  const activeChannelData = channels.find((c) => c.id === activeChannel);

  return (
    <PageLayout maxWidth="max-w-5xl" footer={<div />}>
      <div className="flex gap-4 h-[calc(100vh-180px)]">
        {/* Channel sidebar */}
        <div className="w-48 shrink-0 hidden sm:block">
          <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-stone-500 dark:text-stone-400 mb-3">
            Kanaler
          </div>
          {loadingChannels ? (
            <div className="flex justify-center py-4">
              <div className="w-4 h-4 border-2 border-stone-300 border-t-stone-900 dark:border-stone-700 dark:border-t-stone-100 rounded-full animate-spin" />
            </div>
          ) : channels.length === 0 ? (
            <p className="text-xs text-stone-500 italic">Inga kanaler ännu.</p>
          ) : (
            <div className="space-y-1">
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                    activeChannel === ch.id
                      ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                      : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
                  }`}
                >
                  <span className="mr-1.5">{ch.channel_type === "group" ? "#" : "→"}</span>
                  {ch.display_name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Channel header */}
          {activeChannelData && (
            <div className="border-b border-stone-200 dark:border-stone-800 pb-3 mb-3">
              <span className="text-sm font-serif text-stone-900 dark:text-stone-100">
                {activeChannelData.channel_type === "group" ? "#" : "→"} {activeChannelData.display_name}
              </span>

              {/* Mobile channel switcher */}
              <div className="flex gap-1 mt-2 sm:hidden overflow-x-auto">
                {channels.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    className={`shrink-0 px-2 py-1 text-[10px] tracking-[0.1em] uppercase border ${
                      activeChannel === ch.id
                        ? "bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900"
                        : "border-stone-300 dark:border-stone-700 text-stone-500"
                    }`}
                  >
                    {ch.display_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {!activeChannel ? (
              <Card>
                <p className="text-sm text-stone-500 text-center py-12">
                  {loadingChannels ? "Laddar..." : "Inga chatkanaler tillgängliga ännu. Admin behöver skapa kanaler."}
                </p>
              </Card>
            ) : loadingMessages ? (
              <div className="flex justify-center py-12">
                <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-900 dark:border-stone-700 dark:border-t-stone-100 rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-xs text-stone-400 italic">Inga meddelanden ännu. Var först att skriva!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isOwn = msg.guest_id === guest?.guest_id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[75%] px-3 py-2 ${
                      isOwn
                        ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                        : "bg-white dark:bg-[#1a1918] border border-stone-200 dark:border-stone-800"
                    }`}>
                      {!isOwn && (
                        <div className="text-[10px] tracking-[0.1em] uppercase font-medium mb-0.5 opacity-60">
                          {msg.guest?.name || "Okänd"}
                        </div>
                      )}
                      <p className="text-sm break-words">{msg.content}</p>
                      <div className={`text-[9px] mt-1 ${isOwn ? "opacity-50" : "text-stone-400"}`}>
                        {new Date(msg.created_at).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {activeChannel && (
            <form onSubmit={handleSend} className="mt-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Skriv ett meddelande..."
                className="flex-1 px-4 py-2.5 bg-white dark:bg-[#1a1918] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 placeholder:text-stone-400"
              />
              <Button type="submit" loading={sending} disabled={!input.trim()}>
                Skicka
              </Button>
            </form>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
