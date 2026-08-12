export function JobsTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-line bg-surface overflow-hidden">
      <div className="h-11 bg-ink-50 border-b border-line" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-line last:border-0">
          <div className="h-3.5 w-28 rounded bg-ink-100 animate-pulse" />
          <div className="h-3.5 w-40 rounded bg-ink-100 animate-pulse" />
          <div className="h-3.5 w-24 rounded bg-ink-100 animate-pulse" />
          <div className="h-6 w-20 rounded-full bg-ink-100 animate-pulse ml-auto" />
        </div>
      ))}
    </div>
  );
}