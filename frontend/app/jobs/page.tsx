"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Topbar } from "@/components/layout/Topbar";
import { useJobs } from "@/lib/hooks/useJob";
import { JobsToolbar } from "@/components/jobs/JobsToolbar";
import { JobsTable } from "@/components/jobs/JobsTable";
import { JobsTableSkeleton } from "@/components/jobs/JobsTableSkeleton";
import { JobsEmptyState } from "@/components/jobs/JobsEmptyState";
import { JobsPagination } from "@/components/jobs/JobsPagination";
import { CreateEditModal } from "@/components/jobs/JobsCreateEditJobModal";

export default function JobsPage() {
  const {
    query,
    jobs,
    pagination,
    loading,
    error,
    setSearch,
    setStatus,
    setSort,
    setPage,
    createJob,
  } = useJobs();
  const [modalOpen, setModalOpen] = useState(false);

  const hasFilters = !!query.search || !!query.status;

  return (
    <AppShell>
      <Topbar title="Jobs" />
      <div className="p-7">
        <JobsToolbar
          search={query.search}
          status={query.status}
          sort={query.sort}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onSortChange={setSort}
          onCreate={() => setModalOpen(true)}
        />

        {error && (
          <p className="text-sm font-medium text-[#C23B3B] mb-4">{error}</p>
        )}

        {loading ? (
          <JobsTableSkeleton />
        ) : jobs.length === 0 ? (
          <JobsEmptyState
            hasFilters={hasFilters}
            onClearFilters={() => {
              setSearch("");
              setStatus("");
            }}
            onCreate={() => setModalOpen(true)}
          />
        ) : (
          <>
            <JobsTable jobs={jobs} />
            {pagination && <JobsPagination pagination={pagination} onPageChange={setPage} />}
          </>
        )}
      </div>

      <CreateEditModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={createJob} />
    </AppShell>
  );
}