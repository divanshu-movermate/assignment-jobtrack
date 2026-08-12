"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Job, JobListData, JobStatus } from "@/lib/types";
import type { JobFormValues } from "@/lib/schemas/jobSchema";

export interface JobsQuery {
  page: number;
  limit: number;
  search: string;
  status: JobStatus | "";
  sort: string; // e.g. "-scheduledDate" | "scheduledDate"
}

const DEFAULT_QUERY: JobsQuery = {
  page: 1,
  limit: 10,
  search: "",
  status: "",
  sort: "-scheduledDate",
};

export function useJobs(initial: Partial<JobsQuery> = {}) {
  const [query, setQuery] = useState<JobsQuery>({ ...DEFAULT_QUERY, ...initial });
  const [data, setData] = useState<JobListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    params.set("page", String(query.page));
    params.set("limit", String(query.limit));
    if (query.search) params.set("search", query.search);
    if (query.status) params.set("status", query.status);
    if (query.sort) params.set("sort", query.sort);

    try {
      const result = await apiFetch<JobListData>(`/jobs?${params.toString()}`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const setSearch = (search: string) => setQuery((q) => ({ ...q, search, page: 1 }));
  const setStatus = (status: JobStatus | "") => setQuery((q) => ({ ...q, status, page: 1 }));
  const setSort = (sort: string) => setQuery((q) => ({ ...q, sort, page: 1 }));
  const setPage = (page: number) => setQuery((q) => ({ ...q, page }));

  const createJob = useCallback(
    async (values: JobFormValues) => {
      const job = await apiFetch<Job>("/jobs", {
        method: "POST",
        body: JSON.stringify(values),
      });
      await fetchJobs();
      return job;
    },
    [fetchJobs]
  );

  return {
    query,
    jobs: data?.jobs ?? [],
    pagination: data?.pagination ?? null,
    loading,
    error,
    setSearch,
    setStatus,
    setSort,
    setPage,
    createJob,
    refresh: fetchJobs,
  };
}