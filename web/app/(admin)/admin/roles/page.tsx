"use client";

import { useEffect, useState } from "react";
import PageLayout from "@/app/components/ui/PageLayout";
import Hero from "@/app/components/ui/Hero";
import Section from "@/app/components/ui/Section";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";
import type { Guest } from "@/app/lib/types";

const ROLES: { value: string; label: string }[] = [
  { value: "toastmaster", label: "Toastmaster" },
  { value: "dj", label: "DJ" },
  { value: "photographer", label: "Fotograf" },
];

export default function RolesPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/guests")
      .then((r) => r.json())
      .then((d) => setGuests(d.guests || []))
      .finally(() => setLoading(false));
  }, []);

  async function assignRole(guestId: string, coordinatorType: string | null) {
    await fetch(`/api/admin/guests/${guestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: coordinatorType ? "coordinator" : "guest",
        coordinator_type: coordinatorType,
      }),
    });
    // Reload
    const res = await fetch("/api/admin/guests");
    const data = await res.json();
    setGuests(data.guests || []);
  }

  const coordinators = guests.filter((g) => g.role === "coordinator");
  const regularGuests = guests.filter((g) => g.role === "guest");

  return (
    <PageLayout maxWidth="max-w-4xl">
      <Hero
        eyebrow="Administration"
        titleLine1="Roller"
        intro="Tilldela speciella roller till gäster."
      />

      <Section number="01" title="Aktiva roller">
        {coordinators.length === 0 ? (
          <Card>
            <p className="text-sm text-stone-500 dark:text-stone-400 text-center py-4">
              Inga roller tilldelade ännu.
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {coordinators.map((g) => (
              <Card key={g.id} size="sm" corners={false}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-stone-900 dark:text-stone-100">{g.name}</span>
                    <Badge variant="success">{g.coordinator_type}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => assignRole(g.id, null)}>
                    Ta bort roll
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>

      <Section number="02" title="Tilldela roller">
        <div className="space-y-2">
          {regularGuests.map((g) => (
            <Card key={g.id} size="sm" corners={false}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-sm text-stone-900 dark:text-stone-100">{g.name}</span>
                <div className="flex gap-1">
                  {ROLES.map((role) => (
                    <Button
                      key={role.value}
                      variant="ghost"
                      size="sm"
                      onClick={() => assignRole(g.id, role.value)}
                    >
                      {role.label}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          ))}
          {regularGuests.length === 0 && !loading && (
            <p className="text-sm text-stone-500 text-center py-4">Inga gäster utan roll.</p>
          )}
        </div>
      </Section>
    </PageLayout>
  );
}
