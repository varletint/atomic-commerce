import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import type { Product, ProductColor } from '@/types';
import { getPrimaryImageUrl, getUniqueColors, getUniqueSizes } from '@/types';
import { formatCurrency } from '@/utils';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  /** Pre-computed color swatches (with hex) — passed from parent for richer display */
  colorSwatches?: ProductColor[];
}

export function ProductCard({ product, viewMode = 'grid', colorSwatches }: ProductCardProps) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const isNew = product.tags?.includes('new-arrival');

  // Derive colors and sizes from variants
  const colors = colorSwatches ?? [];
  const sizes = getUniqueSizes(product);
  const imageUrl = getPrimaryImageUrl(product);

  const maxSwatches = 4;
  const extraColors = Math.max(0, colors.length - maxSwatches);

  if (viewMode === 'list') {
    return (
      <Link
        to={`/products/${product.slug}`}
        className="group grid grid-cols-[1fr_140px] gap-5 items-center py-5 border-b border-[var(--color-border)] no-underline"
        id={`product-${product.id}`}
      >
        {/* Info (left) */}
        <div className="flex flex-col gap-2">
          <span className="text-[0.6875rem] font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">
            {product.category}
          </span>
          <h3 className="text-base font-semibold text-[var(--color-text-heading)] leading-tight">
            {product.name}
          </h3>

          {/* Color swatches */}
          {colors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-1">
              {colors.slice(0, maxSwatches).map((c) => (
                <span
                  key={c.hex}
                  className="w-4 h-4 border border-[var(--color-border-strong)] shrink-0"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              {extraColors > 0 && (
                <span className="text-[0.625rem] text-[var(--color-text-muted)] font-semibold">
                  +{extraColors}
                </span>
              )}
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="flex items-center gap-1 mt-0.5">
              {sizes.map((s) => (
                <span
                  key={s}
                  className="text-[0.625rem] text-[var(--color-text-muted)] font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Prices */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-[var(--color-text-heading)]">
              {formatCurrency(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-[var(--color-text-muted)] line-through">
                {formatCurrency(product.compareAtPrice!)}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.avgRating > 0 && (
            <div className="flex items-center gap-1">
              <Star
                size={12}
                className="fill-[var(--color-text-heading)] text-[var(--color-text-heading)]"
              />
              <span className="text-xs font-semibold text-[var(--color-text-heading)]">
                {product.avgRating.toFixed(1)}
              </span>
              {product.reviewCount > 0 && (
                <span className="text-xs text-[var(--color-text-muted)]">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          )}

          {/* Add to cart */}
          <button
            type="button"
            className="mt-2 flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider
              bg-[var(--color-accent)] text-[var(--color-text-inverse)] border border-[var(--color-accent)]
              hover:bg-[var(--color-accent-hover)] transition-colors cursor-pointer w-fit"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ShoppingBag size={14} />
            ADD TO CART
          </button>
        </div>

        {/* Image (right) */}
        <div className="relative overflow-hidden bg-[var(--color-bg-subtle)] w-[140px] h-[140px]">
          {(hasDiscount || isNew) && (
            <span className="absolute top-1.5 left-1.5 z-2 px-2 py-0.5 text-[0.5625rem] font-extrabold tracking-widest bg-[var(--color-accent)] text-[var(--color-text-inverse)]">
              {hasDiscount ? 'SALE' : 'NEW'}
            </span>
          )}
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
    );
  }

  // ── Grid View ──────────────────────────────────
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group relative block no-underline"
      id={`product-${product.id}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[var(--color-bg-subtle)] aspect-[3/4] mb-4">
        {(hasDiscount || isNew) && (
          <span className="absolute top-3 left-3 z-2 px-3 py-1 text-[0.625rem] font-extrabold tracking-[0.15em] bg-[var(--color-accent)] text-[var(--color-text-inverse)]">
            {hasDiscount ? 'SALE' : 'NEW'}
          </span>
        )}
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
          loading="lazy"
        />
        {/* Hover cart button */}
        <button
          type="button"
          className="absolute bottom-3 right-3 z-2 w-10 h-10 flex items-center justify-center
            bg-[var(--color-bg)] text-[var(--color-text-heading)] border border-[var(--color-border)]
            opacity-100 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
            hover:bg-[var(--color-accent)] hover:text-[var(--color-text-inverse)] hover:border-[var(--color-accent)]
            transition-all duration-150 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingBag size={18} />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold tracking-[0.1em] text-[var(--color-text-muted)] uppercase">
          {product.category}
        </span>
        <h3 className="text-base font-semibold text-[var(--color-text-heading)]">{product.name}</h3>

        {/* Color swatches */}
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-0.5">
            {colors.slice(0, maxSwatches).map((c) => (
              <span
                key={c.hex}
                className="w-3.5 h-3.5 border border-[var(--color-border-strong)] shrink-0"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {extraColors > 0 && (
              <span className="text-[0.625rem] text-[var(--color-text-muted)] font-semibold">
                +{extraColors}
              </span>
            )}
          </div>
        )}

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="flex items-center gap-1.5">
            {sizes.map((s) => (
              <span
                key={s}
                className="text-[0.625rem] text-[var(--color-text-muted)] font-medium uppercase"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Prices + Rating */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold text-[var(--color-text-heading)]">
            {formatCurrency(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-[var(--color-text-muted)] line-through">
              {formatCurrency(product.compareAtPrice!)}
            </span>
          )}
        </div>

        {product.avgRating > 0 && (
          <div className="flex items-center gap-1 mt-0.5">
            <Star
              size={12}
              className="fill-[var(--color-text-heading)] text-[var(--color-text-heading)]"
            />
            <span className="text-xs font-semibold text-[var(--color-text-heading)]">
              {product.avgRating.toFixed(1)}
            </span>
            {product.reviewCount > 0 && (
              <span className="text-xs text-[var(--color-text-muted)]">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
