import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { ROUTES } from '@/config/routes';
import { orderApi } from '../api/orderApi';
import { Button } from '@/components/ui/Button';

type VerifyState = 'loading' | 'success' | 'failed';

export function PaymentCallbackPage() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  const reference = params.get('reference');
  const [state, setState] = useState<VerifyState>('loading');
  const [orderIdResult, setOrderIdResult] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || !reference) {
      setState('failed');
      return;
    }

    orderApi
      .verifyPayment(orderId, reference)
      .then(({ data }) => {
        const order = data.data?.order;
        if (order && (order.status === 'CONFIRMED' || order.status === 'PENDING')) {
          setState('success');
          setOrderIdResult(order._id);
        } else {
          setState('failed');
        }
      })
      .catch(() => {
        setState('failed');
      });
  }, [orderId, reference]);

  return (
    <>
      <SEO title="Payment Verification — Atomic Order" description="Verifying your payment." />
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4">
        <div className="w-full max-w-md text-center space-y-6">
          {state === 'loading' && (
            <>
              <Loader2 size={48} className="animate-spin mx-auto text-[var(--color-text-muted)]" />
              <h2 className="text-xl font-black uppercase tracking-widest text-[var(--color-text-heading)]">
                Verifying Payment
              </h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Please wait while we confirm your transaction...
              </p>
            </>
          )}

          {state === 'success' && (
            <>
              <div className="w-20 h-20 mx-auto bg-green-50 flex items-center justify-center">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-widest text-[var(--color-text-heading)]">
                Order Confirmed!
              </h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Your payment was successful. We'll start processing your order right away.
              </p>
              <div className="flex flex-col gap-3 pt-4">
                {orderIdResult && (
                  <Link to={ROUTES.ORDER_DETAIL(orderIdResult)}>
                    <Button className="w-full">VIEW ORDER</Button>
                  </Link>
                )}
                <Link to={ROUTES.PRODUCTS}>
                  <Button variant="secondary" className="w-full">
                    CONTINUE SHOPPING
                  </Button>
                </Link>
              </div>
            </>
          )}

          {state === 'failed' && (
            <>
              <div className="w-20 h-20 mx-auto bg-red-50 flex items-center justify-center">
                <XCircle size={40} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-widest text-[var(--color-text-heading)]">
                Payment Failed
              </h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Something went wrong with your payment. Your cart items are safe — you can try
                again.
              </p>
              <div className="flex flex-col gap-3 pt-4">
                <Link to={ROUTES.CART}>
                  <Button className="w-full">BACK TO CART</Button>
                </Link>
                <Link to={ROUTES.PRODUCTS}>
                  <Button variant="secondary" className="w-full">
                    CONTINUE SHOPPING
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
