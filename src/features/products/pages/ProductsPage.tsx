import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { ROUTES } from '@/config/routes';
import { ProductGrid } from '../components/ProductGrid';
import { FilterToolbar } from '../components/FilterToolbar';
import { FilterSidebar } from '../components/FilterSidebar';
import { Pagination } from '../components/Pagination';
import { ProductSkeleton } from '../components/ProductSkeleton';
import type { ProductColor } from '@/types';

// ── Color hex map (for UI swatches — in production this comes from the CMS/backend) ────────
const COLOR_HEX_MAP: Record<string, string> = {
  'Obsidian Black': '#0a0a0a',
  'Pure White': '#ffffff',
  'Slate Gray': '#737373',
  'Navy Blue': '#1e3a8a',
  Red: '#ef4444',
};

function toProductColor(name: string): ProductColor {
  return { name, hex: COLOR_HEX_MAP[name] ?? '#888888' };
}

const CATEGORIES = ['Electronics', 'Accessories', 'Apparel', 'Kaftan', 'Hulla'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'];
const MATERIALS = ['Cotton', 'Cotton Blend', 'Leather', 'Stainless Steel', 'Plastic/Metal'];

// Build a unique set of ProductColor swatches
const ALL_COLORS: ProductColor[] = [
  toProductColor('Obsidian Black'),
  toProductColor('Pure White'),
  toProductColor('Slate Gray'),
  toProductColor('Navy Blue'),
  toProductColor('Red'),
];

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Parse filters from URL
  const selectedCategory = searchParams.get('category') || '';
  const searchInput = searchParams.get('q') || '';
  const sortValue = searchParams.get('sort') || 'createdAt-desc';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const selectedCategories = searchParams.getAll('categories');
  const selectedColors = searchParams.getAll('colors');
  const selectedSizes = searchParams.getAll('sizes');
  const selectedMaterial = searchParams.get('material') || '';
  const minPrice = searchParams.get('minP') || '';
  const maxPrice = searchParams.get('maxP') || '';
  const inStockOnly = searchParams.get('inStock') === 'true';

  // Update URL helper
  const updateParams = (updates: Record<string, string | string[] | null>) => {
    const newParams = new URLSearchParams(searchParams);
    // Reset to page 1 on any filter change
    if (!('page' in updates)) newParams.set('page', '1');

    Object.entries(updates).forEach(([key, value]) => {
      newParams.delete(key);
      if (Array.isArray(value)) {
        value.forEach((v) => newParams.append(key, v));
      } else if (value !== null && value !== '') {
        newParams.set(key, value);
      }
    });

    setSearchParams(newParams);
  };

  const handleClearAll = () => {
    setSearchParams(new URLSearchParams());
  };

  // Pagination variables
  const limit = 6;

  const [sortField, sortDir] = sortValue.split('-');

  // Real API integration
  const { data: paginatedData, isLoading } = useProducts({
    search: searchInput || undefined,
    category: selectedCategory || undefined,
    sortBy: sortField as any,
    sortOrder: sortDir as 'asc' | 'desc',
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    inStock: inStockOnly || undefined,
    colors: selectedColors.length ? selectedColors : undefined,
    sizes: selectedSizes.length ? selectedSizes : undefined,
    material: selectedMaterial || undefined,
    page,
    limit,
  });

  const filteredProducts = paginatedData?.data || [];
  const totalPages = paginatedData?.totalPages || 1;
  const safePage = Math.max(1, Math.min(page, Math.max(1, totalPages)));
  const paginatedProducts = filteredProducts;

  return (
    <>
      <SEO title={`${selectedCategory || 'All'} Products — Atomic Order`} />

      <div className="bg-[var(--color-bg)] min-h-screen pt-8 pb-20">
        <div className="container">
          {/* ── Page Header ────────────────────────── */}
          <header className="mb-8">
            <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">
              <Link
                to={ROUTES.HOME}
                className="hover:text-[var(--color-text-heading)] transition-colors"
              >
                Home
              </Link>
              <ChevronRight size={14} />
              <Link
                to={ROUTES.PRODUCTS}
                className={
                  selectedCategory
                    ? 'hover:text-[var(--color-text-heading)] transition-colors'
                    : 'text-[var(--color-text-heading)]'
                }
              >
                Products
              </Link>
              {selectedCategory && (
                <>
                  <ChevronRight size={14} />
                  <span className="text-[var(--color-text-heading)]">{selectedCategory}</span>
                </>
              )}
            </nav>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--color-text-heading)]">
                {selectedCategory || 'ALL PRODUCTS'}
              </h1>
              <span className="text-sm font-medium text-[var(--color-text-muted)]">
                Showing {paginatedProducts.length} of {filteredProducts.length} products
              </span>
            </div>
          </header>

          {/* ── Toolbar ────────────────────────────── */}
          <FilterToolbar
            search={searchInput}
            onSearchChange={(q) => updateParams({ q: q || null })}
            activeCategory={selectedCategory}
            onCategoryChange={(c) => updateParams({ category: c || null })}
            sortValue={sortValue}
            onSortChange={(s) => updateParams({ sort: s })}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            categories={CATEGORIES}
            onToggleSidebar={() => setIsSidebarOpen(true)}
          />

          <div className="flex items-start gap-8 relative">
            {/* ── Sidebar ────────────────────────────── */}
            <FilterSidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              categories={CATEGORIES}
              selectedCategories={selectedCategories}
              onCategoryToggle={(cat) => {
                const newCat = selectedCategories.includes(cat)
                  ? selectedCategories.filter((c) => c !== cat)
                  : [...selectedCategories, cat];
                updateParams({ categories: newCat.length ? newCat : null });
              }}
              availableColors={ALL_COLORS}
              selectedColors={selectedColors}
              onColorToggle={(color) => {
                const newCol = selectedColors.includes(color)
                  ? selectedColors.filter((c) => c !== color)
                  : [...selectedColors, color];
                updateParams({ colors: newCol.length ? newCol : null });
              }}
              availableSizes={SIZES}
              selectedSizes={selectedSizes}
              onSizeToggle={(size) => {
                const newSz = selectedSizes.includes(size)
                  ? selectedSizes.filter((s) => s !== size)
                  : [...selectedSizes, size];
                updateParams({ sizes: newSz.length ? newSz : null });
              }}
              availableMaterials={MATERIALS}
              selectedMaterial={selectedMaterial}
              onMaterialChange={(m) => updateParams({ material: m || null })}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinPriceChange={(val) => updateParams({ minP: val || null })}
              onMaxPriceChange={(val) => updateParams({ maxP: val || null })}
              inStockOnly={inStockOnly}
              onInStockToggle={() => updateParams({ inStock: inStockOnly ? null : 'true' })}
              onClearAll={handleClearAll}
            />

            {/* ── Main Content Grid ──────────────────── */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <ProductSkeleton count={6} viewMode={viewMode} />
              ) : paginatedProducts.length > 0 ? (
                <>
                  <ProductGrid products={paginatedProducts} viewMode={viewMode} />
                  <Pagination
                    currentPage={safePage}
                    totalPages={totalPages}
                    onPageChange={(p) => {
                      updateParams({ page: p.toString() });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </>
              ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                  <div className="w-16 h-16 mb-4 rounded-full bg-[var(--color-bg-muted)] flex items-center justify-center">
                    <span className="text-2xl text-[var(--color-text-muted)]">⊙</span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-text-heading)] mb-2">
                    No products found
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] max-w-sm mb-6">
                    We couldn't find any products matching your current filters. Try adjusting your
                    search criteria or clearing all filters.
                  </p>
                  <button onClick={handleClearAll} className="btn btn-secondary text-xs">
                    CLEAR ALL FILTERS
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
