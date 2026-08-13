"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";
import type { Customer, Job } from "@/lib/types";

interface JobFormValues {
  customer: string;
  pickupAddress: string;
  dropoffAddress: string;
  scheduledDate: string;
  estimatedPrice: number;
}

interface CreateEditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: JobFormValues) => Promise<unknown>;
  job?: Job | null;
}

export function CreateEditModal({
  open,
  onClose,
  onSubmit,
  job,
}: CreateEditModalProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<JobFormValues>({
    customer: "",
    pickupAddress: "",
    dropoffAddress: "",
    scheduledDate: "",
    estimatedPrice: 0,
  });

  const [priceError, setPriceError] = useState("");

  /*
   * Fetch customers when modal opens
   */
  useEffect(() => {
    if (!open) return;

    const fetchCustomers = async () => {
      setLoadingCustomers(true);

      try {
        const response = await apiFetch<{
          customers: Customer[];
        }>("/customers");

        setCustomers(response.customers ?? []);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
        setCustomers([]);
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, [open]);

  /*
   * Populate form when editing
   */
  useEffect(() => {
    if (!open) return;

    if (job) {
      const customerId =
        typeof job.customer === "string"
          ? job.customer
          : job.customer?._id;

      setForm({
        customer: customerId ?? "",
        pickupAddress: job.pickupAddress ?? "",
        dropoffAddress: job.dropoffAddress ?? "",
        scheduledDate: job.scheduledDate
          ? job.scheduledDate.substring(0, 10)
          : "",
        estimatedPrice:
          job.estimatedPrice ?? job.finalPrice ?? 0,
      });
    } else {
      setForm({
        customer: "",
        pickupAddress: "",
        dropoffAddress: "",
        scheduledDate: "",
        estimatedPrice: 0,
      });
    }

    setPriceError("");
  }, [open, job]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "estimatedPrice"
          ? value === ""
            ? 0
            : Number(value)
          : value,
    }));

    if (name === "estimatedPrice") {
      setPriceError("");
    }
  };

  const submitForm = async () => {
    if (!form.customer) return;

    if (!form.estimatedPrice || form.estimatedPrice <= 0) {
      setPriceError("Enter a valid amount");
      return;
    }

    setSaving(true);

    try {
      await onSubmit({
        customer: form.customer,
        pickupAddress: form.pickupAddress,
        dropoffAddress: form.dropoffAddress,
        scheduledDate: form.scheduledDate,
        estimatedPrice: form.estimatedPrice,
      });

      onClose();
    } catch (error) {
      console.error("Failed to save job:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={job ? "Edit job" : "Create job"}
    >
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-3">

          {/* Customer */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-ink-900">
              Customer
            </label>

            <select
              name="customer"
              value={form.customer}
              onChange={handleChange}
              disabled={loadingCustomers}
              className="h-9 w-full rounded-md border border-line bg-white px-2.5 text-xs text-ink-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="">
                {loadingCustomers
                  ? "Loading customers..."
                  : "Select customer"}
              </option>

              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}
                  {customer.email ? ` — ${customer.email}` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Pickup + Dropoff */}
          <div className="grid grid-cols-2 gap-2">

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-ink-900">
                Pickup address
              </label>

              <input
                name="pickupAddress"
                type="text"
                value={form.pickupAddress}
                onChange={handleChange}
                placeholder="412 Baker St, Austin, TX"
                className="h-9 w-full rounded-md border border-line bg-white px-2.5 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-ink-900">
                Dropoff address
              </label>

              <input
                name="dropoffAddress"
                type="text"
                value={form.dropoffAddress}
                onChange={handleChange}
                placeholder="88 Willow Ave, Round Rock, TX"
                className="h-9 w-full rounded-md border border-line bg-white px-2.5 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

          </div>

          {/* Date + Price */}
          <div className="grid grid-cols-2 gap-2">

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-ink-900">
                Scheduled date
              </label>

              <input
                name="scheduledDate"
                type="date"
                value={form.scheduledDate}
                onChange={handleChange}
                className="h-9 w-full rounded-md border border-line bg-white px-2.5 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-ink-900">
                Estimated price
              </label>

              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-ink-500">
                  $
                </span>

                <input
                  name="estimatedPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    form.estimatedPrice === 0
                      ? ""
                      : form.estimatedPrice
                  }
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`h-9 w-full rounded-md border bg-white pl-6 pr-2.5 text-xs outline-none ${
                    priceError
                      ? "border-[#D0453C] focus:ring-2 focus:ring-[#D0453C]/20"
                      : "border-line focus:border-brand focus:ring-2 focus:ring-brand/20"
                  }`}
                />
              </div>

              {priceError && (
                <span className="text-[10px] text-[#D0453C]">
                  {priceError}
                </span>
              )}
            </div>

          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              size="sm"
              onClick={submitForm}
              disabled={saving}
            >
              {saving
                ? "Creating..."
                : job
                ? "Save changes"
                : "Create job"}
            </Button>
          </div>

        </div>
      </div>
    </Modal>
  );
}