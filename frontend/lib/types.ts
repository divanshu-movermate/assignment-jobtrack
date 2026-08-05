// Mirrors the domain model in docs/assignment-brief.md Section 5.

export type Role = "admin" | "staff";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Address {
  line1: string;
  city: string;
  state: string;
  zip: string;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type JobStatus =
  | "quote_requested"
  | "quoted"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface JobNote {
  text: string;
  author: string;
  createdAt: string;
}

export interface Job {
  _id: string;
  customer: Customer | string;
  pickupAddress: string;
  dropoffAddress: string;
  scheduledDate: string;
  estimatedPrice: number;
  finalPrice: number | null;
  status: JobStatus;
  assignedCrew: User[] | string[];
  notes: JobNote[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
