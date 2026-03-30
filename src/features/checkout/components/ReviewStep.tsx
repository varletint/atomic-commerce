import { MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/utils/format';
import type { Address } from '@/types/user';
import type { PaymentMethod } from '@/types/order';

const METHOD_LABELS: Record<PaymentMethod, string> = {
  CARD: 'Card',
  BANK_TRANSFER: 'Bank Transfer',
  WALLET: 'Wallet',
  USSD: 'USSD',
  CASH_ON_DELIVERY: 'Cash on Delivery',
  CASH_IN_STORE: 'Pay in Store',
};

interface ReviewStepProps {
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  onPlaceOrder: () => void;
  onBack: () => void;
  isPlacing: boolean;
}

export function ReviewStep({
  shippingAddress,
  paymentMethod,
  onPlaceOrder,
  onBack,
  isPlacing,
}: ReviewStepProps) {
  const items = useCartStore((s) => s.items);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black uppercase tracking-widest text-[var(--color-text-heading)]">
          Review Order
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Confirm your details before placing the order.
        </p>
      </div>

      <div className="space-y-4">
        {/* Shipping Address */}
        <div className="border border-[var(--color-border)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={14} />
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
              Shipping Address
            </span>
          </div>
          <p className="text-sm font-semibold text-[var(--color-text-heading)]">
            {shippingAddress.street}
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">{shippingAddress.country}</p>
        </div>

        {/* Payment Method */}
        <div className="border border-[var(--color-border)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={14} />
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
              Payment Method
            </span>
          </div>
          <p className="text-sm font-bold text-[var(--color-text-heading)] uppercase tracking-wider">
            {METHOD_LABELS[paymentMethod]}
          </p>
        </div>

        {/* Order Items */}
        <div className="border border-[var(--color-border)] p-5">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] block mb-4">
            Items ({items.length})
          </span>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold text-[var(--color-text-heading)]">
                    {item.product.name}
                  </span>
                  <span className="text-[var(--color-text-muted)] ml-2">×{item.quantity}</span>
                </div>
                <span className="font-bold text-[var(--color-text-heading)]">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border border-[var(--color-text-heading)] bg-[var(--color-text-heading)] text-[var(--color-bg)] p-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="opacity-70">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="opacity-70">Delivery</span>
            <span>{deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-lg font-black border-t border-[var(--color-bg)] border-opacity-20 pt-3">
            <span>TOTAL</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onBack} className="flex-1">
          BACK
        </Button>
        <Button type="button" onClick={onPlaceOrder} isLoading={isPlacing} className="flex-1">
          PLACE ORDER
        </Button>
      </div>
    </div>
  );
}
