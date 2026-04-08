import { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useOrderDetails } from '../hooks/useOrders';
import { useOrderTracking } from '../hooks/useOrderTracking';
import { OrderStatusPill } from '../components/OrderStatusPill';
import { ROUTES } from '@/config/routes';
import { formatCurrency } from '@/utils';
import { ArrowLeft } from 'lucide-react';

const MAIN_STEPS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const showTracking = searchParams.get('tracking') === 'true';
  const navigate = useNavigate();

  const { data: order, isLoading: isOrderLoading, isError: isOrderError } = useOrderDetails(id!);
  const { data: trackingEvents, isLoading: isTrackingLoading } = useOrderTracking(id!);

  // Scroll to tracking section if requested
  useEffect(() => {
    if (showTracking && !isTrackingLoading && trackingEvents) {
      document.getElementById('tracking-timeline')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showTracking, isTrackingLoading, trackingEvents]);

  if (isOrderLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <div className="animate-pulse font-bold tracking-widest text-sm text-[var(--color-text-muted)]">
          LOADING ORDER DETAILS...
        </div>
      </div>
    );
  }

  if (isOrderError || !order) {
    return (
      <div className="container py-12">
        <div className="p-4 border border-[var(--color-error)] bg-[var(--color-error-bg)] text-[var(--color-error)] text-sm font-semibold rounded-none">
          Order not found.
        </div>
        <button onClick={() => navigate(ROUTES.HOME)} className="mt-4 btn btn-secondary">
          Back to Home
        </button>
      </div>
    );
  }

  let activeIndex = MAIN_STEPS.indexOf(order.status);

  if (activeIndex === -1) {
    if (order.status === 'CANCELLED' || order.status === 'FAILED') {
      const lastGood = order.statusHistory
        .map((h) => h.status)
        .reverse()
        .find((s) => MAIN_STEPS.includes(s));
      activeIndex = lastGood ? MAIN_STEPS.indexOf(lastGood) : 0;
    }
  }

  return (
    <div className="container py-1 max-w-5xl">
      <button onClick={() => navigate('/orders')} className=" ">
        <ArrowLeft />
      </button>
      <div className="mb-8 mt-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-3xl font-black uppercase tracking-tight mb-2">
            Order Details
          </h2>
          <p className="font-mono text-sm text-[var(--color-text-muted)]">ID: {order._id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Tracking Stepper */}
          <section className="border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6">Status</h2>

            {order.status === 'CANCELLED' || order.status === 'FAILED' ? (
              <div className="p-4 border border-[var(--color-error)] bg-[var(--color-error-bg)]">
                <p className="font-bold text-[var(--color-error)] flex items-center gap-2">
                  <span className="text-xl">!</span> ORDER {order.status}
                </p>
                <p className="text-sm text-[var(--color-error)] mt-1 opacity-80">
                  {order.statusHistory[order.statusHistory.length - 1]?.note ||
                    'Processing stopped'}
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[var(--color-border)] -z-10" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-black -z-10 transition-all duration-500"
                  style={{
                    width: `${(Math.max(0, activeIndex) / (MAIN_STEPS.length - 1)) * 100}%`,
                  }}
                />

                <div className="flex justify-between relative z-10">
                  {MAIN_STEPS.map((step, index) => {
                    const isCompleted = index <= activeIndex;
                    const isCurrent = index === activeIndex && order.status !== 'DELIVERED';
                    return (
                      <div key={step} className="flex flex-col items-center gap-2">
                        <div
                          className={`w-6 h-6 border-2 flex items-center justify-center bg-[var(--color-bg)] transition-colors
                            ${
                              isCompleted ? 'border-black bg-black' : 'border-[var(--color-border)]'
                            }
                            ${isCurrent ? 'ring-4 ring-black/20' : ''}
                          `}
                        >
                          {isCompleted && <span className="w-2 h-2 bg-white block" />}
                        </div>
                        <span
                          className={`text-[0.65rem] md:text-xs font-bold uppercase tracking-widest transition-colors ${
                            isCompleted ? 'text-black' : 'text-[var(--color-text-muted)]'
                          }`}
                        >
                          {step.slice(0, 3)}...
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Granular Tracking Timeline */}
          <section
            id="tracking-timeline"
            className="border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm"
          >
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6">Tracking Timeline</h2>

            {isTrackingLoading ? (
              <div className="animate-pulse text-sm text-[var(--color-text-muted)]">
                Loading timeline...
              </div>
            ) : trackingEvents && trackingEvents.length > 0 ? (
              <div className="relative border-l border-[var(--color-border-strong)] ml-3 space-y-8 pb-4">
                {trackingEvents.map((event, idx) => (
                  <div key={event._id} className="relative pl-6">
                    <div
                      className={`absolute left-0 -translate-x-[5px] top-1 w-[9px] h-[9px] border border-black 
                        ${idx === 0 ? 'bg-black' : 'bg-[var(--color-bg)]'}
                      `}
                    />
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                      <div className="font-bold text-sm tracking-wide">{event.description}</div>
                      <div className="text-xs text-[var(--color-text-muted)] font-mono whitespace-nowrap">
                        {new Date(event.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    {event.location && (
                      <div className="text-xs text-[var(--color-text-muted)] mt-1 uppercase tracking-widest">
                        📍 {event.location}
                      </div>
                    )}
                    <div className="mt-2">
                      <OrderStatusPill status={event.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--color-text-muted)] border-l-2 pl-4 py-2 border-[var(--color-border)]">
                No tracking events logged yet. Check back soon.
              </p>
            )}
          </section>
        </div>

        {/* Sidebar: Order Summary */}
        <div className="space-y-8">
          <section className="border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-[var(--color-border)] pb-2">
              Order Summary
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.product}
                  className="flex justify-between items-start gap-4 text-sm border-b border-[var(--color-border-subtle)] pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <p className="font-bold">{item.productName}</p>
                    <p className="text-[var(--color-text-muted)] mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-mono pt-1 text-right">
                    NGN {(item.subtotal / 100).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--color-border-strong)] space-y-2 text-sm font-medium">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>
                  {order.deliveryFee === 0
                    ? 'FREE'
                    : `NGN ${(order.deliveryFee / 100).toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 mt-2 border-t border-[var(--color-border)] font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount + order.deliveryFee)}</span>
              </div>
            </div>
          </section>

          <section className="border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4">
              Shipping Destination
            </h2>
            <div className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              <p className="font-medium text-black mb-1">
                {order.checkoutType === 'GUEST' ? 'Guest Customer' : 'Registered Customer'}
              </p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zip}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
