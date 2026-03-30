import { useState } from 'react';
import { CreditCard, Building2, Wallet, Hash, Truck, Store } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { PaymentMethod } from '@/types/order';

const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'CARD',
    label: 'Card',
    description: 'Visa, Mastercard, Verve',
    icon: <CreditCard size={20} />,
  },
  {
    id: 'BANK_TRANSFER',
    label: 'Bank Transfer',
    description: 'Direct bank payment',
    icon: <Building2 size={20} />,
  },
  { id: 'WALLET', label: 'Wallet', description: 'Opay, PalmPay, etc.', icon: <Wallet size={20} /> },
  { id: 'USSD', label: 'USSD', description: 'Pay via USSD code', icon: <Hash size={20} /> },
  {
    id: 'CASH_ON_DELIVERY',
    label: 'Cash on Delivery',
    description: 'Pay when it arrives',
    icon: <Truck size={20} />,
  },
  {
    id: 'CASH_IN_STORE',
    label: 'Pay in Store',
    description: 'Pay at pickup location',
    icon: <Store size={20} />,
  },
];

interface PaymentStepProps {
  initialMethod?: PaymentMethod;
  onNext: (method: PaymentMethod) => void;
  onBack: () => void;
}

export function PaymentStep({ initialMethod, onNext, onBack }: PaymentStepProps) {
  const [selected, setSelected] = useState<PaymentMethod | null>(initialMethod ?? null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black uppercase tracking-widest text-[var(--color-text-heading)]">
          Payment Method
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Choose how you'd like to pay.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PAYMENT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setSelected(opt.id)}
            className={`flex items-center gap-4 p-4 border text-left transition-all cursor-pointer ${
              selected === opt.id
                ? 'border-[var(--color-text-heading)] bg-[var(--color-text-heading)] text-[var(--color-bg)]'
                : 'border-[var(--color-border)] hover:border-[var(--color-text-heading)]'
            }`}
          >
            <div className="shrink-0">{opt.icon}</div>
            <div>
              <span className="block text-sm font-bold uppercase tracking-wider">{opt.label}</span>
              <span
                className={`block text-xs mt-0.5 ${
                  selected === opt.id ? 'opacity-70' : 'text-[var(--color-text-muted)]'
                }`}
              >
                {opt.description}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onBack} className="flex-1">
          BACK
        </Button>
        <Button
          type="button"
          onClick={() => selected && onNext(selected)}
          disabled={!selected}
          className="flex-1"
        >
          REVIEW ORDER
        </Button>
      </div>
    </div>
  );
}
