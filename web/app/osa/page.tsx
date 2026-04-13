"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/app/components/SessionProvider";
import PageLayout from "@/app/components/ui/PageLayout";
import Hero from "@/app/components/ui/Hero";
import Section from "@/app/components/ui/Section";
import Card from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";
import RSVPForm from "@/app/components/RSVPForm";
import type { RSVP } from "@/app/lib/types";

export default function OSAPage() {
  const { guest } = useSession();
  const [rsvp, setRsvp] = useState<RSVP | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rsvp")
      .then((r) => r.json())
      .then((d) => setRsvp(d.rsvp))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(data: {
    attending: boolean;
    plus_one_attending: boolean;
    plus_one_name: string;
    message: string;
  }) {
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (res.ok) setRsvp(result.rsvp);
  }

  async function handleDietarySave(data: {
    is_plus_one: boolean;
    allergies: string[];
    dietary_type: string;
    other_notes: string;
  }) {
    await fetch("/api/dietary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  if (loading) {
    return (
      <PageLayout maxWidth="max-w-3xl">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-900 dark:border-stone-700 dark:border-t-stone-100 rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  // Already responded
  if (rsvp?.responded_at) {
    return (
      <PageLayout maxWidth="max-w-3xl">
        <Hero
          eyebrow="OSA"
          titleLine1="Tack för ditt svar!"
        />
        <Section number="01" title="Din status">
          <Card>
            <div className="flex items-center gap-3">
              <Badge variant={rsvp.attending ? "success" : "error"}>
                {rsvp.attending ? "Kommer" : "Kommer ej"}
              </Badge>
              {rsvp.plus_one_attending && rsvp.plus_one_name && (
                <Badge variant="success">+ {rsvp.plus_one_name}</Badge>
              )}
            </div>
            {rsvp.message && (
              <p className="mt-4 text-sm text-stone-600 dark:text-stone-300 italic">
                &ldquo;{rsvp.message}&rdquo;
              </p>
            )}
            <p className="mt-4 text-[10px] tracking-[0.15em] uppercase text-stone-400">
              Svarade {new Date(rsvp.responded_at).toLocaleDateString("sv-SE")}
            </p>
          </Card>
        </Section>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="max-w-3xl">
      <Hero
        eyebrow="OSA"
        titleLine1="Vänligen svara"
        titleLine2="på inbjudan"
        intro={`Hej ${guest?.name || ""}! Vi vill gärna veta om du kommer.`}
      />
      <Section number="01" title="Ditt svar">
        <RSVPForm
          plusOneAllowed={false}
          onSubmit={handleSubmit}
          onDietarySave={handleDietarySave}
        />
      </Section>
    </PageLayout>
  );
}
