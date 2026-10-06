"use client";
import { use } from "react";
import Sidebar, { PanelShell } from "@/components/sidebar";
import { useCollege } from "@/lib/use-college";

export default function CollegeLayout({ children, params }: { children: React.ReactNode; params: Promise<{ college: string }> }) {
  const { college: slug } = use(params);
  const { college: c } = useCollege(slug);
  const items = [
    { href: `/${slug}`, label: "Overview" },
    { href: `/${slug}/departments`, label: "Departments" },
    { href: `/${slug}/faculty`, label: "Faculty access", tag: "links" },
    { href: `/${slug}/documents`, label: "Documents" },
    { href: `/${slug}/knowledge`, label: "Knowledge", tag: "facts" },
    { href: `/${slug}/chat`, label: "Test chat", tag: "try" },
    { href: `/${slug}/settings`, label: "Settings" },
  ];
  return (
    <PanelShell sidebar={<Sidebar title={c?.name || slug} sub={c ? `${c.status} · admin` : "college workspace"} items={items} />}>
      {children}
    </PanelShell>
  );
}
