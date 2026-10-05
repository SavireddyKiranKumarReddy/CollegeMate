"use client";
import { use } from "react";
import { useCollege } from "@/lib/use-college";

export default function CollegeSettings({ params }: { params: Promise<{ college: string }> }) {
  const { college: slug } = use(params);
  const { college } = useCollege(slug);

  return (
    <div>
      <p className="eyebrow">College admin · Settings</p>
      <h1 className="h2 mt-2">Settings</h1>
      <div className="card card-pad mt-5 space-y-3">
        <div>
          <div className="label">College</div>
          <div className="text-[14px] font-medium">{college?.name || "…"}</div>
        </div>
        <div>
          <div className="label">Workspace URL</div>
          <code className="mono text-[13px]">/{college?.domain || "…"}</code>
        </div>
        <div>
          <div className="label">College admin</div>
          <div className="text-[14px]">{college?.admin_email || "—"}</div>
        </div>
        <div>
          <div className="label">Contact</div>
          <div className="text-[14px]">{college?.city || "—"}</div>
        </div>
        <p className="muted text-[12.5px]">To change admin email or status, ask super admin at /dashboard.</p>
      </div>
    </div>
  );
}
