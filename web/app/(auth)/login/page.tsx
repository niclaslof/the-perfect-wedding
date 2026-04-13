"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/components/SessionProvider";
import PageLayout from "@/app/components/ui/PageLayout";
import Hero from "@/app/components/ui/Hero";
import Section from "@/app/components/ui/Section";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useSession();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError("");
    const result = await login(code.trim());
    setLoading(false);

    if (result.ok) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Ogiltig kod");
    }
  }

  return (
    <PageLayout maxWidth="max-w-3xl" hideNav>
      <Hero
        eyebrow="Välkommen"
        titleLine1="The Perfect"
        titleLine2="Wedding"
        intro="Ange din personliga inbjudningskod för att komma åt all information om bröllopet."
      />

      <Section number="01" title="Ange din kod">
        <Card variant="emphasis" size="lg">
          <form onSubmit={handleSubmit} className="text-center">
            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError("");
                }}
                placeholder="Din kod..."
                className={`flex-1 px-4 py-3 bg-white dark:bg-[#0f0f0e] border ${
                  error ? "border-red-500" : "border-stone-300 dark:border-stone-700"
                } text-center font-mono text-lg tracking-[0.3em] uppercase text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100`}
                maxLength={8}
                autoFocus
              />
              <Button type="submit" loading={loading} size="lg">
                Logga in
              </Button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            <p className="text-[10px] tracking-[0.15em] uppercase text-stone-400 dark:text-stone-500 mt-4">
              Koden finns i din inbjudan
            </p>
          </form>
        </Card>
      </Section>
    </PageLayout>
  );
}
