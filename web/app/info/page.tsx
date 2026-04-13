"use client";

import { useEffect, useState } from "react";
import PageLayout from "@/app/components/ui/PageLayout";
import Hero from "@/app/components/ui/Hero";
import Section from "@/app/components/ui/Section";
import Card from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";
import type { RSVP } from "@/app/lib/types";

export default function InfoPage() {
  const [rsvp, setRsvp] = useState<RSVP | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rsvp")
      .then((r) => r.json())
      .then((d) => setRsvp(d.rsvp))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hasAccepted = rsvp?.attending === true;

  return (
    <PageLayout maxWidth="max-w-4xl">
      <Hero
        eyebrow="Information"
        titleLine1="Bröllopsinfo"
        intro="All information om bröllopet samlad på ett ställe."
      />

      {/* Basic info — always visible */}
      <Section number="01" title="Översikt">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card size="sm">
            <div className="text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-stone-400 mb-1">
              Datum
            </div>
            <p className="text-lg font-serif text-stone-900 dark:text-stone-100">
              Datum meddelas snart
            </p>
          </Card>
          <Card size="sm">
            <div className="text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-stone-400 mb-1">
              Plats
            </div>
            <p className="text-lg font-serif text-stone-900 dark:text-stone-100">
              Plats meddelas snart
            </p>
          </Card>
        </div>
      </Section>

      {/* OSA prompt if not responded */}
      {!loading && !hasAccepted && (
        <Section number="02" title="OSA krävs">
          <Card variant="subtle">
            <div className="flex items-center gap-3">
              <Badge variant="warning">Väntar på svar</Badge>
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Mer information låses upp efter du har svarat på din inbjudan.
              </p>
            </div>
            <a
              href="/osa"
              className="mt-4 inline-block text-xs tracking-[0.15em] uppercase font-medium text-stone-900 dark:text-stone-100 hover:opacity-70 transition-opacity"
            >
              Svara nu &rarr;
            </a>
          </Card>
        </Section>
      )}

      {/* Detailed info — only after RSVP yes */}
      {hasAccepted && (
        <>
          <Section number="02" title="Klädsel">
            <Card>
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Klädsel meddelas av brudparet.
              </p>
            </Card>
          </Section>

          <Section number="03" title="Schema">
            <Card>
              <p className="text-sm text-stone-500 dark:text-stone-400 italic">
                Detaljerat schema publiceras snart.
              </p>
            </Card>
          </Section>

          <Section number="04" title="Hitta dit">
            <Card>
              <p className="text-sm text-stone-500 dark:text-stone-400 italic">
                Karta och vägbeskrivning kommer snart.
              </p>
            </Card>
          </Section>

          <Section number="05" title="Meny">
            <Card>
              <p className="text-sm text-stone-500 dark:text-stone-400 italic">
                Meny publiceras snart.
              </p>
            </Card>
          </Section>
        </>
      )}
    </PageLayout>
  );
}
