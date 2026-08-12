"use client";

// Not a Next.js layout.tsx anymore — a plain component each protected page
// imports and wraps its own content with:
//
//   export default function JobsPage() {
//     return (
//       <AppShell>
//         <Topbar title="Jobs" />
//         ...page content...
//       </AppShell>
//     );
//   }
//
// This does the same job the (protected) route group's layout did — auth
// check + redirect + sidebar — just applied per-page instead of per-folder,
// since the flat /jobs, /customers, /dashboard structure has no shared
// folder to hang a layout.tsx off without also affecting /login.
//
// WHY THE AUTH CHECK IS CLIENT-SIDE: the backend is a separate origin, so
// its httpOnly auth cookie is never sent to the Next.js server — only to
// the backend itself (via credentials: "include" in lib/api.ts). Neither
// middleware.ts nor a server component can read it. Asking the backend
// directly, via /auth/me in AuthProvider, is the only reliable check.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink-500 text-sm">
        Loading…
      </div>
    );
  }

  if (!user) {
    return null; // redirect effect above is already firing
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 bg-paper">{children}</div>
    </div>
  );
}