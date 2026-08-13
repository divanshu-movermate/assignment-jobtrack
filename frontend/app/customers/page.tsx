// TODO(intern): simple list + create form, doesn't need /jobs-level polish.
// See docs/assignment-brief.md Section 8.
"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Mail, Phone } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
}

export type Address = {
  line1: string;
  city: string;
  state: string;
  zip: string;
};

function getCity(address: Customer["address"]) {
  if (!address) return "Unknown";
  
  if (typeof address === "string") {
    return address;
  }

  return address.city;
}

interface CustomerResponse {
  customers: Customer[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const query = search
        ? `/customers?search=${encodeURIComponent(search)}`
        : "/customers";

      const data = await apiFetch<CustomerResponse>(query);

      setCustomers(data.customers ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <AppShell>
      <Topbar title="Customers" />

      <div className="p-7">

        {/* Header */}
        {/* <div className="mb-5 flex items-center justify-between">
          {/* <div>
            <h1 className="text-xl font-semibold text-ink-900">
              Customers
            </h1>

            <p className="mt-1 text-sm text-ink-500">
              Manage your customers and their contact information.
            </p>
          </div>

          <Button
            onClick={() => {
              // Open create customer modal here
            }}
          >
            <Plus size={15} />
            Add customer
          </Button>
        </div> */}

        {/* Search */}
        <div className="mb-5 flex items-center justify-between">
          <div className="relative max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div>
            <Button
              onClick={() => {
                // Open create customer modal here
              }}
            >
              <Plus size={15} />
              Add customer
            </Button>
          </div>
        
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg border border-[#F0B5B5] bg-[#FBE4E4] px-4 py-3 text-sm text-[#C23B3B]">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-xl border border-line bg-surface p-10 text-center">
            <p className="text-sm text-ink-500">
              Loading customers...
            </p>
          </div>
        ) : customers.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface py-16 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-tint text-brand">
              <UsersIcon />
            </div>

            <p className="text-sm font-semibold text-ink-900">
              {search
                ? "No customers found"
                : "No customers yet"}
            </p>

            <p className="mt-1 text-[13px] text-ink-500">
              {search
                ? "Try a different search."
                : "Add your first customer to get started."}
            </p>

            {!search && (
              <Button
                size="sm"
                className="mt-3"
                onClick={() => {
                  // Open create modal
                }}
              >
                <Plus size={14} />
                Add customer
              </Button>
            )}
          </div>
        ) : (
          /* Customer table */
          <div className="overflow-x-auto rounded-xl border border-line bg-surface">
            <table className="w-full border-collapse text-sm">

              <thead className="bg-paper text-left text-xs font-medium uppercase text-ink-muted">
                <tr>
                  <th className="px-4 py-3">
                    Name
                  </th>

                  <th className="px-4 py-3">
                    Email
                  </th>

                  <th className="px-4 py-3">
                    Phone
                  </th>

                  <th className="px-4 py-3">
                    City
                  </th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="border-t border-line hover:bg-ink-50"
                  >
                    {/* Customer */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {/* <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-tint text-sm font-semibold text-brand">
                          {customer.name
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div> */}

                        <div>
                          <p className="font-semibold text-ink-900">
                            {customer.name}
                          </p>

                          {/* <p className="text-xs text-ink-500">
                            Customer
                          </p> */}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-ink-700">
                        {/* <Mail
                          size={14}
                          className="text-ink-500"
                        /> */}

                        {customer.email}
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-ink-700">
                        {/* <Phone
                          size={14}
                          className="text-ink-500"
                        /> */}

                        {customer.phone}
                      </div>
                    </td>


                    {/* Phone */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-ink-700">
                        {/* <Phone
                          size={14}
                          className="text-ink-500"
                        /> */}

                        {customer.address.city}
                      </div>
                    </td>


                    {/* Actions */}
                    {/* <td className="px-4 py-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          console.log(
                            "Customer:",
                            customer._id
                          );
                        }}
                      >
                        View
                      </Button>
                    </td> */}
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function UsersIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}