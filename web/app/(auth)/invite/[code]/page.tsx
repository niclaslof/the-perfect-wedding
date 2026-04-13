"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/app/components/SessionProvider";
import PageLayout from "@/app/components/ui/PageLayout";
import Card from "@/app/components/ui/Card";

export default function InviteCodePage() {
  const params = useParams();
  const code = params.code as string;
  const { login } = useSession();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code) return;
    login(code).then((result) => {
      if (result.ok) {
        router.replace("/dashboard");
      } else {
        setError(result.error || "Ogiltig kod");
        setStatus("error");
      }
    });
  }, [code, login, router]);

  return (
    <PageLayout maxWidth="max-w-3xl" hideNav>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card variant="emphasis" size="lg" className="text-center max-w-md w-full">
          {status === "loading" ? (
            <>
              <div className="w-8 h-8 mx-auto border-2 border-stone-300 border-t-stone-900 dark:border-stone-700 dark:border-t-stone-100 rounded-full animate-spin" />
              <p className="mt-4 text-sm text-stone-600 dark:text-stone-300">
                Verifierar din inbjudningskod...
              </p>
              <p className="mt-2 font-mono text-lg tracking-[0.3em] text-stone-900 dark:text-stone-100">
                {code.toUpperCase()}
              </p>
            </>
          ) : (
            <>
              <p className="text-red-600 dark:text-red-400 font-medium">
                {error}
              </p>
              <a
                href="/login"
                className="mt-4 inline-block text-xs tracking-[0.15em] uppercase text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                Prova igen &rarr;
              </a>
            </>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
