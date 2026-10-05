"use client";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OldWorkspaceRedirect({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = use(params);
  const router = useRouter();
  useEffect(() => { router.replace(`/${domain}`); }, [router, domain]);
  return <div className="page"><p className="muted text-[14px]">Redirecting to /{domain}…</p></div>;
}
