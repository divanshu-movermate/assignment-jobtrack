"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Job, JobStatus } from "@/lib/types";

interface JobsQuery {
  search: string;
  status: JobStatus | "";
  sort: string;
  page: number;
  limit: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface JobsResponse {
  jobs: Job[];
  pagination: Pagination;
}

interface JobFormValues {
  customer: string;
  pickupAddress: string;
  dropoffAddress: string;
  scheduledDate: string;
  estimatedPrice: number;
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [query, setQuery] = useState<JobsQuery>({
    search: "",
    status: "",
    sort: "scheduledDate:desc",
    page: 1,
    limit: 10,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (query.search) {
        params.set("search", query.search);
      }

      if (query.status) {
        params.set("status", query.status);
      }

      if (query.sort) {
        params.set("sort", query.sort);
      }

      params.set("page", String(query.page));
      params.set("limit", String(query.limit));

      const data = await apiFetch<JobsResponse>(
        `/jobs?${params.toString()}`
      );

      setJobs(data.jobs);
      setPagination(data.pagination);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load jobs"
      );

      setJobs([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const setSearch = useCallback((search: string) => {
    setQuery((prev) => ({
      ...prev,
      search,
      page: 1,
    }));
  }, []);

  const setStatus = useCallback((status: JobStatus | "") => {
    setQuery((prev) => ({
      ...prev,
      status,
      page: 1,
    }));
  }, []);

  const setSort = useCallback((sort: string) => {
    setQuery((prev) => ({
      ...prev,
      sort,
      page: 1,
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setQuery((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const createJob = useCallback(
    async (values: JobFormValues) => {
      const data = await apiFetch<Job>("/jobs", {
        method: "POST",
        body: JSON.stringify({
          customer: values.customer,
          pickupAddress: values.pickupAddress,
          dropoffAddress: values.dropoffAddress,
          scheduledDate: values.scheduledDate,
          estimatedPrice: values.estimatedPrice,
        }),
      });

      await fetchJobs();

      return data;
    },
    [fetchJobs]
  );

  return {
    jobs,
    pagination,
    query,
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