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
  author: User | string;
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
  assignedCrew: User[];
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


export interface ApiSuccess<T> {
  success: true;
  data: T;
}
 
export interface ApiFailure {
  success: false;
  error: string;
  fields?: Record<string, string[] | undefined>;
}
 
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
 
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
 
export interface CustomerListData {
  customers: Customer[];
  pagination: PaginationMeta;
}
 
export interface JobListData {
  jobs: Job[];
  pagination: PaginationMeta;
}
 
export interface DashboardStats {
  statusCounts: Record<JobStatus, number>;
  pipelineRevenue: number;
  jobsThisMonth: number;
  jobsLastMonth: number;
  topCustomers: { customerId: string; name: string; email: string; jobCount: number }[];
}
 