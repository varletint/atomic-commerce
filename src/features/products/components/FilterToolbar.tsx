import { Search, LayoutGrid, List, ChevronDown } from 'lucide-react';
import { PRODUCT_SORT_OPTIONS } from '../constants';

interface FilterToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  categories: string[];
  onToggleSidebar?: () => void;
}

export function FilterToolbar({
  search,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  sortValue,
  onSortChange,
  viewMode,
  onViewModeChange,
  categories,
  onToggleSidebar,
}: FilterToolbarProps) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Top row: search + sort + view toggle */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Mobile filter toggle */}
        <button
          type="button"
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider
            border border-[var(--color-border-strong)] text-[var(--color-text-heading)] bg-transparent
            hover:bg-[var(--color-bg-muted)] transition-colors cursor-pointer"
          onClick={onToggleSidebar}
        >
          Filters
        </button>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-[var(--color-border)]
              bg-transparent text-[var(--color-text-heading)] placeholder:text-[var(--color-text-muted)]
              focus:border-[var(--color-accent)] focus:outline-none transition-colors"
          />
        </div>

        {/* Spacer */}
        <div className="flex-1 hidden sm:block" />

        {/* Sort */}
        <div className="relative">
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 text-xs font-semibold uppercase tracking-wider
              border border-[var(--color-border)] bg-transparent text-[var(--color-text-heading)]
              focus:border-[var(--color-accent)] focus:outline-none cursor-pointer"
          >
            {PRODUCT_SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
          />
        </div>

        {/* View toggle */}
        <div className="hidden sm:flex items-center border border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`flex items-center justify-center w-10 h-10 transition-colors cursor-pointer
              ${
                viewMode === 'grid'
                  ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]'
              }`}
            aria-label="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`flex items-center justify-center w-10 h-10 transition-colors cursor-pointer
              ${
                viewMode === 'list'
                  ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]'
              }`}
            aria-label="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {['All', ...categories].map((cat) => {
          const isActive = cat === 'All' ? !activeCategory : activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat === 'All' ? '' : cat)}
              className={`shrink-0 px-5 py-2 text-xs font-bold uppercase tracking-wider
                border transition-all cursor-pointer whitespace-nowrap
                ${
                  isActive
                    ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)] border-[var(--color-accent)]'
                    : 'bg-transparent text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-text-heading)] hover:text-[var(--color-text-heading)]'
                }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
