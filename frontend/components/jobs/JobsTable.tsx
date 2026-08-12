"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "@/components/ui/Table";
import { STATUS_LABEL, Badge } from "@/components/ui/Badge";
import type { Job } from "@/lib/types";

function customerName(job: Job) {
  return typeof job.customer === "string"
    ? job.customer
    : job.customer.name;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatPrice(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function JobsTable({ jobs }: { jobs: Job[] }) {
  const router = useRouter();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Customer</TableHeaderCell>
          <TableHeaderCell>Route</TableHeaderCell>
          <TableHeaderCell>Scheduled</TableHeaderCell>
          <TableHeaderCell>Estimate</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
        </TableRow>
      </TableHead>

      <tbody>
        {jobs.map((job) => (
          <TableRow
            key={job._id}
            onClick={() => router.push(`/jobs/${job._id}`)}
            className="cursor-pointer hover:bg-paper"
          >
            <TableCell className="font-semibold">
              {customerName(job)}
            </TableCell>

            <TableCell className="text-ink-500">
              {job.pickupAddress}
              <span className="mx-1">→</span>
              {job.dropoffAddress}
            </TableCell>

            <TableCell>
              {formatDate(job.scheduledDate)}
            </TableCell>

            <TableCell>
              {formatPrice(
                job.finalPrice ?? job.estimatedPrice
              )}
            </TableCell>

            <TableCell>
              <Badge>{STATUS_LABEL[job.status]}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
}