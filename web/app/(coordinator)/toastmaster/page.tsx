"use client";

import { useEffect, useState } from "react";
import PageLayout from "@/app/components/ui/PageLayout";
import Hero from "@/app/components/ui/Hero";
import Section from "@/app/components/ui/Section";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";
import type { SpeechRequest } from "@/app/lib/types";

type SpeechWithGuest = SpeechRequest & { guest?: { name: string }; event_part?: { name: string } };

export default function ToastmasterPage() {
  const [requests, setRequests] = useState<SpeechWithGuest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    const res = await fetch("/api/speech-requests");
    const data = await res.json();
    setRequests(data.requests || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string, note?: string) {
    await fetch(`/api/speech-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, admin_note: note }),
    });
    await loadRequests();
  }

  const pending = requests.filter((r) => r.status === "pending");
  const handled = requests.filter((r) => r.status !== "pending");

  const STATUS_COLORS: Record<string, "default" | "success" | "error" | "warning"> = {
    pending: "warning",
    approved: "success",
    denied: "error",
    rescheduled: "warning",
  };

  return (
    <PageLayout maxWidth="max-w-4xl">
      <Hero
        eyebrow="Toastmaster"
        titleLine1="Toastmaster"
        titleLine2="Dashboard"
        intro="Hantera talförfrågningar och programmet."
      />

      <Section number="01" title={`Väntande förfrågningar (${pending.length})`}>
        {pending.length === 0 ? (
          <Card>
            <p className="text-sm text-stone-500 text-center py-4">Inga väntande förfrågningar.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {pending.map((r) => (
              <Card key={r.id} size="sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {r.guest?.name || "Okänd"}
                      </span>
                      <span className="ml-2 text-[10px] text-stone-500">
                        {r.topic || "Inget ämne"} &middot; {r.estimated_minutes} min
                      </span>
                    </div>
                    {r.event_part && (
                      <Badge>{r.event_part.name}</Badge>
                    )}
                  </div>
                  {r.preferred_time && (
                    <p className="text-xs text-stone-500">Önskar: {r.preferred_time}</p>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => updateStatus(r.id, "approved")}>
                      Godkänn
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => updateStatus(r.id, "denied")}>
                      Neka
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => {
                      const note = prompt("Föreslå alternativ tid:");
                      if (note) updateStatus(r.id, "rescheduled", note);
                    }}>
                      Föreslå annan tid
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>

      {handled.length > 0 && (
        <Section number="02" title="Hanterade">
          <div className="space-y-2">
            {handled.map((r) => (
              <Card key={r.id} size="sm" corners={false}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-sm text-stone-900 dark:text-stone-100">{r.guest?.name}</span>
                    <span className="ml-2 text-[10px] text-stone-500">{r.topic}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={STATUS_COLORS[r.status] || "default"}>
                      {r.status}
                    </Badge>
                    {r.admin_note && (
                      <span className="text-[10px] text-stone-400 italic">{r.admin_note}</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}
    </PageLayout>
  );
}
