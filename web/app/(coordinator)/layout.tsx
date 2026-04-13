"use client";

import { ReactNode } from "react";
import RoleGuard from "@/app/components/RoleGuard";

export default function CoordinatorLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowed={["coordinator", "admin"]} redirectTo="/dashboard">
      {children}
    </RoleGuard>
  );
}
