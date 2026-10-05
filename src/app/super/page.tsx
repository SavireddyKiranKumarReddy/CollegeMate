"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuperRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/dashboard"); }, [router]);
  return <div className="page"><p className="muted text-[14px]">Redirecting to /dashboard…</p></div>;
}
