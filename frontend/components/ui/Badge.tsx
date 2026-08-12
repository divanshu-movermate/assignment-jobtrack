import type { ReactNode } from "react";
import type { JobStatus } from "@/lib/types";

export const STATUS_LABEL: Record<JobStatus, string> = {
  quote_requested: "Quote requested",
  quoted: "Quoted",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_COLOR: Record<JobStatus, string> = {
  quote_requested: "#697086",
  quoted: "#2C7BE5",
  confirmed: "#6D3FD1",
  in_progress: "#C67C11",
  completed: "#0F9D63",
  cancelled: "#D0453C",
};

export function StatusBadge({ status }: { status: JobStatus }) {
  const color = STATUS_COLOR[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ color, backgroundColor: `${color}1A` }}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-ink-tint px-2.5 py-0.5 text-xs font-medium text-ink-body ${className}`}
    >
      {children}
    </span>
  );
}
