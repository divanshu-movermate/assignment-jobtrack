"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export interface DashboardStats {
  jobsByStatus: {
    quote_requested: number;
    quoted: number;
    confirmed: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };

  pipelineRevenue: number;

  jobsThisMonth: number;

  jobsLastMonth: number;

  topCustomer: {
    customer: {
      _id: string;
      name: string;
      email?: string;
    };
    jobs: number;
  } | null;

  topCustomers: {
    customer: {
      _id: string;
      name: string;
      email?: string;
    };
    jobs: number;
  }[];
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch<DashboardStats>(
        "/dashboard/stats"
      );

      setStats(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    stats,
    loading,
    error,
    refresh,
  };
}