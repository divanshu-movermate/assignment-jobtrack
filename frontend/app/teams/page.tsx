"use client";

import { useEffect, useMemo, useState } from "react";
import { Users, Briefcase, Shield, UserRound, RefreshCw } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";

interface AssignedJob {
  _id: string;
  status?: string;
  customer?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  pickupAddress?: string;
  dropoffAddress?: string;
  scheduledDate?: string;
  estimatedPrice?: number;
}

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "staff" | string;
  assignedJobs?: AssignedJob[];
  createdAt?: string;
  updatedAt?: string;
}

interface UsersResponse {
  users: TeamMember[];
  pagination?: {
    total: number;
    totalPages: number;
  };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(date?: string) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TeamsPage() {
  const [users, setUsers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTeam = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const response = await apiFetch<UsersResponse>("/auth/allteam");

      console.log("TEAM RESPONSE:", response);

      setUsers(response.users ?? []);
    } catch (err) {
      console.error("Failed to load team:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load team members"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const admins = useMemo(
    () => users.filter((user) => user.role === "admin"),
    [users]
  );

  const staff = useMemo(
    () => users.filter((user) => user.role === "staff"),
    [users]
  );

  const totalJobs = useMemo(
    () =>
      users.reduce(
        (total, user) => total + (user.assignedJobs?.length ?? 0),
        0
      ),
    [users]
  );

  if (loading) {
    return (
      <AppShell>
        <Topbar title="Teams" />

        <div className="p-7">
          <div className="mb-5">
            <div className="h-6 w-32 animate-pulse rounded bg-ink-100" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-ink-100" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-xl border border-line bg-surface"
              />
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-line bg-surface">
            <div className="space-y-4 p-5">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-14 animate-pulse rounded-lg bg-ink-50"
                />
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <Topbar title="Teams" />

        <div className="p-7">
          <div className="rounded-xl border border-line bg-surface p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
                <Users size={17} className="text-[#C23B3B]" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-ink-900">
                  Unable to load team
                </h2>

                <p className="mt-1 text-xs text-[#C23B3B]">
                  {error}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="secondary"
              className="mt-5"
              onClick={() => loadTeam(true)}
            >
              <RefreshCw size={14} />
              Try again
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Topbar title="Teams" />

      <div className="p-7">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-lg font-semibold text-ink-900">
              Team
            </h1>

            <p className="mt-1 text-xs text-ink-500">
              Manage admins and staff members and view their assigned jobs.
            </p>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => loadTeam(true)}
            disabled={refreshing}
          >
            <RefreshCw
              size={14}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Total members */}
          <div className="rounded-xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-ink-500">
                  Total members
                </p>

                <p className="mt-2 text-2xl font-bold text-ink-900">
                  {users.length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-tint">
                <Users size={18} className="text-brand" />
              </div>
            </div>
          </div>

          {/* Staff */}
          <div className="rounded-xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-ink-500">
                  Staff members
                </p>

                <p className="mt-2 text-2xl font-bold text-ink-900">
                  {staff.length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-50">
                <UserRound size={18} className="text-ink-700" />
              </div>
            </div>
          </div>

          {/* Assigned jobs */}
          <div className="rounded-xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-ink-500">
                  Assigned jobs
                </p>

                <p className="mt-2 text-2xl font-bold text-ink-900">
                  {totalJobs}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-50">
                <Briefcase size={18} className="text-ink-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Team list */}
          <section className="mt-5 overflow-hidden rounded-xl border border-line bg-surface">
            <div className="border-b border-line px-5 py-4">
              <h2 className="text-sm font-semibold text-ink-900">
                Team members
              </h2>

              <p className="mt-1 text-xs text-ink-500">
                {users.length} members in your organization
              </p>
            </div>

            {users.length === 0 ? (
              <div className="p-10 text-center">
                <Users
                  size={30}
                  className="mx-auto text-ink-300"
                />

                <p className="mt-3 text-sm font-medium text-ink-900">
                  No team members found
                </p>

                <p className="mt-1 text-xs text-ink-500">
                  There are currently no users in the team.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-line bg-ink-50/50">
                    <tr>
                      <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wide text-ink-500">
                        Team Member
                      </th>

                      <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wide text-ink-500">
                        Email
                      </th>

                      <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wide text-ink-500">
                        Role
                      </th>

                      <th className="px-5 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-ink-500">
                        Jobs
                      </th>

                      {/* <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-ink-500">
                        Status
                      </th> */}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-line">
                    {users.map((member) => {
                      const jobCount = member.assignedJobs?.length ?? 0;
                      const isAdmin = member.role === "admin";

                      return (
                        <tr
                          key={member._id}
                          className="transition hover:bg-ink-50/50"
                        >
                          {/* Team Member */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                  isAdmin
                                    ? "bg-brand-tint text-brand"
                                    : "bg-ink-100 text-ink-700"
                                }`}
                              >
                                {getInitials(member.name)}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="truncate text-sm font-semibold text-ink-900">
                                    {member.name}
                                  </p>

                                  {isAdmin && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-tint px-2 py-0.5 text-[10px] font-semibold text-brand">
                                      <Shield size={10} />
                                      Admin
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-5 py-4">
                            <p className="text-xs text-ink-500">
                              {member.email}
                            </p>
                          </td>

                          {/* Role */}
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${
                                isAdmin
                                  ? "bg-brand-tint text-brand"
                                  : "bg-ink-100 text-ink-700"
                              }`}
                            >
                              {member.role}
                            </span>
                          </td>

                          {/* Jobs */}
                          <td className="px-5 py-4 text-center">
                            <div className="inline-flex items-center gap-1.5">
                              <Briefcase
                                size={14}
                                className="text-ink-400"
                              />

                              <span className="text-sm font-semibold text-ink-900">
                                {jobCount}
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          {/* <td className="px-5 py-4 text-right">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              Active
                            </span>
                          </td> */}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

        {/* Admin section */}
        {admins.length > 0 && (
          <section className="mt-5 rounded-xl border border-line bg-surface">
            <div className="border-b border-line px-5 py-4">
              <h2 className="text-sm font-semibold text-ink-900">
                Administrators
              </h2>

              <p className="mt-1 text-xs text-ink-500">
                Users with administrative access.
              </p>
            </div>

            <div className="divide-y divide-line">
              {admins.map((admin) => (
                <div
                  key={admin._id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-tint text-xs font-bold text-brand">
                      {getInitials(admin.name)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-ink-900">
                          {admin.name}
                        </p>

                        <span className="rounded-full bg-brand-tint px-2 py-0.5 text-[10px] font-semibold text-brand">
                          Admin
                        </span>
                      </div>

                      <p className="mt-0.5 text-xs text-ink-500">
                        {admin.email}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-ink-400">
                      Joined
                    </p>

                    <p className="mt-1 text-xs text-ink-700">
                      {formatDate(admin.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}