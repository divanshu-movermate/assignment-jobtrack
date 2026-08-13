"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";

interface Staff {
  _id: string;
  name: string;
  email: string;
  role: string;
  assignedJobs?: unknown[];
}

interface StaffResponse {
  staff: Staff[];
}

interface AssignCrewButtonProps {
  assignedCrew: Staff[] | string[];
  onSave: (crewIds: string[]) => Promise<void>;
}

export function AssignCrewButton({
  assignedCrew,
  onSave,
}: AssignCrewButtonProps) {
  const [open, setOpen] = useState(false);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStaff = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<StaffResponse>("/auth/staff");

      console.log("STAFF RESPONSE:", response);
      console.log("STAFF:", response.staff);

      setStaff(response.staff ?? []);
    } catch (err) {
      console.error("Failed to load staff:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load staff"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    loadStaff();

    const ids = assignedCrew
      .map((member) =>
        typeof member === "string"
          ? member
          : member._id
      )
      .filter(Boolean);

    setSelected(ids);
  }, [open, assignedCrew]);

  const toggleStaff = (id: string) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      console.log("CREW IDS:", selected);

      await onSave(selected);

      setOpen(false);
    } catch (err) {
      console.error("Failed to assign crew:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to assign crew"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setOpen(true)}
      >
        <Users size={14} />
        Assign crew
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">

            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink-900">
                Assign crew
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-lg text-ink-500 hover:text-ink-900"
              >
                ×
              </button>
            </div>

            {/* Loading */}
            {loading ? (
              <p className="py-6 text-center text-sm text-ink-500">
                Loading staff...
              </p>
            ) : error ? (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            ) : staff.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-500">
                Staff not available
              </p>
            ) : (
              <div className="max-h-80 space-y-2 overflow-y-auto">

                {staff.map((member) => {
                  const checked = selected.includes(
                    member._id
                  );

                  return (
                    <label
                      key={member._id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                        checked
                          ? "border-brand bg-brand-tint"
                          : "border-line hover:bg-ink-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          toggleStaff(member._id)
                        }
                        className="h-4 w-4"
                      />

                      <div className="flex-1">
                        <p className="text-sm font-medium text-ink-900">
                          {member.name}
                        </p>

                        <p className="text-xs text-ink-500">
                          {member.email}
                        </p>

                        <p className="mt-1 text-[11px] text-ink-400">
                          {member.assignedJobs?.length ?? 0}{" "}
                          assigned job
                          {(member.assignedJobs?.length ?? 0) !== 1
                            ? "s"
                            : ""}
                        </p>
                      </div>

                      {checked && (
                        <span className="text-xs font-semibold text-brand">
                          Selected
                        </span>
                      )}
                    </label>
                  );
                })}

              </div>
            )}

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between">
              <p className="text-xs text-ink-500">
                {selected.length} staff selected
              </p>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  size="sm"
                  disabled={saving || loading}
                  onClick={handleSave}
                >
                  {saving ? "Saving..." : "Save crew"}
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}