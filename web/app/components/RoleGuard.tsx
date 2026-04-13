"use client";

import { useSession } from "./SessionProvider";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import type { Role } from "@/app/lib/types";

type RoleGuardProps = {
  children: ReactNode;
  /** Roles that are allowed to see this content */
  allowed: Role[];
  /** Where to redirect if not authorized. Defaults to "/" */
  redirectTo?: string;
};

export default function RoleGuard({
  children,
  allowed,
  redirectTo = "/",
}: RoleGuardProps) {
  const { guest, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!guest || !allowed.includes(guest.role))) {
      router.replace(redirectTo);
    }
  }, [guest, loading, allowed, redirectTo, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-900 dark:border-stone-700 dark:border-t-stone-100 rounded-full animate-spin" />
      </div>
    );
  }

  if (!guest || !allowed.includes(guest.role)) {
    return null;
  }

  return <>{children}</>;
}
