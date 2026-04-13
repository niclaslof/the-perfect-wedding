"use client";

import { useEffect, useState } from "react";
import PageLayout from "@/app/components/ui/PageLayout";
import Hero from "@/app/components/ui/Hero";
import Section from "@/app/components/ui/Section";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";
import Input from "@/app/components/ui/Input";
import Modal from "@/app/components/ui/Modal";
import type { Guest } from "@/app/lib/types";

export default function GuestManagement() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [plusOne, setPlusOne] = useState(false);
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    loadGuests();
  }, []);

  async function loadGuests() {
    const res = await fetch("/api/admin/guests");
    const data = await res.json();
    setGuests(data.guests || []);
    setLoading(false);
  }

  async function handleAdd() {
    if (!newName.trim()) return;
    setAdding(true);
    const res = await fetch("/api/admin/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName.trim(),
        email: newEmail.trim() || null,
        phone: newPhone.trim() || null,
        plus_one_allowed: plusOne,
      }),
    });
    if (res.ok) {
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      setPlusOne(false);
      setShowAdd(false);
      await loadGuests();
    }
    setAdding(false);
  }

  const filtered = guests.filter((g) =>
    g.name.toLowerCase().includes(filter.toLowerCase()) ||
    g.email?.toLowerCase().includes(filter.toLowerCase()) ||
    g.invite_code.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <PageLayout maxWidth="max-w-5xl">
      <Hero
        eyebrow="Administration"
        titleLine1="Gästhantering"
        intro={`${guests.length} gäster inbjudna`}
      />

      <Section number="01" title="Gäster">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Sök gäster..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowAdd(true)}>
            + Lägg till gäst
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-900 dark:border-stone-700 dark:border-t-stone-100 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <p className="text-sm text-stone-500 dark:text-stone-400 text-center py-8">
              {guests.length === 0 ? "Inga gäster ännu. Lägg till din första gäst!" : "Inga gäster matchar sökningen."}
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {filtered.map((g) => (
              <Card key={g.id} size="sm" corners={false}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-stone-900 dark:text-stone-100">{g.name}</span>
                    {g.role !== "guest" && (
                      <Badge variant={g.role === "admin" ? "warning" : "success"}>
                        {g.coordinator_type || g.role}
                      </Badge>
                    )}
                    {g.plus_one_allowed && (
                      <Badge>+1</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {g.email && (
                      <span className="text-[10px] text-stone-400 hidden sm:block">{g.email}</span>
                    )}
                    <span className="font-mono text-xs tracking-[0.2em] text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5">
                      {g.invite_code}
                    </span>
                    {g.invite_sent_at ? (
                      <Badge variant="success">Skickad</Badge>
                    ) : (
                      <Badge variant="default">Ej skickad</Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>

      {/* Add guest modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Lägg till gäst">
        <div className="space-y-4">
          <Input
            label="Namn"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Förnamn Efternamn"
            autoFocus
          />
          <Input
            label="Email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="email@example.com"
          />
          <Input
            label="Telefon"
            type="tel"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            placeholder="+46..."
          />
          <label className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300 cursor-pointer">
            <input
              type="checkbox"
              checked={plusOne}
              onChange={(e) => setPlusOne(e.target.checked)}
              className="w-4 h-4"
            />
            Tillåt plus-one
          </label>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleAdd} loading={adding}>Lägg till</Button>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>Avbryt</Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
}
