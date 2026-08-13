"use client";

import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { JOB_STATUS_LABELS, JOB_STATUS_ORDER } from "@/lib/statusStyles";
import type { JobStatus } from "@/lib/types";

const STATUS_OPTIONS = [
  ...JOB_STATUS_ORDER.map((s) => ({ value: s, label: JOB_STATUS_LABELS[s] })),
  { value: "cancelled", label: JOB_STATUS_LABELS.cancelled },
];

const SORT_OPTIONS = [
  {
    value: "scheduledDate:desc",
    label: "Scheduled date (newest)",
  },
  {
    value: "scheduledDate:asc",
    label: "Scheduled date (oldest)",
  },
];

interface JobsToolbarProps {
  search: string;
  status: JobStatus | "";
  sort: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: JobStatus | "") => void;
  onSortChange: (value: string) => void;
  onCreate: () => void;
}

export function JobsToolbar({
  search,
  status,
  sort,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onCreate,
}: JobsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="relative flex-1 min-w-[220px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by customer, address…"
          className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <div className="w-44">
        <Select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as JobStatus | "")}
          options={STATUS_OPTIONS}
          placeholder="All statuses"
        />
      </div>

      <div className="w-52">
        <Select value={sort} onChange={(e) => onSortChange(e.target.value)} options={SORT_OPTIONS} />
      </div>

      <Button onClick={onCreate} className="ml-auto">
        <Plus size={15} />
        Create job
      </Button>
    </div>
  );
}