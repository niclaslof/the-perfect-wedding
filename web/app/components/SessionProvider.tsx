"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { SessionPayload } from "@/app/lib/types";

type SessionContextType = {
  guest: SessionPayload | null;
  loading: boolean;
  login: (code: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType>({
  guest: null,
  loading: true,
  login: async () => ({ ok: false }),
  logout: async () => {},
  refresh: async () => {},
});

export function useSession() {
  return useContext(SessionContext);
}

export default function SessionProvider({ children }: { children: ReactNode }) {
  const [guest, setGuest] = useState<SessionPayload | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setGuest(data.guest);
      } else {
        setGuest(null);
      }
    } catch {
      setGuest(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function login(code: string) {
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (res.ok) {
        setGuest({
          guest_id: data.guest.id,
          wedding_id: data.guest.wedding_id,
          role: data.guest.role,
          name: data.guest.name,
        });
        return { ok: true };
      }
      return { ok: false, error: data.error || "Ogiltig kod" };
    } catch {
      return { ok: false, error: "Nätverksfel" };
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setGuest(null);
  }

  return (
    <SessionContext.Provider value={{ guest, loading, login, logout, refresh }}>
      {children}
    </SessionContext.Provider>
  );
}
