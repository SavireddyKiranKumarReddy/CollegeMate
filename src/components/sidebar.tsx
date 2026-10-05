"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type SideItem = { href: string; label: string; tag?: string };

function isActive(path: string, href: string) {
  if (path === href) return true;
  // Parent stays highlighted for nested routes, but never match the site root broadly.
  if (href !== "/" && path.startsWith(href + "/")) return true;
  return false;
}

export default function Sidebar({ title, sub, items }: { title: string; sub?: string; items: SideItem[] }) {
  const path = usePathname();
  return (
    <aside className="w-full shrink-0 md:w-60" aria-label="Section navigation">
      <div className="card overflow-hidden md:sticky md:top-24">
        <div className="border-b border-[#EDE9DD] px-4 py-3.5">
          <div className="truncate text-[14px] font-semibold">{title}</div>
          {sub && <div className="mono muted mt-0.5 truncate text-[11px]">{sub}</div>}
        </div>
        <nav className="flex gap-1 overflow-x-auto p-2 md:flex-col" aria-label={title}>
          {items.map((it) => {
            const active = isActive(path, it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center justify-between gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-[13.5px] font-medium transition ${
                  active ? "bg-[#2E4BFF] text-white" : "muted hover:bg-[#ECE8DB] hover:text-[#0E1B2E]"
                }`}
              >
                {it.label}
                {it.tag && <span className={`mono text-[10.5px] ${active ? "text-white/80" : "muted"}`}>{it.tag}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export function PanelShell({ sidebar, children }: { sidebar: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="page flex flex-col gap-4 md:flex-row">
      {sidebar}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
