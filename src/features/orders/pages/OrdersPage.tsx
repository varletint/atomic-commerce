import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { OrderStatusPill } from '../components/OrderStatusPill';
import { formatCurrency } from '@/utils';

export function OrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useOrders(page, 20);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <div className="animate-pulse font-bold tracking-widest text-sm text-[var(--color-text-muted)]">
          LOADING ORDERS...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-12">
        <div className="p-4 border border-[var(--color-error)] bg-[var(--color-error-bg)] text-[var(--color-error)] text-sm font-semibold rounded-none">
          Failed to load orders. Please try again later.
        </div>
      </div>
    );
  }

  const orders = data?.orders || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="py-16 text-center border border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
          <p className="text-[var(--color-text-muted)] font-medium mb-4">
            You don't have any orders yet.
          </p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--color-border-subtle)]">
                <div>
                  <div className="text-xs text-[var(--color-text-muted)] font-bold mb-1 uppercase tracking-widest">
                    Order ID
                  </div>
                  <div className="font-mono text-sm">{order._id}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-muted)] font-bold mb-1 uppercase tracking-widest">
                    Date Placed
                  </div>
                  <div className="font-medium text-sm">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-muted)] font-bold mb-1 uppercase tracking-widest">
                    Total Amount
                  </div>
                  <div className="font-medium text-sm">{formatCurrency(order.totalAmount)}</div>
                </div>
                <div className="flex items-center">
                  <OrderStatusPill status={order.status} />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">
                    {order.items.length} item{order.items.length !== 1 && 's'}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-[var(--color-text-muted)]">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="bg-[var(--color-bg-muted)] px-2 py-1">
                        {item.quantity}x {item.productName}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="bg-[var(--color-bg-muted)] px-2 py-1">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                  <button
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="btn btn-secondary flex-1 md:flex-none py-2 px-4"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => navigate(`/orders/${order._id}?tracking=true`)}
                    className="btn btn-primary flex-1 md:flex-none py-2 px-4 whitespace-nowrap"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-secondary py-2 px-4"
              >
                Previous
              </button>
              <span className="text-sm font-bold font-mono">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-secondary py-2 px-4"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
