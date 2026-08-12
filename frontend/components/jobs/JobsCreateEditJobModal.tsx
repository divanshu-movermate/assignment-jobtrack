"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import type { Job, JobStatus } from "@/lib/types";

interface CreateEditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: JobFormValues) => Promise<Job>;
  job?: Job | null;
}

export interface JobFormValues {
  customer: string;
  pickupAddress: string;
  dropoffAddress: string;
  scheduledDate: string;
  estimatedPrice: number;
}

const STATUS_OPTIONS = [
  {
    value: "quote_requested",
    label: "Quote Requested",
  },
  {
    value: "quoted",
    label: "Quoted",
  },
  {
    value: "confirmed",
    label: "Confirmed",
  },
  {
    value: "in_progress",
    label: "In Progress",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

export function CreateEditModal({
  open,
  onClose,
  onSubmit,
  job,
}: CreateEditModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<JobFormValues>({
    defaultValues: {
      customer: "",
      pickupAddress: "",
      dropoffAddress: "",
      scheduledDate: "",
      estimatedPrice: 0,
    },
  });

  const status = watch("customer");

  useEffect(() => {
    if (!open) return;

    if (job) {
      reset({
        customer:
          typeof job.customer === "string"
            ? job.customer
            : job.customer.name,
        pickupAddress: job.pickupAddress,
        dropoffAddress: job.dropoffAddress,
        scheduledDate: job.scheduledDate,
        estimatedPrice:
          job.estimatedPrice ?? job.finalPrice ?? 0,
      });
    } else {
      reset({
        customer: "",
        pickupAddress: "",
        dropoffAddress: "",
        scheduledDate: "",
        estimatedPrice: 0,
      });
    }
  }, [open, job, reset]);

  if (!open) {
    return null;
  }

  const submitForm = async (values: JobFormValues) => {
    try {
      setLoading(true);
      await onSubmit(values);
      onClose();
    } catch (error) {
      console.error("Failed to save job:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-surface p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink-900">
              {job ? "Edit Job" : "Create Job"}
            </h2>

            <p className="mt-1 text-sm text-ink-500">
              {job
                ? "Update the job details."
                : "Create a new job."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-ink-500 hover:text-ink-900"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit(submitForm)}
          className="space-y-4"
        >
          {/* Customer */}
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Customer
            </label>

            <input
              {...register("customer", {
                required: "Customer is required",
              })}
              className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="Customer name"
            />
          </div>

          {/* Pickup */}
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Pickup Address
            </label>

            <input
              {...register("pickupAddress", {
                required: "Pickup address is required",
              })}
              className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="Pickup address"
            />
          </div>

          {/* Dropoff */}
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Dropoff Address
            </label>

            <input
              {...register("dropoffAddress", {
                required: "Dropoff address is required",
              })}
              className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="Dropoff address"
            />
          </div>

          {/* Scheduled Date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Scheduled Date
            </label>

            <input
              type="date"
              {...register("scheduledDate", {
                required: "Scheduled date is required",
              })}
              className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          {/* Estimated Price */}
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Estimated Price
            </label>

            <input
              type="number"
              step="0.01"
              {...register("estimatedPrice", {
                required: "Estimated price is required",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Price cannot be negative",
                },
              })}
              className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="0.00"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : job
                ? "Update Job"
                : "Create Job"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}