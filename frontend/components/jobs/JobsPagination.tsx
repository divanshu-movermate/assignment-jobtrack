import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "@/lib/types";

interface JobsPaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function JobsPagination({ pagination, onPageChange }: JobsPaginationProps) {
  const { page, totalPages, total, limit } = pagination;
  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between mt-4 text-[13px] text-ink-500">
      <span>
        Showing {start}–{end} of {total}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="w-8 h-8 rounded-lg border border-line bg-white flex items-center justify-center disabled:opacity-40 hover:bg-ink-50"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="px-2 font-medium text-ink-700">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="w-8 h-8 rounded-lg border border-line bg-white flex items-center justify-center disabled:opacity-40 hover:bg-ink-50"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}