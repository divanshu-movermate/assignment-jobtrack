"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness, ChevronDown, ChevronUp, DollarSign, TrendingUp, Users } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { StatusBadge } from "@/components/ui/Badge";
import { apiFetch } from "@/lib/api";
import type { JobStatus } from "@/lib/types";

interface DashboardStats {
  statusCounts: Record<JobStatus, number>;
  pipelineRevenue: number;
  jobsThisMonth: number;
  jobsLastMonth: number;
  topCustomers: {
    customerId: string;
    name: string;
    email: string;
    jobCount: number;
  }[];
}

const DEFAULT_STATUS_COUNTS: Record<JobStatus, number> = {
  quote_requested: 0,
  quoted: 0,
  confirmed: 0,
  in_progress: 0,
  completed: 0,
  cancelled: 0,
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFetch<DashboardStats>(
          "/dashboard/stats"
        );

        setStats({
          ...response,
          statusCounts: {
            ...DEFAULT_STATUS_COUNTS,
            ...response.statusCounts,
          },
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statusCounts =
    stats?.statusCounts ?? DEFAULT_STATUS_COUNTS;

  const totalJobs = Object.values(statusCounts).reduce(
    (total, count) => total + count,
    0
  );

  const monthChange =
    stats && stats.jobsLastMonth > 0
      ? Math.round(
          ((stats.jobsThisMonth - stats.jobsLastMonth) /
            stats.jobsLastMonth) *
            100
        )
      : 0;

  return (
    <AppShell>
      <Topbar title="Dashboard" />

      <div className="p-7">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-ink-500">
              Loading dashboard...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-lg border border-[#F0B5B5] bg-[#FBE4E4] px-4 py-3 text-sm text-[#C23B3B]">
            {error}
          </div>
        )}

        {/* Dashboard */}
        {!loading && !error && stats && (
          <div className="flex flex-col gap-6">

            {/* Overview cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">


              {/*Job by Status*/}
              <div className="h-[220px] rounded-xl border border-line bg-surface">
                <div className="border-b border-line px-4 py-2">
                  <h2 className="text-base font-semibold text-ink-900">
                    Jobs by Status
                  </h2>

                </div>

                <div className="">

                  <div className="flex items-center justify-between px-4 pt-2 pb-1">
                    <StatusBadge status="quote_requested" />

                    <span className="text-sm font-semibold text-ink-900">
                      {statusCounts.quote_requested}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-1">
                    <StatusBadge status="quoted" />

                    <span className="text-sm font-semibold text-ink-900">
                      {statusCounts.quoted}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-1">
                    <StatusBadge status="confirmed" />

                    <span className="text-sm font-semibold text-ink-900">
                      {statusCounts.confirmed}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-1">
                    <StatusBadge status="in_progress" />

                    <span className="text-sm font-semibold text-ink-900">
                      {statusCounts.in_progress}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-1">
                    <StatusBadge status="completed" />

                    <span className="text-sm font-semibold text-ink-900">
                      {statusCounts.completed}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-1">
                    <StatusBadge status="cancelled" />

                    <span className="text-sm font-semibold text-ink-900">
                      {statusCounts.cancelled}
                    </span>
                  </div>
                </div>
              </div>


              {/* Total Jobs */}
              {/* <div className="rounded-xl border border-line bg-surface p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ink-500">
                      Total Jobs
                    </p>

                    <p className="mt-2 text-2xl font-bold text-ink-900">
                      {totalJobs}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-tint text-brand">
                    <BriefcaseBusiness size={20} />
                  </div>
                </div>
              </div> */}

              {/* Pipeline Revenue */}
              <div className="rounded-xl border border-line bg-surface p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ink-500">
                      Pipeline Revenue
                    </p>

                    <p className="mt-2 text-2xl font-bold text-ink-900">
                      $
                      {stats.pipelineRevenue.toLocaleString()}
                    </p>

                    <p
                      className={`flex mt-2 text-xs font-medium ${"text-[#0F9D63]"}`}
                    >
                      Across all non-cancelled jobs
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F7F0] text-[#0F9D63]">
                    <DollarSign size={20} />
                  </div>
                </div>
              </div>

              {/* This Month */}
              <div className="rounded-xl border border-line bg-surface p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ink-500">
                      Jobs This Month
                    </p>

                    <p className="mt-2 text-2xl font-bold text-ink-900">
                      {stats.jobsThisMonth}
                    </p>

                    <p
                      className={`flex mt-2 text-xs font-medium ${
                        monthChange >= 0
                          ? "text-[#0F9D63]"
                          : "text-[#D0453C]"
                      }`}
                    >
                      {monthChange >= 0 ? <ChevronUp className="pb-2"/> : <ChevronDown/>}
                      up from 9 last month
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF4FF] text-[#2C7BE5]">
                    <TrendingUp size={20} />
                  </div>
                </div>
              </div>

              {/* Top Customers */}
              <div className="rounded-xl border border-line bg-surface p-5">

                <h2 className="text-base font-semibold text-ink-900">
                    Top Customers
                  </h2>
                <div className="flex items-center justify-between ">
                  {stats?.topCustomers?.[0] ? (
                    <div>
                      <h1 className="text-xl font-bold text-ink-900 mt-2">
                        {stats.topCustomers[0].name}
                      </h1>
                      <p className="text-sm text-ink-500">
                        {stats.topCustomers[0].jobCount} jobs booked
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-ink-500">
                      No customer data
                    </p>
                  )}

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F3EEFF] text-[#6D3FD1]">
                    <Users size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">

              {/* Job Status */}
              {/* <div className="rounded-xl border border-line bg-surface">
                <div className="border-b border-line px-5 py-4">
                  <h2 className="text-base font-semibold text-ink-900">
                    Jobs by Status
                  </h2>

                  <p className="mt-1 text-sm text-ink-500">
                    Current distribution of jobs
                  </p>
                </div>

                <div className="flex flex-col divide-y divide-line">

                  <div className="flex items-center justify-between px-5 py-4">
                    <StatusBadge status="quote_requested" />

                    <span className="text-sm font-semibold text-ink-900">
                      {statusCounts.quote_requested}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-5 py-4">
                    <StatusBadge status="quoted" />

                    <span className="text-sm font-semibold text-ink-900">
                      {statusCounts.quoted}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-5 py-4">
                    <StatusBadge status="confirmed" />

                    <span className="text-sm font-semibold text-ink-900">
                      {statusCounts.confirmed}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-5 py-4">
                    <StatusBadge status="in_progress" />

                    <span className="text-sm font-semibold text-ink-900">
                      {statusCounts.in_progress}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-5 py-4">
                    <StatusBadge status="completed" />

                    <span className="text-sm font-semibold text-ink-900">
                      {statusCounts.completed}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-5 py-4">
                    <StatusBadge status="cancelled" />

                    <span className="text-sm font-semibold text-ink-900">
                      {statusCounts.cancelled}
                    </span>
                  </div>
                </div>
              </div> */}

              {/* Top Customers */}
              <div className="min-h-[180px] rounded-xl border border-line bg-surface p-5">
                <div className="border-b border-line px-5 py-4">
                  <h2 className="text-base font-semibold text-ink-900">
                    Top Customers
                  </h2>

                  <p className="mt-1 text-sm text-ink-500">
                    Customers with the most jobs
                  </p>
                </div>

                <div className="flex flex-col divide-y divide-line">
                  {stats.topCustomers.length === 0 ? (
                    <div className="px-5 py-8 text-center text-sm text-ink-500">
                      No customer data available.
                    </div>
                  ) : (
                    stats.topCustomers.map((customer, index) => (
                      <div
                        key={customer.customerId}
                        className="flex items-center justify-between px-5 py-4"
                      >
                        <div className="flex items-center gap-3">

                          {/* Rank */}
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-100 text-xs font-semibold text-ink-500">
                            {index + 1}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-ink-900">
                              {customer.name}
                            </p>

                            {/* <p className="text-xs text-ink-500">
                              {customer.email}
                            </p> */}
                          </div>
                        </div>

                        <div className="flex text-right gap-1">
                          <p className="text-sm font-semibold text-ink-900">
                            {customer.jobCount}
                          </p>

                          <p className="text-sm font-semibold text-ink-500">
                            {customer.jobCount === 1
                              ? "job"
                              : "jobs"}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Monthly comparison */}
            {/* <div className="rounded-xl border border-line bg-surface p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-ink-900">
                    Monthly Jobs
                  </h2>

                  <p className="mt-1 text-sm text-ink-500">
                    Compare current month with previous month
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-ink-900">
                    {stats.jobsThisMonth}
                  </p>

                  <p className="text-xs text-ink-500">
                    this month
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-paper p-4">
                  <p className="text-xs text-ink-500">
                    This Month
                  </p>

                  <p className="mt-1 text-xl font-bold text-ink-900">
                    {stats.jobsThisMonth}
                  </p>
                </div>

                <div className="rounded-lg bg-paper p-4">
                  <p className="text-xs text-ink-500">
                    Last Month
                  </p>

                  <p className="mt-1 text-xl font-bold text-ink-900">
                    {stats.jobsLastMonth}
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        )}
      </div>
    </AppShell>
  );
}