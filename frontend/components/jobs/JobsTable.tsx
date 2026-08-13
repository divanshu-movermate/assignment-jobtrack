"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "@/components/ui/Table";
import { STATUS_LABEL, StatusBadge } from "@/components/ui/Badge";
import type { Job } from "@/lib/types";
import { PencilLine, Trash } from "lucide-react";

function getCustomerName(customer: Job["customer"]) {
  return typeof customer === "string"
    ? customer
    : customer.name;
}

function getCustomerEmail(customer: Job["customer"]) {
  return typeof customer === "string"
    ? "-"
    : customer.email;
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

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function JobsTable({ jobs }: { jobs: Job[] }) {
  const router = useRouter();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Customer</TableHeaderCell>
          <TableHeaderCell>Scheduled</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Crew</TableHeaderCell>
          <TableHeaderCell>Est. Price</TableHeaderCell>
          <TableHeaderCell>Action</TableHeaderCell>
        </TableRow>
      </TableHead>

      <tbody>
        {jobs.map((job) => (
          <TableRow
            key={job._id}
            onClick={() => router.push(`/jobs/${job._id}`)}
            className="cursor-pointer hover:bg-paper"
          >
            <TableCell >
              <p className="font-semibold">{getCustomerName(job.customer)}</p>
              <p className="text-xs font-light">{getCustomerEmail(job.customer)}</p>
              
            </TableCell>

            <TableCell className="text-ink-500">
              {formatDate(job.scheduledDate)}
            </TableCell>

            <TableCell>
              <StatusBadge status={job.status} />
            </TableCell>


            <TableCell>
                {job.assignedCrew?.length ? (
                  <div className="flex items-center -space-x-1.5">
                    {job.assignedCrew.map((member) => (
                      <span
                        key={member._id}
                        title={member.name}
                        className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-indigo-100 text-[9px] font-semibold text-indigo-700"
                      >
                        {getInitials(member.name)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-ink-400">—</span>
                )}

            </TableCell>

            <TableCell>
              {formatPrice(
                job.finalPrice ?? job.estimatedPrice
              )}
            </TableCell>

            <TableCell className="flex gap-6 ">
              <PencilLine className="h-4 w-4"/>
              <Trash className="h-4 w-4"/>
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
}