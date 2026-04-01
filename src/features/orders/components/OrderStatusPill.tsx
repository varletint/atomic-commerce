import type { OrderStatus } from '@/types/order';

interface OrderStatusPillProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusPill({ status, className = '' }: OrderStatusPillProps) {
  const getStatusStyles = (s: OrderStatus) => {
    switch (s) {
      case 'PENDING':
        return 'bg-[var(--gray-100)] text-[var(--gray-700)] border-[var(--gray-300)]';
      case 'CONFIRMED':
        return 'bg-[var(--color-info-bg)] text-[var(--color-info)] border-[var(--color-info)]';
      case 'SHIPPED':
        return 'bg-purple-50 text-purple-700 border-purple-300';
      case 'DELIVERED':
        return 'bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success)]';
      case 'CANCELLED':
      case 'FAILED':
        return 'bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error)]';
      default:
        return 'bg-[var(--gray-100)] text-[var(--gray-700)] border-[var(--gray-300)]';
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 text-xs font-bold uppercase tracking-widest border rounded-none ${getStatusStyles(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
}
