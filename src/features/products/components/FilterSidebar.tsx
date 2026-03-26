import { X } from 'lucide-react';
import type { ProductColor } from '@/types';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  // Category
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  // Colors
  availableColors: ProductColor[];
  selectedColors: string[];
  onColorToggle: (colorName: string) => void;
  // Sizes
  availableSizes: string[];
  selectedSizes: string[];
  onSizeToggle: (size: string) => void;
  // Materials
  availableMaterials: string[];
  selectedMaterial: string;
  onMaterialChange: (material: string) => void;
  // Price
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  // Stock
  inStockOnly: boolean;
  onInStockToggle: () => void;
  // Clear
  onClearAll: () => void;
}

export function FilterSidebar({
  isOpen,
  onClose,
  categories,
  selectedCategories,
  onCategoryToggle,
  availableColors,
  selectedColors,
  onColorToggle,
  availableSizes,
  selectedSizes,
  onSizeToggle,
  availableMaterials,
  selectedMaterial,
  onMaterialChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  inStockOnly,
  onInStockToggle,
  onClearAll,
}: FilterSidebarProps) {
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedColors.length > 0 ||
    selectedSizes.length > 0 ||
    selectedMaterial ||
    minPrice ||
    maxPrice ||
    inStockOnly;

  const sidebarContent = (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-text-heading)]">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-error)]
              transition-colors cursor-pointer uppercase tracking-wider"
          >
            Clear All
          </button>
        )}
      </div>

      <hr className="border-[var(--color-border)] m-0" />

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-text-heading)] mb-3">
          Category
        </h4>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => onCategoryToggle(cat)}
                className="w-4 h-4 accent-[var(--color-accent)] cursor-pointer"
              />
              <span className="text-sm text-[var(--color-text)] group-hover:text-[var(--color-text-heading)] transition-colors">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-[var(--color-border)] m-0" />

      {/* Colors */}
      {availableColors.length > 0 && (
        <>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-text-heading)] mb-3">
              Color
            </h4>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => onColorToggle(color.name)}
                  className={`w-7 h-7 border-2 cursor-pointer transition-all
                    ${
                      selectedColors.includes(color.name)
                        ? 'border-[var(--color-accent)] scale-110'
                        : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
                    }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          <hr className="border-[var(--color-border)] m-0" />
        </>
      )}

      {/* Sizes */}
      {availableSizes.length > 0 && (
        <>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-text-heading)] mb-3">
              Size
            </h4>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSizeToggle(size)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider
                    border cursor-pointer transition-all
                    ${
                      selectedSizes.includes(size)
                        ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)] border-[var(--color-accent)]'
                        : 'bg-transparent text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-text-heading)]'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <hr className="border-[var(--color-border)] m-0" />
        </>
      )}

      {/* Material */}
      {availableMaterials.length > 0 && (
        <>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-text-heading)] mb-3">
              Material
            </h4>
            <div className="flex flex-col gap-2">
              {availableMaterials.map((mat) => (
                <label key={mat} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="material"
                    checked={selectedMaterial === mat}
                    onChange={() => onMaterialChange(selectedMaterial === mat ? '' : mat)}
                    className="w-4 h-4 accent-[var(--color-accent)] cursor-pointer"
                  />
                  <span className="text-sm text-[var(--color-text)] group-hover:text-[var(--color-text-heading)] transition-colors">
                    {mat}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <hr className="border-[var(--color-border)] m-0" />
        </>
      )}

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-text-heading)] mb-3">
          Price Range (₦)
        </h4>
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[var(--color-border)]
              bg-transparent text-[var(--color-text-heading)] placeholder:text-[var(--color-text-muted)]
              focus:border-[var(--color-accent)] focus:outline-none"
          />
          <span className="text-[var(--color-text-muted)] text-sm">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[var(--color-border)]
              bg-transparent text-[var(--color-text-heading)] placeholder:text-[var(--color-text-muted)]
              focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>
      </div>

      <hr className="border-[var(--color-border)] m-0" />

      {/* In Stock */}
      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-text-heading)]">
          In Stock Only
        </span>
        <div
          onClick={onInStockToggle}
          className={`relative w-11 h-6 transition-colors cursor-pointer
            ${inStockOnly ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border-strong)]'}`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 bg-white transition-transform
              ${inStockOnly ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
          />
        </div>
      </label>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[260px] shrink-0 pr-8 border-r border-[var(--color-border)]">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside
            className="fixed top-0 left-0 bottom-0 w-[300px] max-w-[85vw] z-50 bg-[var(--color-bg)]
            border-r border-[var(--color-border)] p-6 overflow-y-auto lg:hidden animate-[slideInLeft_0.3s_ease-out]"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-text-heading)]">
                Filters
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-[var(--color-text-muted)]
                  hover:text-[var(--color-text-heading)] cursor-pointer transition-colors"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
