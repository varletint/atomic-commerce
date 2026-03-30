import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Package, MapPin, CreditCard, ClipboardCheck } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useCartStore } from '@/store/useCartStore';
import { orderApi } from '../api/orderApi';
import { ShippingStep } from '../components/ShippingStep';
import { PaymentStep } from '../components/PaymentStep';
import { ReviewStep } from '../components/ReviewStep';
import type { Address } from '@/types/user';
import type { PaymentMethod } from '@/types/order';

type CheckoutStep = 'shipping' | 'payment' | 'review';

const STEPS: { id: CheckoutStep; label: string; icon: React.ReactNode }[] = [
  { id: 'shipping', label: 'Shipping', icon: <MapPin size={16} /> },
  { id: 'payment', label: 'Payment', icon: <CreditCard size={16} /> },
  { id: 'review', label: 'Review', icon: <ClipboardCheck size={16} /> },
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] gap-4">
        <Package size={48} className="text-[var(--color-text-muted)]" />
        <h2 className="text-xl font-black uppercase tracking-widest text-[var(--color-text-heading)]">
          Your cart is empty
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Add some items before checking out.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 px-6 py-3 bg-[var(--color-text-heading)] text-[var(--color-bg)] font-bold uppercase tracking-widest text-xs cursor-pointer"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const handleShipping = (address: Address) => {
    setShippingAddress(address);
    setStep('payment');
  };

  const handlePayment = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setStep('review');
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress || !paymentMethod) return;
    setIsPlacing(true);

    try {
      const orderIdempotencyKey = crypto.randomUUID();
      const { data: orderRes } = await orderApi.createOrder({
        idempotencyKey: orderIdempotencyKey,
        shippingAddress,
      });

      const order = orderRes.data;
      if (!order) throw new Error('Order creation failed');

      const paymentIdempotencyKey = uuidv4();
      const callbackUrl = `${window.location.origin}/checkout/verify?orderId=${order._id}&reference=${paymentIdempotencyKey}`;

      const { data: paymentRes } = await orderApi.processPayment(order._id, {
        paymentMethod,
        provider: 'paystack',
        idempotencyKey: paymentIdempotencyKey,
        callbackUrl,
      });

      const paymentData = paymentRes.data;

      if (paymentMethod === 'CASH_ON_DELIVERY' || paymentMethod === 'CASH_IN_STORE') {
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/orders/${order._id}`);
        return;
      }

      if (paymentData?.authorizationUrl) {
        clearCart();
        window.location.href = paymentData.authorizationUrl;
      } else {
        throw new Error('No payment URL returned');
      }
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <>
      <SEO title="Checkout — Atomic Order" description="Complete your purchase." />
      <div className="bg-[var(--color-bg)] min-h-screen pt-8 pb-24">
        <div className="container max-w-2xl">
          {/* Progress Bar */}
          <div className="flex items-center justify-center gap-0 mb-10">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                    i <= stepIndex
                      ? 'text-[var(--color-text-heading)]'
                      : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  <div
                    className={`w-6 h-6 flex items-center justify-center text-[0.625rem] font-black ${
                      i <= stepIndex
                        ? 'bg-[var(--color-text-heading)] text-[var(--color-bg)]'
                        : 'border border-[var(--color-border)] text-[var(--color-text-muted)]'
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-8 sm:w-12 h-px ${
                      i < stepIndex ? 'bg-[var(--color-text-heading)]' : 'bg-[var(--color-border)]'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {step === 'shipping' && (
            <ShippingStep initialAddress={shippingAddress ?? undefined} onNext={handleShipping} />
          )}

          {step === 'payment' && (
            <PaymentStep
              initialMethod={paymentMethod ?? undefined}
              onNext={handlePayment}
              onBack={() => setStep('shipping')}
            />
          )}

          {step === 'review' && shippingAddress && paymentMethod && (
            <ReviewStep
              shippingAddress={shippingAddress}
              paymentMethod={paymentMethod}
              onPlaceOrder={handlePlaceOrder}
              onBack={() => setStep('payment')}
              isPlacing={isPlacing}
            />
          )}
        </div>
      </div>
    </>
  );
}
