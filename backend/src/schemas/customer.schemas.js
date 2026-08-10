const { z } = require("zod");

const addressSchema = z
  .object({
    line1: z.string().trim().optional().default(""),
    city: z.string().trim().optional().default(""),
    state: z.string().trim().optional().default(""),
    zip: z.string().trim().optional().default(""),
  })
  .optional();

const createCustomerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: z.string().trim().optional().default(""),
  address: addressSchema,
  notes: z.string().trim().optional().default(""),
});

// PATCH — every field optional, but whatever IS sent still has to be valid.
// .partial() on the base object; email/name still validate their format if present.
const updateCustomerSchema = createCustomerSchema.partial();

// GET /api/customers?search=&page=&limit=
const listCustomersQuerySchema = z.object({
  search: z.string().trim().optional().default(""),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

module.exports = {
  createCustomerSchema,
  updateCustomerSchema,
  listCustomersQuerySchema,
};