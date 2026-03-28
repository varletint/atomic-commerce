import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '@/types';
import { getPrimaryImageUrl } from '@/types';
import { formatCurrency } from '@/utils';
import { useCartStore } from '@/store';

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, selectedVariant, quantity, price } = item;

  const imageUrl = getPrimaryImageUrl(product);

  // Format selected variants for display (e.g., "Size: M | Color: Black")
  const variantDisplay = selectedVariant
    ? Object.entries(selectedVariant)
        .map(([key, value]) => `${key}: ${value}`)
        .join(' | ')
    : '';

  return (
    <div className="flex gap-4 sm:gap-6 py-6 border-b border-[var(--color-border)] last:border-b-0">
      {/* ── Image ── */}
      <Link to={`/products/${product.slug}`} className="shrink-0">
        <div className="w-24 h-32 sm:w-32 sm:h-[170px] bg-[var(--color-bg-subtle)] relative">
          <img
            src={imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </Link>

      {/* ── Details & Controls ── */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1 block">
              {product.brand || product.category}
            </span>
            <Link
              to={`/products/${product.slug}`}
              className="text-base sm:text-lg font-bold text-[var(--color-text-heading)] hover:text-[var(--color-accent)] transition-colors line-clamp-2"
            >
              {product.name}
            </Link>

            {variantDisplay && (
              <p className="text-sm text-[var(--color-text)] mt-1.5 font-medium">
                {variantDisplay}
              </p>
            )}
          </div>

          <div className="text-right shrink-0">
            <span className="text-base font-bold text-[var(--color-text-heading)] block">
              {formatCurrency(price * quantity)}
            </span>
            {quantity > 1 && (
              <span className="text-xs text-[var(--color-text-muted)] mt-1 block">
                {formatCurrency(price)} each
              </span>
            )}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-end justify-between mt-4">
          <div className="flex items-center border border-[var(--color-border-strong)] bg-[var(--color-bg)]">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, quantity - 1)}
              className="w-10 h-10 flex items-center justify-center text-[var(--color-text-heading)] hover:bg-[var(--color-bg-subtle)] transition-colors active:scale-95 cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 flex items-center justify-center text-sm font-bold text-[var(--color-text-heading)]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, quantity + 1)}
              disabled={quantity >= product.available}
              className="w-10 h-10 flex items-center justify-center text-[var(--color-text-heading)] hover:bg-[var(--color-bg-subtle)] transition-colors active:scale-95 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              aria-label="Increase quantity"
              title={quantity >= product.available ? 'Max stock reached' : ''}
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-colors p-2 -mr-2 cursor-pointer flex items-center gap-2 group"
            aria-label="Remove item"
          >
            <span className="text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
              Remove
            </span>
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
