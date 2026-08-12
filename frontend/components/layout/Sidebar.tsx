"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Users, LayoutDashboard, UserCog } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const WORKSPACE_ITEMS = [
  { href: "/jobs", label: "Jobs", icon: ClipboardList },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="w-60 flex-shrink-0 bg-ink text-white p-3.5 flex flex-col gap-7">
      <div className="flex items-center gap-2 px-2.5 font-heading font-extrabold text-[17px]">
        <span className="w-2.5 h-2.5 rounded-full bg-brand shadow-[0_0_0_4px_rgba(61,79,224,0.25)]" />
        JobTrack
      </div>

      <nav>
        <div className="text-[11px] font-bold tracking-widest uppercase text-[#6B7285] px-2.5 mb-2">
          Workspace
        </div>
        {WORKSPACE_ITEMS.map((item) => (
          <NavLink key={item.href} {...item} active={pathname.startsWith(item.href)} />
        ))}
      </nav>

      {/* Not rendered at all for staff — not hidden via CSS, genuinely absent
          from the DOM, matching Section 8.1's "not even a disabled button". */}
      {user?.role === "admin" && (
        <nav>
          <div className="text-[11px] font-bold tracking-widest uppercase text-[#6B7285] px-2.5 mb-2">
            Admin
          </div>
          <NavLink href="/team" label="Team" icon={UserCog} active={pathname.startsWith("/team")} />
        </nav>
      )}
    </aside>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof ClipboardList;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium mb-0.5 ${
        active ? "bg-brand/20 text-white" : "text-[#C6CBDA] hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon size={17} className={active ? "text-[#8C9AFB]" : "opacity-85"} />
      {label}
    </Link>
  );
}