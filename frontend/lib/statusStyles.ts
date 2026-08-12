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