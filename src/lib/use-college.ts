"use client";
import { useEffect, useState } from "react";

export type College = { id: string; name: string; domain: string; city: string; status: string; admin_email: string | null };

export function useCollege(slug: string) {
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/colleges").then((x) => x.json());
        setCollege((r.colleges || []).find((c: College) => c.domain === slug) || null);
      } catch {}
      setLoading(false);
    })();
  }, [slug]);

  return { college, loading };
}
