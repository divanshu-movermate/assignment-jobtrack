"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Job, JobStatus } from "@/lib/types";

interface JobResponse {
  job: Job;
}

export function useJob(id: string) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiFetch<JobResponse>(`/jobs/${id}`);

      // API returns { job: {...} }
      setJob(data.job);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load job"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      refresh();
    }
  }, [id, refresh]);

  const updateStatus = useCallback(
    async (status: JobStatus) => {
      const data = await apiFetch<JobResponse>(`/jobs/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setJob(data.job);
      return data.job;
    },
    [id]
  );

  const addNote = useCallback(
    async (text: string) => {
      const data = await apiFetch<JobResponse>(`/jobs/${id}/notes`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });

      setJob(data.job);
      return data.job;
    },
    [id]
  );

  const updateJob = useCallback(
  async (values: Partial<Job>) => {
    const data = await apiFetch<JobResponse>(`/jobs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(values),
    });

    setJob(data.job);
    return data.job;
  },
  [id]
);

  const updateCrew = useCallback(
    async (crewIds: string[]) => {
      const data = await apiFetch<JobResponse>(`/jobs/${id}/assign`, {
        method: "POST",
        body: JSON.stringify({ assignedCrew: crewIds }),
      });

      setJob(data.job);
      return data.job;
    },
    [id]
  );

  return {
    job,
    loading,
    error,
    refresh,
    updateStatus,
    addNote,
    updateCrew,
    updateJob
  };
}