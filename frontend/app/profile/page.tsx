"use client";

import { useEffect, useMemo, useState } from "react";
import {
  User,
  Mail,
  Shield,
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  DollarSign,
  ArrowLeft,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import {useRouter} from "next/navigation";



interface Customer {
  _id: string;
  name: string;
  email: string;
}

interface AssignedJob {
  _id: string;
  customer?: Customer;
  pickupAddress: string;
  dropoffAddress: string;
  scheduledDate: string;
  estimatedPrice: number;
  status: string;
  assignedCrew?: string[];
}

interface ProfileUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  assignedJobs: AssignedJob[];
}

interface ProfileResponse {
  user: ProfileUser;
}


function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}


function formatDate(date: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


function formatDateTime(date: string) {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


function getStatusClass(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-50 text-green-700";

    case "confirmed":
      return "bg-blue-50 text-blue-700";

    case "quoted":
      return "bg-purple-50 text-purple-700";

    case "quote_requested":
      return "bg-yellow-50 text-yellow-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-ink-50 text-ink-600";
  }
}


function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircle2 size={13} />;

    case "cancelled":
      return <XCircle size={13} />;

    case "confirmed":
      return <CheckCircle2 size={13} />;

    default:
      return <AlertCircle size={13} />;
  }
}



export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        /*
         * IMPORTANT:
         *
         * This is the ONLY API used by this page.
         *
         * Do NOT call:
         * /auth/staff
         * /auth/allteam
         *
         * Those routes are admin-only.
         */
        const data = await apiFetch<ProfileResponse>(
          "/auth/profile"
        );

        console.log("PROFILE API RESPONSE:", data);

        if (!mounted) return;

        setUser(data.user);
      } catch (err) {
        console.error("Failed to load profile:", err);

        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load profile"
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);


  const jobs = user?.assignedJobs ?? [];


  const statistics = useMemo(() => {
    const completed = jobs.filter(
      (job) => job.status === "completed"
    ).length;

    const active = jobs.filter(
      (job) =>
        !["completed", "cancelled"].includes(job.status)
    ).length;

    const cancelled = jobs.filter(
      (job) => job.status === "cancelled"
    ).length;

    const totalValue = jobs.reduce(
      (sum, job) =>
        sum + Number(job.estimatedPrice || 0),
      0
    );

    return {
      total: jobs.length,
      completed,
      active,
      cancelled,
      totalValue,
    };
  }, [jobs]);


  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-ink-500">
          <Loader2
            size={18}
            className="animate-spin"
          />
          Loading profile...
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="p-7">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-red-700">
            <AlertCircle size={18} />
            Failed to load profile
          </div>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <p className="mt-3 text-xs text-red-500">
            Make sure you are logged in and the backend is
            running on port 5000.
          </p>
        </div>
      </div>
    );
  }


  if (!user) {
    return (
      <div className="p-7">
        <div className="rounded-xl border border-line bg-surface p-10 text-center">
          <User
            size={32}
            className="mx-auto text-ink-300"
          />

          <h2 className="mt-3 text-sm font-semibold text-ink-900">
            User not found
          </h2>

          <p className="mt-1 text-xs text-ink-500">
            Unable to load your profile information.
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-full bg-ink-50/30 p-7">

      
      {/* HEADER */}
      

      <div className="mb-6">
        <div className="flex gap-2 items-center">
            <button
                type="button"
                onClick={() => router.back()}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-ink-600 transition hover:bg-ink-50 hover:text-ink-900"
                aria-label="Go back"
                >
                <ArrowLeft size={17} />
            </button>
            <h1 className="text-xl font-bold text-ink-900">
            My Profile
            </h1>
        </div>

        <p className="mt-1 text-sm text-ink-500">
          View your account information and assigned jobs.
        </p>
      </div>


      
      {/* PROFILE CARD */}
      

      <section className="rounded-xl border border-line bg-surface">

        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            {/* Avatar */}

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-tint text-lg font-bold text-brand">
              {getInitials(user.name)}
            </div>


            {/* User info */}

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="text-lg font-bold text-ink-900">
                  {user.name}
                </h2>

                <span className="inline-flex items-center gap-1 rounded-full bg-brand-tint px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand">
                  <Shield size={11} />
                  {user.role}
                </span>

              </div>

              <div className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
                <Mail size={14} />
                {user.email}
              </div>

            </div>

          </div>


          {/* Joined */}

          <div className="rounded-lg bg-ink-50 px-4 py-3">

            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">
              Joined
            </p>

            <p className="mt-1 text-sm font-semibold text-ink-800">
              {formatDate(user.createdAt)}
            </p>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* STATISTICS */}
      {/* ================================================= */}

      <section className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">

        {/* Total */}

        <div className="rounded-xl border border-line bg-surface p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-ink-500">
                Total Jobs
              </p>

              <p className="mt-1 text-2xl font-bold text-ink-900">
                {statistics.total}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-tint text-brand">
              <Briefcase size={18} />
            </div>

          </div>

        </div>


        {/* Active */}

        <div className="rounded-xl border border-line bg-surface p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-ink-500">
                Active Jobs
              </p>

              <p className="mt-1 text-2xl font-bold text-ink-900">
                {statistics.active}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Clock size={18} />
            </div>

          </div>

        </div>


        {/* Completed */}

        <div className="rounded-xl border border-line bg-surface p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-ink-500">
                Completed
              </p>

              <p className="mt-1 text-2xl font-bold text-ink-900">
                {statistics.completed}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <CheckCircle2 size={18} />
            </div>

          </div>

        </div>


        {/* Value */}

        <div className="rounded-xl border border-line bg-surface p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-ink-500">
                Job Value
              </p>

              <p className="flex mt-1 text-2xl font-bold text-ink-900 items-center">
                <DollarSign />{statistics.totalValue.toLocaleString("en-US")}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <DollarSign size={18} />
            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* ACCOUNT INFORMATION */}
      {/* ================================================= */}

      <section className="mt-5 rounded-xl border border-line bg-surface">

        <div className="border-b border-line px-5 py-4">

          <h2 className="text-sm font-semibold text-ink-900">
            Account information
          </h2>

          <p className="mt-1 text-xs text-ink-500">
            Your account details.
          </p>

        </div>


        <div className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">

          <div className="p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-50">
                <User
                  size={16}
                  className="text-ink-500"
                />
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-ink-400">
                  Full name
                </p>

                <p className="mt-1 text-sm font-medium text-ink-900">
                  {user.name}
                </p>
              </div>

            </div>

          </div>


          <div className="p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-50">
                <Mail
                  size={16}
                  className="text-ink-500"
                />
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-ink-400">
                  Email
                </p>

                <p className="mt-1 text-sm font-medium text-ink-900">
                  {user.email}
                </p>
              </div>

            </div>

          </div>


          <div className="p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-50">
                <Shield
                  size={16}
                  className="text-ink-500"
                />
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-ink-400">
                  Role
                </p>

                <p className="mt-1 text-sm font-medium capitalize text-ink-900">
                  {user.role}
                </p>
              </div>

            </div>

          </div>


          <div className="p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-50">
                <Calendar
                  size={16}
                  className="text-ink-500"
                />
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-ink-400">
                  Account created
                </p>

                <p className="mt-1 text-sm font-medium text-ink-900">
                  {formatDate(user.createdAt)}
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      
      {/* ASSIGNED JOBS */}
      

      <section className="mt-5 rounded-xl border border-line bg-surface">

        <div className="flex items-center justify-between border-b border-line px-5 py-4">

          <div>

            <h2 className="text-sm font-semibold text-ink-900">
              Assigned jobs
            </h2>

            <p className="mt-1 text-xs text-ink-500">
              Jobs currently assigned to you.
            </p>

          </div>


          <div className="rounded-lg bg-ink-50 px-3 py-1.5 text-xs font-semibold text-ink-700">
            {jobs.length} jobs
          </div>

        </div>


        {jobs.length === 0 ? (

          <div className="p-10 text-center">

            <Briefcase
              size={32}
              className="mx-auto text-ink-300"
            />

            <p className="mt-3 text-sm font-semibold text-ink-900">
              No jobs assigned
            </p>

            <p className="mt-1 text-xs text-ink-500">
              You currently don't have any assigned jobs.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-line">

            {jobs.map((job) => (

              <div
                key={job._id}
                className="p-5 transition hover:bg-ink-50/40"
              >

                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                  {/* Job information */}

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      <h3 className="text-sm font-semibold text-ink-900">
                        {job.customer?.name ||
                          "Customer"}
                      </h3>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold capitalize ${getStatusClass(
                          job.status
                        )}`}
                      >
                        {getStatusIcon(job.status)}
                        {job.status.replace(
                          /_/g,
                          " "
                        )}
                      </span>

                    </div>


                    {job.customer?.email && (
                      <p className="mt-1 text-xs text-ink-500">
                        {job.customer.email}
                      </p>
                    )}


                    {/* Route */}

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">

                      <div className="flex gap-2">

                        <MapPin
                          size={15}
                          className="mt-0.5 shrink-0 text-ink-400"
                        />

                        <div>

                          <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                            Pickup
                          </p>

                          <p className="mt-1 text-xs text-ink-700">
                            {job.pickupAddress}
                          </p>

                        </div>

                      </div>


                      <div className="flex gap-2">

                        <MapPin
                          size={15}
                          className="mt-0.5 shrink-0 text-ink-400"
                        />

                        <div>

                          <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                            Dropoff
                          </p>

                          <p className="mt-1 text-xs text-ink-700">
                            {job.dropoffAddress}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>


                  {/* Job metadata */}

                  <div className="flex shrink-0 flex-row gap-6 lg:flex-col lg:items-end lg:gap-2">

                    <div className="flex items-center gap-1.5">

                      <Calendar
                        size={13}
                        className="text-ink-400"
                      />

                      <span className="text-xs font-medium text-ink-700">
                        {formatDateTime(
                          job.scheduledDate
                        )}
                      </span>

                    </div>


                    <div className="flex items-center gap-1">

                      <DollarSign
                        size={13}
                        className="text-ink-400"
                      />

                      <span className="text-sm font-bold text-ink-900">
                        {Number(
                          job.estimatedPrice || 0
                        ).toLocaleString("en-IN")}
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}