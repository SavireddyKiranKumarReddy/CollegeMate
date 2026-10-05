"use client";
import Sidebar, { PanelShell } from "@/components/sidebar";

const ITEMS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/colleges", label: "Colleges", tag: "approve" },
  { href: "/dashboard/activity", label: "Activity", tag: "logs" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PanelShell
      sidebar={<Sidebar title="Super admin" sub="Control plane" items={ITEMS} />}
    >
      {children}
    </PanelShell>
  );
}
