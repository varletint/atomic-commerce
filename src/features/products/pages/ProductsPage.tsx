import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { ROUTES } from '@/config/routes';
import { ProductGrid } from '../components/ProductGrid';
import { FilterToolbar } from '../components/FilterToolbar';
import { FilterSidebar } from '../components/FilterSidebar';
import { Pagination } from '../components/Pagination';
import { ProductSkeleton } from '../components/ProductSkeleton';
import type { Product, ProductColor } from '@/types';

// ── Mock Data (Replace with API real data later) ────────
const MOCK_COLORS: ProductColor[] = [
  { name: 'Obsidian Black', hex: '#0a0a0a' },
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Slate Gray', hex: '#737373' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: 'Precision Chronograph',
    description: 'A masterpiece of modern horology...',
    price: 99549.0,
    compareAtPrice: 105900.0,
    images: ['/images/home/category-accessories.png'],
    category: 'Accessories',
    stock: 12,
    sku: 'ACC-001',
    slug: 'precision-chronograph',
    colors: [MOCK_COLORS[0], MOCK_COLORS[1]],
    sizes: ['ONE SIZE'],
    material: 'Stainless Steel',
    tags: ['best-seller'],
    rating: 4.8,
    reviewCount: 124,
    variants: [],
  },
  {
    id: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: 'Babban Riga',
    description: 'Traditional elegance redefined...',
    price: 99000.0,
    compareAtPrice: 105000.0,
    images: ['/images/home/7.jpg'],
    category: 'Kaftan',
    stock: 5,
    sku: 'KAF-001',
    slug: 'babban-riga',
    colors: [MOCK_COLORS[0], MOCK_COLORS[2]],
    sizes: ['M', 'L', 'XL'],
    material: 'Cotton',
    tags: ['new-arrival'],
    rating: 4.9,
    reviewCount: 42,
    variants: [],
  },
  {
    id: '3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: 'Essential Crew Tee',
    description: 'The perfect everyday t-shirt...',
    price: 25788.0,
    compareAtPrice: 75000.0,
    images: ['/images/home/category-apparel.png'],
    category: 'Apparel',
    stock: 100,
    sku: 'APP-001',
    slug: 'essential-crew-tee',
    colors: MOCK_COLORS,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    material: 'Cotton',
    tags: ['essential'],
    rating: 4.5,
    reviewCount: 312,
    variants: [],
  },
  {
    id: '4',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: 'Qube',
    description: 'Traditional headwear...',
    price: 50999.0,
    images: ['/images/home/6.jpg'],
    category: 'Hulla',
    stock: 0,
    sku: 'HUL-001',
    slug: 'qube',
    colors: [
      MOCK_COLORS[0],
      MOCK_COLORS[1],
      MOCK_COLORS[3],
      MOCK_COLORS[2],
      { name: 'Red', hex: '#ef4444' },
    ],
    sizes: ['S', 'M', 'L'],
    material: 'Cotton Blend',
    tags: [],
    rating: 4.7,
    reviewCount: 18,
    variants: [],
  },
  {
    id: '5',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: 'Stealth Wireless Pro',
    description: 'High fidelity audio...',
    price: 154000.0,
    images: ['/images/home/category-electronics.png'],
    category: 'Electronics',
    stock: 25,
    sku: 'ELE-001',
    slug: 'stealth-wireless-pro',
    colors: [MOCK_COLORS[0]],
    sizes: [],
    material: 'Plastic/Metal',
    tags: ['new-arrival'],
    rating: 4.6,
    reviewCount: 89,
    variants: [],
  },
];

const CATEGORIES = ['Electronics', 'Accessories', 'Apparel', 'Kaftan', 'Hulla'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'];
const MATERIALS = ['Cotton', 'Cotton Blend', 'Leather', 'Stainless Steel', 'Plastic/Metal'];

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

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

  // Simulate loading on filter change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [searchParams]);

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

  // Mock filtering
  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    if (searchParams.toString() === '') return result; // optimization

    // 1. Search (debounced in real app, immediate here)
    if (searchInput) {
      const q = searchInput.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // 2. Exact string match filters
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (selectedMaterial) result = result.filter((p) => p.material === selectedMaterial);

    // 3. Array inclusion filters (OR logic within same category, AND logic across categories)
    if (selectedCategories.length > 0)
      result = result.filter((p) => selectedCategories.includes(p.category));
    if (selectedSizes.length > 0)
      result = result.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)));
    if (selectedColors.length > 0)
      result = result.filter((p) => p.colors.some((c) => selectedColors.includes(c.name)));

    // 4. Numeric & Boolean filters
    if (minPrice) result = result.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));
    if (inStockOnly) result = result.filter((p) => p.stock > 0);

    // 5. Sorting
    const [sortField, sortDir] = sortValue.split('-');
    result.sort((a, b) => {
      let valA = a[sortField as keyof Product];
      let valB = b[sortField as keyof Product];

      // Handle string vs number sorting safely
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      valA = valA as number;
      valB = valB as number;

      return sortDir === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [searchParams]);

  // Mock pagination (6 per page)
  const limit = 6;
  const totalPages = Math.ceil(filteredProducts.length / limit);
  // Ensure we don't land on page 3 if there's only 1 page
  const safePage = Math.max(1, Math.min(page, Math.max(1, totalPages)));
  const paginatedProducts = filteredProducts.slice((safePage - 1) * limit, safePage * limit);

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
              availableColors={MOCK_COLORS}
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
