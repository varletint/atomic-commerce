import { Truck, ShieldCheck, Headphones, RefreshCw } from 'lucide-react';

const TRUST_ITEMS = [
  { icon: Truck, label: 'FREE SHIPPING', sub: 'On orders over ₦25,000' },
  { icon: ShieldCheck, label: 'SECURE CHECKOUT', sub: '256-bit encryption' },
  { icon: Headphones, label: '24/7 SUPPORT', sub: 'Always here for you' },
  { icon: RefreshCw, label: 'EASY RETURNS', sub: '30-day guarantee' },
] as const;

export function TrustStrip() {
  return (
    <section className="trust-strip" id="trust-strip">
      <div className="trust-strip__inner container">
        {TRUST_ITEMS.map(({ icon: Icon, label, sub }) => (
          <div className="trust-strip__item" key={label}>
            <Icon size={24} className="trust-strip__icon" strokeWidth={1.5} />
            <div className="trust-strip__text">
              <span className="trust-strip__label">{label}</span>
              <span className="trust-strip__sub">{sub}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
