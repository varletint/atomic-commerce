import type { ProductColor } from '@/types';

interface VariantSelectorProps {
  colors?: ProductColor[];
  selectedColor?: string;
  onColorSelect: (colorName: string) => void;
  sizes?: string[];
  selectedSize?: string;
  onSizeSelect: (size: string) => void;
  // In a real app, variant validation would happen here to disable out-of-stock combos
}

export function VariantSelector({
  colors,
  selectedColor,
  onColorSelect,
  sizes,
  selectedSize,
  onSizeSelect,
}: VariantSelectorProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* ── Colors ── */}
      {colors && colors.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-text-heading)]">
              Color
            </h3>
            <span className="text-sm font-medium text-[var(--color-text-muted)]">
              {selectedColor || 'Select a color'}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => {
              const isActive = selectedColor === color.name;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => onColorSelect(color.name)}
                  className={`relative w-10 h-10 cursor-pointer overflow-hidden transition-all duration-200 outline-none
                    ${
                      isActive
                        ? 'border-2 border-[var(--color-accent)] scale-110'
                        : 'border border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
                    }`}
                  aria-label={`Select color ${color.name}`}
                  aria-pressed={isActive}
                >
                  <span
                    className="absolute inset-0 w-full h-full"
                    style={{ backgroundColor: color.hex }}
                  />
                  {/* Inner white border for dark colors to pop against the selection ring */}
                  {isActive && (
                    <span className="absolute inset-0 border border-white opacity-50 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Sizes ── */}
      {sizes && sizes.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-text-heading)]">
              Size
            </h3>
            <span className="text-sm font-medium text-[var(--color-text-muted)]">
              {selectedSize || 'Select a size'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isActive = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSizeSelect(size)}
                  className={`min-w-[3rem] px-4 py-3 text-sm font-bold uppercase tracking-wider
                    transition-all duration-200 cursor-pointer outline-none border
                    ${
                      isActive
                        ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)] border-[var(--color-accent)]'
                        : 'bg-transparent text-[var(--color-text-heading)] border-[var(--color-border)] hover:border-[var(--color-text-heading)]'
                    }`}
                  aria-pressed={isActive}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
