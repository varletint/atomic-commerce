import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis
  function getPages(): (number | '...')[] {
    const pages: (number | '...')[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-12" aria-label="Pagination">
      {/* Prev */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex items-center justify-center w-10 h-10 text-[var(--color-text)]
          border border-[var(--color-border)] hover:border-[var(--color-text-heading)]
          hover:text-[var(--color-text-heading)] disabled:opacity-30 disabled:cursor-not-allowed
          transition-colors cursor-pointer"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page numbers */}
      {getPages().map((page, idx) =>
        page === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-10 h-10 flex items-center justify-center text-sm text-[var(--color-text-muted)]"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`flex items-center justify-center w-10 h-10 text-sm font-bold
              border transition-colors cursor-pointer
              ${
                page === currentPage
                  ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)] border-[var(--color-accent)]'
                  : 'text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-text-heading)] hover:text-[var(--color-text-heading)]'
              }`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center justify-center w-10 h-10 text-[var(--color-text)]
          border border-[var(--color-border)] hover:border-[var(--color-text-heading)]
          hover:text-[var(--color-text-heading)] disabled:opacity-30 disabled:cursor-not-allowed
          transition-colors cursor-pointer"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
