import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (qty: number) => void;
  maxQuantity?: number;
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  maxQuantity = 99,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > 1) onQuantityChange(quantity - 1);
  };

  const handleIncrement = () => {
    if (quantity < maxQuantity) onQuantityChange(quantity + 1);
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-text-heading)]">
        Quantity
      </h3>
      <div className="flex items-center h-[52px] border border-[var(--color-border)] w-[140px] bg-transparent">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={quantity <= 1}
          className="flex-1 h-full flex items-center justify-center text-[var(--color-text-heading)] 
            hover:bg-[var(--color-bg-muted)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>

        <div className="flex-1 flex items-center justify-center h-full text-base font-bold text-[var(--color-text-heading)] border-x border-[var(--color-border)]">
          {quantity}
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={quantity >= maxQuantity}
          className="flex-1 h-full flex items-center justify-center text-[var(--color-text-heading)] 
            hover:bg-[var(--color-bg-muted)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
