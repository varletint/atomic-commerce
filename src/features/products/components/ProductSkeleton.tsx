interface ProductSkeletonProps {
  count?: number;
  viewMode?: 'grid' | 'list';
}

export function ProductSkeleton({ count = 6, viewMode = 'grid' }: ProductSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_140px] gap-5 items-center py-5 border-b border-[var(--color-border)] animate-pulse"
          >
            <div className="flex flex-col gap-3">
              <div className="h-3 w-16 bg-[var(--color-bg-muted)]" />
              <div className="h-4 w-40 bg-[var(--color-bg-muted)]" />
              <div className="h-3 w-24 bg-[var(--color-bg-muted)]" />
              <div className="h-4 w-20 bg-[var(--color-bg-muted)]" />
            </div>
            <div className="w-[140px] h-[140px] bg-[var(--color-bg-muted)]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] bg-[var(--color-bg-muted)] mb-4" />
          <div className="flex flex-col gap-2">
            <div className="h-3 w-16 bg-[var(--color-bg-muted)]" />
            <div className="h-4 w-32 bg-[var(--color-bg-muted)]" />
            <div className="flex gap-1.5 mt-1">
              <div className="w-3.5 h-3.5 bg-[var(--color-bg-muted)]" />
              <div className="w-3.5 h-3.5 bg-[var(--color-bg-muted)]" />
              <div className="w-3.5 h-3.5 bg-[var(--color-bg-muted)]" />
            </div>
            <div className="h-4 w-24 bg-[var(--color-bg-muted)] mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
}
