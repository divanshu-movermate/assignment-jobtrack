import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface JobsEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  onCreate: () => void;
}

export function JobsEmptyState({ hasFilters, onClearFilters, onCreate }: JobsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line bg-surface py-16 text-center">
      <div className="w-11 h-11 rounded-full bg-brand-tint text-brand flex items-center justify-center">
        <ClipboardList size={20} />
      </div>
      {hasFilters ? (
        <>
          <p className="text-sm font-semibold text-ink-900 m-0">No jobs match your filters</p>
          <p className="text-[13px] text-ink-500 m-0">Try a different search or clear your filters.</p>
          <Button variant="secondary" size="sm" onClick={onClearFilters} className="mt-1">
            Clear filters
          </Button>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-ink-900 m-0">No jobs yet</p>
          <p className="text-[13px] text-ink-500 m-0">Create your first job to get started.</p>
          <Button size="sm" onClick={onCreate} className="mt-1">
            Create job
          </Button>
        </>
      )}
    </div>
  );
}