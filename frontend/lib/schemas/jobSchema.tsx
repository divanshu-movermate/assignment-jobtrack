import { z } from "zod";

// Covers both create and edit. `status` isn't here — new jobs always start
// at "quote_requested" server-side, and later status changes go through
// StatusTrack (PATCH /jobs/:id/status), not this form.
export const jobSchema = z.object({
  customer: z.string().min(1, "Select a customer"),
  pickupAddress: z.string().min(1, "Pickup address is required"),
  dropoffAddress: z.string().min(1, "Drop-off address is required"),
  scheduledDate: z.string().min(1, "Scheduled date is required"),
  estimatedPrice: z.coerce
    .number("Enter a number")
    .min(0, "Must be 0 or more"),
});

export type JobFormValues = z.infer<typeof jobSchema>;