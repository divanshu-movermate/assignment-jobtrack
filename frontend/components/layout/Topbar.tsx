"use client";

import { Bell, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";

interface TopbarProps {
  title: string;
  actions?: React.ReactNode;
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

  const handleLogout = async () => {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
      });

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-line bg-surface px-7 py-4">
      <h1 className="m-0 text-[19px] font-bold text-ink-900">
        {title}
      </h1>

      <div className="flex items-center gap-3.5">
        {actions}

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-ink-500"
        >
          <Bell size={16} />
        </button>

        {user && (
          /*
           * group:
           * Everything inside this div becomes hoverable.
           * The dropdown appears when the user hovers anywhere
           * over initials + name + role.
           */
          <div className="group relative">
            {/* User information */}
            <div
              className="
                flex cursor-pointer items-center gap-2
                rounded-lg px-2 py-1.5
                text-[13px] font-medium text-ink-700
                transition hover:bg-ink-50
              "
            >
              {/* Initials */}
              <div
                className="
                  flex h-[30px] w-[30px] items-center justify-center
                  rounded-full bg-brand-tint
                  text-xs font-bold text-brand
                "
              >
                {initials}
              </div>

              {/* Name */}
              <span>{user.name}</span>

              {/* Role */}
              <span
                className="
                  rounded-full bg-brand-tint
                  px-[7px] py-0.5
                  text-[10px] font-bold uppercase tracking-wide
                  text-brand
                "
              >
                {user.role}
              </span>
            </div>

            {/* Dropdown */}
            <div
              className="
                invisible absolute right-0 top-full z-50
                mt-2 w-44
                translate-y-1
                rounded-xl border border-line
                bg-white p-1.5
                opacity-0 shadow-lg
                transition-all duration-150

                group-hover:visible
                group-hover:translate-y-0
                group-hover:opacity-100
              "
            >
              {/* View Profile */}
              <Link
                href="/profile"
                className="
                  flex items-center gap-3
                  rounded-lg px-3 py-2.5
                  text-xs font-medium text-ink-700
                  transition
                  hover:bg-ink-50 hover:text-ink-900
                "
              >
                <User size={15} />
                <span>View Profile</span>
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex w-full items-center gap-3
                  rounded-lg px-3 py-2.5
                  text-xs font-medium text-red-600
                  transition
                  hover:bg-red-50
                "
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}