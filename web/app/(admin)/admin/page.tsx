"use client";

import { useEffect, useState } from "react";
import PageLayout from "@/app/components/ui/PageLayout";
import Hero from "@/app/components/ui/Hero";
import Section from "@/app/components/ui/Section";
import Card from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";
import type { Guest, RSVP } from "@/app/lib/types";

export default function AdminDashboard() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);

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

  const attending = rsvps.filter((r) => r.attending === true).length;
  const declined = rsvps.filter((r) => r.attending === false).length;
  const pending = guests.filter((g) => g.role === "guest" || g.role === "coordinator").length - attending - declined;
  const coordinators = guests.filter((g) => g.role === "coordinator").length;

  return (
    <PageLayout maxWidth="max-w-5xl">
      <Hero
        eyebrow="Administration"
        titleLine1="Admin"
        titleLine2="Dashboard"
      />

      {/* Metrics */}
      <Section number="01" title="Översikt">
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          {[
            { label: "Inbjudna", value: guests.length, variant: "default" as const },
            { label: "Kommer", value: attending, variant: "success" as const },
            { label: "Avböjt", value: declined, variant: "error" as const },
            { label: "Väntar", value: pending, variant: "warning" as const },
          ].map((m) => (
            <Card key={m.label} size="sm">
              <div className="text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-stone-400 mb-1">
                {m.label}
              </div>
              <div className="text-3xl font-serif text-stone-900 dark:text-stone-100">
                {loading ? "..." : m.value}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Quick links */}
      <Section number="02" title="Hantera">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { href: "/admin/guests", label: "Gäster", desc: "Bjud in, redigera, ta bort", icon: "G" },
            { href: "/admin/rsvps", label: "OSA-svar", desc: "Se vem som kommer, allergier", icon: "O" },
            { href: "/admin/roles", label: "Roller", desc: "Tilldela toastmaster, DJ, fotograf", icon: "R" },
            { href: "/admin/schedule", label: "Schema", desc: "Hantera programpunkter", icon: "S" },
            { href: "/admin/settings", label: "Inställningar", desc: "Datum, plats, OSA-deadline", icon: "⚙" },
            { href: "/admin/notifications", label: "Notiser", desc: "Skicka info till gäster", icon: "N" },
          ].map((link) => (
            <a key={link.href} href={link.href}>
              <Card size="sm" hover>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 border border-stone-300 dark:border-stone-700 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-mono text-stone-500">{link.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-serif text-stone-900 dark:text-stone-100">{link.label}</h3>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">{link.desc}</p>
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </Section>

      {/* Recent guests */}
      {!loading && guests.length > 0 && (
        <Section number="03" title="Senaste gäster">
          <Card size="sm">
            <div className="space-y-2">
              {guests.slice(-5).reverse().map((g) => {
                const guestRsvp = rsvps.find((r) => r.guest_id === g.id);
                return (
                  <div key={g.id} className="flex items-center justify-between py-1.5 border-b border-stone-200 dark:border-stone-800 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-stone-900 dark:text-stone-100">{g.name}</span>
                      {g.role !== "guest" && (
                        <Badge variant={g.role === "admin" ? "warning" : "success"}>
                          {g.role}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-stone-400">{g.invite_code}</span>
                      {guestRsvp ? (
                        <Badge variant={guestRsvp.attending ? "success" : "error"}>
                          {guestRsvp.attending ? "Ja" : "Nej"}
                        </Badge>
                      ) : (
                        <Badge variant="warning">Väntar</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </Section>
      )}
    </PageLayout>
  );
}
