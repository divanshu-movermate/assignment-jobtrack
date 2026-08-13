import type { JobStatus } from "./types";

export const JOB_STATUS_ORDER: JobStatus[] = [
  "quote_requested",
  "quoted",
  "confirmed",
  "in_progress",
  "completed",
];

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  quote_requested: "Quote Requested",
  quoted: "Quoted",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};


export function nextStatus(status: JobStatus): JobStatus | null {
  const index = JOB_STATUS_ORDER.indexOf(status);

  if (index === -1 || index === JOB_STATUS_ORDER.length - 1) {
    return null;
  }

  return JOB_STATUS_ORDER[index + 1];
}