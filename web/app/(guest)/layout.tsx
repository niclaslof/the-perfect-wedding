"use client";

import { ReactNode } from "react";
import RoleGuard from "@/app/components/RoleGuard";

export default function GuestLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowed={["guest", "coordinator", "admin"]} redirectTo="/login">
      {children}
    </RoleGuard>
  );
}
