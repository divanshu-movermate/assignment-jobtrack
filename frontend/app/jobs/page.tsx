"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { useAuth } from "@/lib/auth-context";

// Placeholder — Step 11 replaces this with the real table,
// search/filter/sort/pagination, and Create Job modal.
export default function JobsPage() {
  const { logout } = useAuth();

  return (
    <AppShell>
      <Topbar title="Jobs" />
      <div className="p-7">
        <p className="text-sm text-ink-500">Auth shell is wired up.</p>
        <button
          onClick={() => logout()}
          className="mt-4 text-sm font-semibold text-brand hover:text-brand-hover"
        >
          Log out
        </button>
      </div>
    </AppShell>
  );
}