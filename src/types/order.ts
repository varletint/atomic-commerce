import type { Address } from './user';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'FAILED';
export type PaymentMethod =
  | 'CARD'
  | 'BANK_TRANSFER'
  | 'WALLET'
  | 'USSD'
  | 'CASH_ON_DELIVERY'
  | 'CASH_IN_STORE';

export interface OrderItem {
  product: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  subtotal: number;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  _id: string;
  checkoutType: 'REGISTERED' | 'GUEST';
  user?: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  status: OrderStatus;
  idempotencyKey: string;
  shippingAddress: Address;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  order: string;
  user?: string;
  amount: number;
  currency: string;
  status: 'INITIATED' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'REFUND_INITIATED' | 'REFUNDED';
  paymentMethod: PaymentMethod;
  provider: string;
  providerRef?: string;
  idempotencyKey: string;
  failureReason?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessPaymentResponse {
  order: Order;
  transaction: Transaction;
  authorizationUrl: string;
}

export interface TrackingEvent {
  _id: string;
  orderId: string;
  status: OrderStatus;
  location?: string;
  description: string;
  timestamp: string;
}
