import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { ROUTES } from '@/config/routes';
import { useCartStore } from '@/store';
import { formatCurrency } from '@/utils';
import { CartItemRow } from '../components/CartItemRow';

export function CartPage() {
  const { items, getTotal, getItemCount } = useCartStore();

  const subtotal = getTotal();
  const itemCount = getItemCount();
  const isCartEmpty = items.length === 0;

  // Emulated values for presentation. A real app would calculate these at checkout.
  const taxEstimate = subtotal * 0.05; // 5% tax estimate
  const shippingEstimate = subtotal > 25000 ? 0 : 2500; // Free shipping over 25k
  const orderTotal = subtotal + taxEstimate + shippingEstimate;

  if (isCartEmpty) {
    return (
      <>
        <SEO
          title="Your Cart — Atomic Order"
          description="Review items in your cart before checkout."
        />
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-[var(--color-bg)]">
          <div className="w-20 h-20 bg-[var(--color-bg-subtle)] rounded-full flex items-center justify-center mb-6 text-[var(--color-text-muted)]">
            <ShoppingBag size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-text-heading)] mb-3 text-center uppercase">
            Your Cart is Empty
          </h1>
          <p className="text-[var(--color-text-muted)] mb-8 text-center max-w-md">
            Looks like you haven't added anything to your cart yet. Discover our premium collections
            and find your new favorites.
          </p>
          <Link
            to={ROUTES.PRODUCTS}
            className="h-12 px-8 bg-[var(--color-text-heading)] !text-[var(--color-bg)] font-bold uppercase tracking-widest text-sm flex items-center justify-center hover:bg-[var(--color-accent)] hover:text-[var(--color-text-inverse)] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`Cart (${itemCount}) — Atomic Order`}
        description="Review items in your cart before checkout."
      />

      <div className="bg-[var(--color-bg)] min-h-screen pt-8 pb-24">
        <div className="container max-w-7xl">
          <header className="mb-10 text-center sm:text-left border-b border-[var(--color-border)] pb-6">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--color-text-heading)] uppercase">
              Your Cart
            </h1>
            <p className="text-[var(--color-text-muted)] mt-2 font-medium">
              Ready to checkout? You have {itemCount} {itemCount === 1 ? 'item' : 'items'} in your
              cart.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 xl:gap-16">
            {/* ── Left Column: Items List ── */}
            <div className="flex flex-col">
              <div className="hidden sm:grid grid-cols-[1fr_auto] gap-4 pb-4 border-b border-[var(--color-border)] mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                  Product
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] text-right w-[100px]">
                  Total
                </span>
              </div>

              <div className="flex flex-col">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* ── Right Column: Order Summary ── */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-2 sm:p-8">
                <h2 className="text-lg font-black uppercase tracking-widest text-[var(--color-text-heading)] mb-6 border-b border-[var(--color-border)] pb-4">
                  Order Summary
                </h2>

                <div className="flex flex-col gap-4 text-sm font-medium mb-6 p-4">
                  <div className="flex justify-between text-[var(--color-text)]">
                    <span>Subtotal</span>
                    <span className="text-[var(--color-text-heading)] font-bold">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[var(--color-text-muted)]">
                    <span>Estimated Tax (5%)</span>
                    <span>{formatCurrency(taxEstimate)}</span>
                  </div>

                  <div className="flex justify-between text-[var(--color-text-muted)]">
                    <span>Shipping Estimate</span>
                    <span>
                      {shippingEstimate === 0 ? 'FREE' : formatCurrency(shippingEstimate)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[var(--color-border)] pt-4 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-base font-bold text-[var(--color-text-heading)] uppercase tracking-wider">
                      Total
                    </span>
                    <span className="text-2xl font-black text-[var(--color-text-heading)]">
                      {formatCurrency(orderTotal)}
                    </span>
                  </div>
                </div>

                <Link
                  to={ROUTES.CHECKOUT}
                  className="w-full h-14 bg-[var(--color-accent)] !text-[var(--color-text-inverse)] no-underline font-black uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-3 hover:bg-[var(--color-accent-hover)] transition-colors group"
                >
                  Proceed to Checkout
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <div className="mt-6 flex flex-col items-center gap-3">
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-center">
                    Secure Checkout
                  </p>
                  <div className="flex items-center justify-center gap-3 opacity-60">
                    <div className="w-10 h-6 bg-[#1a1f71] rounded flex justify-center items-center text-[0.5rem] font-bold text-white">
                      VISA
                    </div>
                    <div className="w-10 h-6 bg-[#eb001b] rounded flex justify-center items-center text-[0.5rem] font-bold text-white">
                      MC
                    </div>
                    <div className="w-10 h-6 bg-[#006fcf] rounded flex justify-center items-center text-[0.5rem] font-bold text-white">
                      AMEX
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
