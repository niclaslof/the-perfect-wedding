"use client";

import { useSession } from "@/app/components/SessionProvider";
import PageLayout from "@/app/components/ui/PageLayout";
import Hero from "@/app/components/ui/Hero";
import Section from "@/app/components/ui/Section";
import Card from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";

export default function DashboardPage() {
  const { guest, logout } = useSession();

  return (
    <PageLayout maxWidth="max-w-4xl">
      <Hero
        eyebrow={`Inloggad som ${guest?.name || "..."}`}
        titleLine1="Din sida"
        intro="Här ser du din information och status."
      />

      <Section number="01" title="Status">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card size="sm">
            <div className="text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-stone-400 mb-2">
              Roll
            </div>
            <Badge variant={guest?.role === "admin" ? "warning" : guest?.role === "coordinator" ? "success" : "default"}>
              {guest?.role === "admin" ? "Admin" : guest?.role === "coordinator" ? "Koordinator" : "Gäst"}
            </Badge>
          </Card>
          <Card size="sm">
            <div className="text-[10px] tracking-[0.2em] uppercase text-stone-500 dark:text-stone-400 mb-2">
              OSA
            </div>
            <Badge variant="warning">Ej svarat</Badge>
          </Card>
        </div>
      </Section>

      <Section number="02" title="Snabblänkar">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { href: "/info", label: "Bröllopsinfo", icon: "I" },
            { href: "/osa", label: "OSA / RSVP", icon: "O" },
            { href: "/schedule", label: "Schema", icon: "S" },
            { href: "/chat", label: "Chat", icon: "C" },
            { href: "/guestbook", label: "Gästbok", icon: "G" },
            { href: "/photos", label: "Foton", icon: "F" },
          ].map((link) => (
            <a key={link.href} href={link.href}>
              <Card size="sm" hover>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 border border-stone-300 dark:border-stone-700 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-mono text-stone-500">{link.icon}</span>
                  </div>
                  <span className="text-sm font-serif text-stone-900 dark:text-stone-100">{link.label}</span>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </Section>

      <div className="mt-8">
        <button
          onClick={logout}
          className="text-xs tracking-[0.15em] uppercase text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
        >
          Logga ut
        </button>
      </div>
    </PageLayout>
  );
}
