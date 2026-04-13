"use client";

import { useEffect, useState } from "react";
import PageLayout from "@/app/components/ui/PageLayout";
import Hero from "@/app/components/ui/Hero";
import Section from "@/app/components/ui/Section";
import Card from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";
import type { Guest, RSVP } from "@/app/lib/types";

type Filter = "all" | "attending" | "declined" | "pending";

export default function RSVPOverview() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/guests").then((r) => r.json()),
      fetch("/api/admin/rsvps").then((r) => r.json()),
    ])
      .then(([g, r]) => {
        setGuests(g.guests || []);
        setRsvps(r.rsvps || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const guestWithRsvp = guests
    .filter((g) => g.role !== "admin")
    .map((g) => ({
      guest: g,
      rsvp: rsvps.find((r) => r.guest_id === g.id) || null,
    }))
    .filter((item) => {
      if (filter === "attending") return item.rsvp?.attending === true;
      if (filter === "declined") return item.rsvp?.attending === false;
      if (filter === "pending") return !item.rsvp?.responded_at;
      return true;
    });

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "Alla" },
    { key: "attending", label: "Kommer" },
    { key: "declined", label: "Avböjt" },
    { key: "pending", label: "Väntar" },
  ];

  return (
    <PageLayout maxWidth="max-w-5xl">
      <Hero
        eyebrow="Administration"
        titleLine1="OSA-svar"
        intro="Överblick över alla gästers svar."
      />

      <Section number="01" title="Filter">
        <div className="flex gap-2 mb-6">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-xs tracking-[0.1em] uppercase transition-colors border ${
                filter === f.key
                  ? "bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100"
                  : "border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-900 dark:border-stone-700 dark:border-t-stone-100 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {guestWithRsvp.map(({ guest, rsvp }) => (
              <Card key={guest.id} size="sm" corners={false}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-sm font-medium text-stone-900 dark:text-stone-100">{guest.name}</span>
                    {rsvp?.plus_one_attending && rsvp.plus_one_name && (
                      <span className="ml-2 text-xs text-stone-500">+ {rsvp.plus_one_name}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {rsvp?.responded_at ? (
                      <Badge variant={rsvp.attending ? "success" : "error"}>
                        {rsvp.attending ? "Kommer" : "Avböjt"}
                      </Badge>
                    ) : (
                      <Badge variant="warning">Väntar</Badge>
                    )}
                    {rsvp?.message && (
                      <span className="text-[10px] text-stone-400 italic max-w-[200px] truncate hidden sm:block">
                        &ldquo;{rsvp.message}&rdquo;
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            {guestWithRsvp.length === 0 && (
              <p className="text-sm text-stone-500 text-center py-8">Inga gäster matchar filtret.</p>
            )}
          </div>
        )}
      </Section>
    </PageLayout>
  );
}
