"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { JOB_STATUS_LABELS, JOB_STATUS_ORDER, nextStatus } from "@/lib/statusStyles";
import type { JobStatus } from "@/lib/types";

interface StatusTrackProps {
  status: JobStatus;
  onChange: (status: JobStatus) => Promise<unknown>;
}

export function StatusTrack({ status, onChange }: StatusTrackProps) {
  const [updating, setUpdating] = useState<JobStatus | null>(null);
  const currentIndex = JOB_STATUS_ORDER.indexOf(status);
  const upcoming = status === "cancelled" ? null : nextStatus(status);

  const handleChange = async (next: JobStatus) => {
    setUpdating(next);
    try {
      await onChange(next);
    } finally {
      setUpdating(null);
    }
  };

  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-[#FBE4E4] px-4 py-3 text-sm font-semibold text-[#C23B3B]">
        <X size={16} />
        This job was cancelled
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        {JOB_STATUS_ORDER.map((step, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    done
                      ? "bg-brand text-white"
                      : active
                      ? "bg-brand-tint text-brand border-2 border-brand"
                      : "bg-ink-100 text-ink-500"
                  }`}
                >
                  {done ? <Check size={13} /> : i + 1}
                </div>
                <span
                  className={`text-[11px] font-semibold whitespace-nowrap ${
                    active ? "text-ink-900" : "text-ink-500"
                  }`}
                >
                  {JOB_STATUS_LABELS[step]}
                </span>
              </div>
              {i < JOB_STATUS_ORDER.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 ${done ? "bg-brand" : "bg-ink-100"}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        {upcoming && (
          <Button
            size="sm"
            disabled={updating === upcoming}
            onClick={() => handleChange(upcoming)}
          >
            {updating === upcoming
                ? "Updating..."
                : `Mark as ${JOB_STATUS_LABELS[upcoming].toLowerCase()}`}
          </Button>
        )}
        <Button
          size="sm"
          variant="danger"
          disabled={updating === "cancelled"}
          onClick={() => handleChange("cancelled")}
        >
          {updating === "cancelled" ? "Cancelling..." : "Cancel job"}
        </Button>
      </div>
    </div>
  );
}