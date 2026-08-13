"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";

import { StatusTrack } from "@/components/jobs/JobStatus";
import { JobNotes } from "@/components/jobs/JobNotes";
import { AssignCrewButton } from "@/components/jobs/AssignJob";
import { CreateEditModal } from "@/components/jobs/JobsCreateEditJobModal";

import { useJob } from "@/lib/hooks/useJob";

import type { Customer, Job } from "@/lib/types";

function getCustomerName(customer: Job["customer"]) {
  if (!customer) {
    return "Unknown customer";
  }

  if (typeof customer === "string") {
    return customer;
  }

  return customer.name || "Unknown customer";
}



function formatDate(date?: string) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(date?: string) {
  if (!date) return "—";

  return new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatPrice(value?: number | null) {
  if (value === null || value === undefined) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}




export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const {
    job,
    loading,
    error,
    refresh,
    updateStatus,
    addNote,
    updateCrew,
    updateJob
  } = useJob(id);

  const [editOpen, setEditOpen] = useState(false);

  if (loading) {
    return (
      <AppShell>
        <Topbar title="Job detail" />

        <div className="p-7">
          <div className="rounded-xl border border-line bg-surface p-6">
            <div className="h-5 w-40 animate-pulse rounded bg-ink-100" />
            <div className="mt-4 h-4 w-64 animate-pulse rounded bg-ink-100" />
            <div className="mt-6 h-24 animate-pulse rounded bg-ink-100" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !job) {
    return (
      <AppShell>
        <Topbar title="Job detail" />

        <div className="p-7">
          <div className="rounded-xl border border-line bg-surface p-6">
            <p className="text-sm font-medium text-[#C23B3B]">
              {error ?? "Job not found"}
            </p>

            <Button
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={() => router.push("/jobs")}
            >
              <ArrowLeft size={14} />
              Back to jobs
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  
  const customer =
    typeof job.customer === "string"
      ? null
      : job.customer;



  return (
    <AppShell>
      <Topbar title="Job detail" />

      <div className="p-7">

        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <button
              onClick={() => router.push("/jobs")}
              className="mb-2 flex items-center gap-1 text-xs text-ink-500 hover:text-ink-900"
            >
              <ArrowLeft size={13} />
              Back to jobs
            </button>

            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-ink-900">
                {getCustomerName(job.customer)}
              </h1>

              <span className="text-xs text-ink-500">
                — {formatDate(job.scheduledDate)}
              </span>
            </div>

            <div className="mt-1">
              <StatusBadge status={job.status} />
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEditOpen(true)}
          >
            <Edit size={13} />
            Edit job
          </Button>
        </div>

        {/* Status */}
        <section className="mb-4 rounded-xl border border-line bg-surface p-4">
          <h2 className="mb-3 text-xs font-semibold text-ink-900">
            Status
          </h2>

          <StatusTrack
            status={job.status}
            onChange={updateStatus}
          />
        </section>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">

          {/* LEFT */}
          <div className="flex flex-col gap-4">

            {/* Job Info */}
            <section className="rounded-xl border border-line bg-surface p-4">
              <h2 className="mb-3 text-xs font-semibold text-ink-900">
                Job info
              </h2>

              <div className="divide-y divide-line">

                <InfoRow
                  label="Pickup"
                  value={job.pickupAddress}
                />

                <InfoRow
                  label="Dropoff"
                  value={job.dropoffAddress}
                />

                <InfoRow
                  label="Scheduled"
                  value={formatDateTime(job.scheduledDate)}
                />

                <InfoRow
                  label="Estimated"
                  value={formatPrice(job.estimatedPrice)}
                />

                <InfoRow
                  label="Final price"
                  value={formatPrice(job.finalPrice)}
                />

                <InfoRow
                  label="Crew"
                  value={
                    job.assignedCrew?.length
                      ? job.assignedCrew
                          .map((member) =>
                            typeof member === "string"
                              ? member
                              : member.name
                          )
                          .join(", ")
                      : "No crew assigned"
                  }
                />

              </div>
            </section>

            {/* Crew */}
            <section className="rounded-xl border border-line bg-surface p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xs font-semibold text-ink-900">
                  Crew
                </h2>

                <AssignCrewButton
                  assignedCrew={job.assignedCrew ?? []}
                  onSave={async (crewIds) => {
                    await updateCrew(crewIds);
                    await refresh();
                  }}
                />
              </div>

              {job.assignedCrew?.length ? (
                <div className="flex flex-wrap gap-2">
                  {job.assignedCrew.map((member, index) => {
                    if (typeof member === "string") {
                      return (
                        <span
                          key={member}
                          className="rounded-full bg-ink-100 px-2.5 py-1 text-xs text-ink-700"
                        >
                          {member}
                        </span>
                      );
                    }

                    const initials = member.name
                      .split(" ")
                      .map((name) => name[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <div
                        key={member._id ?? index}
                        className="flex items-center gap-2 rounded-full bg-ink-50 px-2 py-1"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-tint text-[10px] font-semibold text-brand">
                          {initials}
                        </span>

                        <span className="text-xs font-medium text-ink-900">
                          {member.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-ink-500">
                  No crew assigned.
                </p>
              )}
            </section>

            {/* Notes */}
            <section className="rounded-xl border border-line bg-surface p-4">
              <h2 className="mb-3 text-xs font-semibold text-ink-900">
                Notes
              </h2>

              <JobNotes
                notes={job.notes ?? []}
                onAdd={async (text) => {
                  await addNote(text);
                  await refresh();
                }}
              />
            </section>
          </div>

          {/* RIGHT */}
          <div>

            {/* Customer */}
            <section className="rounded-xl border border-line bg-surface p-4">
              <h2 className="mb-3 text-xs font-semibold text-ink-900">
                Customer
              </h2>

              {customer ? (
                <div className="divide-y divide-line">

                  <InfoRow
                    label="Name"
                    value={customer.name}
                  />

                  <InfoRow
                    label="Email"
                    value={customer.email || "—"}
                  />

                  <InfoRow
                    label="Phone"
                    value={customer.phone || "—"}
                  />

                </div>
              ) : (
                <p className="text-xs text-ink-500">
                  Customer information unavailable.
                </p>
              )}
            </section>

          </div>
        </div>
      </div>

      {/* Edit modal */}
      <CreateEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        job={job}
        onSubmit={async (values) => {
          /*
           * If your useJob currently has an updateJob method,
           * call it here.
           *
           * Example:
           * await updateJob(values);
           */
          await updateJob(values);
          await refresh();
          setEditOpen(false);

          console.log("Update job:", values);
        }}
      />
    </AppShell>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[90px_1fr] gap-3 py-2">
      <span className="text-[11px] font-medium text-ink-500">
        {label}
      </span>

      <span className="text-[11px] text-ink-900">
        {value}
      </span>
    </div>
  );
}