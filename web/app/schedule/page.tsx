"use client";

import { useEffect, useState } from "react";
import PageLayout from "@/app/components/ui/PageLayout";
import Hero from "@/app/components/ui/Hero";
import Section from "@/app/components/ui/Section";
import Card from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";
import type { EventPart, ScheduleItem } from "@/app/lib/types";

const ITEM_TYPE_LABELS: Record<string, string> = {
  general: "Allmänt",
  speech: "Tal",
  activity: "Aktivitet",
  meal: "Måltid",
  break: "Paus",
};

export default function SchedulePage() {
  const [eventParts, setEventParts] = useState<EventPart[]>([]);
  const [items, setItems] = useState<(ScheduleItem & { assigned_guest?: { name: string } })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/schedule")
      .then((r) => r.json())
      .then((d) => {
        setEventParts(d.event_parts || []);
        setItems(d.items || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout maxWidth="max-w-4xl">
      <Hero
        eyebrow="Program"
        titleLine1="Dagens"
        titleLine2="schema"
        intro="Hela programmet för bröllopsdagen."
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-900 dark:border-stone-700 dark:border-t-stone-100 rounded-full animate-spin" />
        </div>
      ) : eventParts.length === 0 ? (
        <Section number="01" title="Schema">
          <Card>
            <p className="text-sm text-stone-500 dark:text-stone-400 text-center py-8">
              Schemat publiceras snart av brudparet.
            </p>
          </Card>
        </Section>
      ) : (
        eventParts.map((part, i) => {
          const partItems = items.filter((item) => item.event_part_id === part.id);
          return (
            <Section key={part.id} number={String(i + 1).padStart(2, "0")} title={part.name}>
              {part.description && (
                <p className="text-sm text-stone-600 dark:text-stone-300 mb-4">{part.description}</p>
              )}
              {partItems.length === 0 ? (
                <Card size="sm">
                  <p className="text-sm text-stone-400 italic">Inga programpunkter ännu.</p>
                </Card>
              ) : (
                <div className="space-y-2">
                  {partItems.map((item) => (
                    <Card key={item.id} size="sm" corners={false}>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          {item.starts_at && (
                            <span className="font-mono text-xs text-stone-500 dark:text-stone-400 w-12 shrink-0">
                              {new Date(item.starts_at).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          )}
                          <div>
                            <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                              {item.title}
                            </span>
                            {item.description && (
                              <p className="text-[10px] text-stone-500 mt-0.5">{item.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>{ITEM_TYPE_LABELS[item.item_type] || item.item_type}</Badge>
                          {item.duration_minutes && (
                            <span className="text-[10px] font-mono text-stone-400">{item.duration_minutes} min</span>
                          )}
                          {item.assigned_guest && (
                            <span className="text-[10px] text-stone-500">{item.assigned_guest.name}</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Section>
          );
        })
      )}

      <Section number="00" title="Vill du hålla tal?" spacing="mb-8">
        <Card variant="subtle" size="sm">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-stone-600 dark:text-stone-300">
              Anmäl ditt intresse att hålla tal under bröllopet.
            </p>
            <a
              href="/speech"
              className="text-xs tracking-[0.15em] uppercase font-medium text-stone-900 dark:text-stone-100 hover:opacity-70 transition-opacity"
            >
              Anmäl tal &rarr;
            </a>
          </div>
        </Card>
      </Section>
    </PageLayout>
  );
}
