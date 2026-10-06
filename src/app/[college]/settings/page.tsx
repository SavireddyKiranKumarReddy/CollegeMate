"use client";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useCollege } from "@/lib/use-college";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function CollegeSettings({ params }: { params: Promise<{ college: string }> }) {
  const { college: slug } = use(params);
  const { college } = useCollege(slug);
  const router = useRouter();

  async function logout() {
    try { localStorage.removeItem("cm_demo"); } catch {}
    try { await supabaseBrowser().auth.signOut(); } catch {}
    router.push("/login");
  }

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
      <div className="card card-pad mt-4">
        <div className="text-[14px] font-semibold">Session</div>
        <p className="muted mt-1 text-[12.5px]">Sign out of the college admin workspace on this device.</p>
        <button className="btn-danger-ghost mt-3" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
