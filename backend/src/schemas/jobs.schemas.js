const { z } = require("zod");
const { ALL_STATUSES } = require("../utils/statusTransitions");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

const createJobSchema = z.object({
  customer: objectId,
  pickupAddress: z.string().trim().min(1, "Pickup address is required"),
  dropoffAddress: z.string().trim().min(1, "Dropoff address is required"),
  scheduledDate: z.coerce.date({ errorMap: () => ({ message: "Enter a valid date" }) }),
  estimatedPrice: z.coerce.number().min(0, "Estimated price must be 0 or more"),
});

const updateJobSchema = z.object({
  customer: objectId.optional(),
  pickupAddress: z.string().trim().min(1).optional(),
  dropoffAddress: z.string().trim().min(1).optional(),
  scheduledDate: z.coerce.date().optional(),
  estimatedPrice: z.coerce.number().min(0).optional(),
  finalPrice: z.coerce.number().min(0).nullable().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(ALL_STATUSES, { errorMap: () => ({ message: "Invalid status value" }) }),
});

const addNoteSchema = z.object({
  text: z.string().trim().min(1, "Note text is required"),
});

const assignCrewSchema = z.object({
  assignedCrew: z.array(objectId).default([]), // empty array is valid — it unassigns everyone
});

const listJobsQuerySchema = z.object({
  search: z.string().trim().optional().default(""),
  status: z.enum(ALL_STATUSES).optional(),
  assignedTo: objectId.optional(),
  sort: z
    .enum(["scheduledDate:asc", "scheduledDate:desc"])
    .optional()
    .default("scheduledDate:desc"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

module.exports = {
  createJobSchema,
  updateJobSchema,
  updateStatusSchema,
  addNoteSchema,
  assignCrewSchema,
  listJobsQuerySchema,
};