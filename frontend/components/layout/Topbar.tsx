"use client";

import { Bell } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface TopbarProps {
  title: string;
  actions?: React.ReactNode; // e.g. a "Create job" button, rendered by the page itself
}

export function Topbar({ title, actions }: TopbarProps) {
  const { user } = useAuth();

  const initials = user
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <div className="flex items-center justify-between px-7 py-4 bg-surface border-b border-line">
      <h1 className="text-[19px] font-bold text-ink-900 m-0">{title}</h1>

      <div className="flex items-center gap-3.5">
        {actions}

        <button
          type="button"
          aria-label="Notifications"
          className="w-9 h-9 rounded-lg border border-line bg-white flex items-center justify-center text-ink-500"
        >
          <Bell size={16} />
        </button>

        {user && (
          <div className="flex items-center gap-2 text-[13px] font-medium text-ink-700">
            <div className="w-[30px] h-[30px] rounded-full bg-brand-tint text-brand font-bold text-xs flex items-center justify-center">
              {initials}
            </div>
            <span>{user.name}</span>
            <span className="text-[10px] font-bold uppercase tracking-wide px-[7px] py-0.5 rounded-full bg-brand-tint text-brand">
              {user.role}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}