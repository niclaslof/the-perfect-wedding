"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/app/components/SessionProvider";
import PageLayout from "@/app/components/ui/PageLayout";
import Hero from "@/app/components/ui/Hero";
import Section from "@/app/components/ui/Section";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";
import type { EventPart, SpeechRequest } from "@/app/lib/types";

export default function SpeechPage() {
  const { guest } = useSession();
  const [eventParts, setEventParts] = useState<EventPart[]>([]);
  const [requests, setRequests] = useState<(SpeechRequest & { event_part?: { name: string } })[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPart, setSelectedPart] = useState("");
  const [topic, setTopic] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [minutes, setMinutes] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/schedule").then((r) => r.json()),
      fetch("/api/speech-requests").then((r) => r.json()),
    ]).then(([s, sr]) => {
      setEventParts(s.event_parts || []);
      setRequests(sr.requests || []);
    }).finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPart) return;
    setSubmitting(true);
    const res = await fetch("/api/speech-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_part_id: selectedPart,
        topic,
        preferred_time: preferredTime,
        estimated_minutes: minutes,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setRequests([data.request, ...requests]);
      setTopic("");
      setPreferredTime("");
      setSelectedPart("");
    }
    setSubmitting(false);
  }

  const STATUS_MAP: Record<string, { label: string; variant: "default" | "success" | "error" | "warning" }> = {
    pending: { label: "Väntar", variant: "warning" },
    approved: { label: "Godkänt", variant: "success" },
    denied: { label: "Nekat", variant: "error" },
    rescheduled: { label: "Ombokat", variant: "warning" },
  };

  return (
    <PageLayout maxWidth="max-w-3xl">
      <Hero
        eyebrow="Tal"
        titleLine1="Anmäl"
        titleLine2="tal"
        intro="Vill du hålla tal under bröllopet? Anmäl ditt intresse här."
      />

      {/* Existing requests */}
      {requests.length > 0 && (
        <Section number="01" title="Dina förfrågningar">
          <div className="space-y-2">
            {requests.map((r) => (
              <Card key={r.id} size="sm">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-sm text-stone-900 dark:text-stone-100">
                      {r.topic || "Tal"}
                    </span>
                    {r.event_part && (
                      <span className="ml-2 text-[10px] text-stone-500">({r.event_part.name})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={STATUS_MAP[r.status]?.variant || "default"}>
                      {STATUS_MAP[r.status]?.label || r.status}
                    </Badge>
                    {r.admin_note && (
                      <span className="text-[10px] text-stone-500 italic">{r.admin_note}</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* New request form */}
      <Section number={requests.length > 0 ? "02" : "01"} title="Ny talförfrågan">
        <Card size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {eventParts.length > 0 ? (
              <div>
                <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-stone-500 dark:text-stone-400 mb-2">
                  Under vilken del?
                </div>
                <div className="flex flex-wrap gap-2">
                  {eventParts.map((part) => (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => setSelectedPart(part.id)}
                      className={`px-3 py-2 text-xs border transition-colors ${
                        selectedPart === part.id
                          ? "bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900"
                          : "border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400"
                      }`}
                    >
                      {part.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-stone-500 italic">
                Eventdelar har inte publicerats ännu. Kom tillbaka senare.
              </p>
            )}

            <div>
              <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-stone-500 dark:text-stone-400 mb-1.5">
                Ämne / beskrivning
              </div>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Vad handlar talet om?"
                className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1918] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-stone-500 dark:text-stone-400 mb-1.5">
                  Önskad tid
                </div>
                <input
                  type="text"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  placeholder="t.ex. efter maten"
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1918] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100"
                />
              </div>
              <div>
                <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-stone-500 dark:text-stone-400 mb-1.5">
                  Uppskattad längd (min)
                </div>
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                  min={1}
                  max={30}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#1a1918] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100"
                />
              </div>
            </div>

            <Button type="submit" loading={submitting} disabled={!selectedPart && eventParts.length > 0}>
              Skicka förfrågan
            </Button>
          </form>
        </Card>
      </Section>
    </PageLayout>
  );
}
