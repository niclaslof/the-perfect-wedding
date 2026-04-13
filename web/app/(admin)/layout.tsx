"use client";

import { ReactNode } from "react";
import RoleGuard from "@/app/components/RoleGuard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowed={["admin"]} redirectTo="/dashboard">
      {children}
    </RoleGuard>
  );
}
