"use client";

import { useEffect, useState } from "react";
import PageLayout from "@/app/components/ui/PageLayout";
import Hero from "@/app/components/ui/Hero";
import Section from "@/app/components/ui/Section";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import type { Wedding } from "@/app/lib/types";

export default function SettingsPage() {
  const [wedding, setWedding] = useState<Partial<Wedding>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/wedding")
      .then((r) => r.json())
      .then((d) => setWedding(d.wedding || {}))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/wedding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wedding),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <PageLayout maxWidth="max-w-3xl">
      <Hero
        eyebrow="Administration"
        titleLine1="Inställningar"
        intro="Hantera bröllopets grundläggande information."
      />

      <Section number="01" title="Bröllopsdetaljer">
        <Card size="lg">
          <div className="space-y-4">
            <Input
              label="Bröllopsnamn"
              value={wedding.name || ""}
              onChange={(e) => setWedding({ ...wedding, name: e.target.value })}
              placeholder="Anna & Erik"
            />
            <Input
              label="Datum"
              type="date"
              value={wedding.date || ""}
              onChange={(e) => setWedding({ ...wedding, date: e.target.value })}
            />
            <Input
              label="OSA-deadline"
              type="date"
              value={wedding.osa_deadline || ""}
              onChange={(e) => setWedding({ ...wedding, osa_deadline: e.target.value })}
            />
            <Input
              label="Platsnamn"
              value={wedding.venue_name || ""}
              onChange={(e) => setWedding({ ...wedding, venue_name: e.target.value })}
              placeholder="Slottet"
            />
            <Input
              label="Adress"
              value={wedding.venue_address || ""}
              onChange={(e) => setWedding({ ...wedding, venue_address: e.target.value })}
              placeholder="Storgatan 1, 123 45 Stad"
            />
            <Input
              label="Klädsel"
              value={wedding.dress_code || ""}
              onChange={(e) => setWedding({ ...wedding, dress_code: e.target.value })}
              placeholder="Mörk kostym / festklänning"
            />
            <div className="flex items-center gap-3 pt-2">
              <Button onClick={handleSave} loading={saving}>
                Spara
              </Button>
              {saved && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400">Sparat!</span>
              )}
            </div>
          </div>
        </Card>
      </Section>
    </PageLayout>
  );
}
