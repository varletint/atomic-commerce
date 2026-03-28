import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  content: string | React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ title, content, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="border-b border-[var(--color-border)] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left cursor-pointer outline-none group"
        aria-expanded={isOpen}
      >
        <span className="text-[0.8125rem] font-bold uppercase tracking-[0.15em] text-[var(--color-text-heading)] group-hover:text-[var(--color-accent)] transition-colors">
          {title}
        </span>
        {isOpen ? (
          <ChevronUp
            size={16}
            className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors"
          />
        ) : (
          <ChevronDown
            size={16}
            className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors"
          />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0 pb-0'
        }`}
      >
        <div className="text-sm text-[var(--color-text)] leading-relaxed space-y-4">
          {typeof content === 'string' ? <p>{content}</p> : content}
        </div>
      </div>
    </div>
  );
}

interface ProductAccordionProps {
  description: string;
  material?: string;
  weight?: number;
  weightUnit?: string;
  careInstructions?: string;
}

export function ProductAccordion({
  description,
  material,
  weight,
  weightUnit = 'g',
  careInstructions,
}: ProductAccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>('details');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="border-t border-[var(--color-border)] mt-12 bg-transparent">
      <AccordionItem
        title="Product Details"
        isOpen={openSection === 'details'}
        onToggle={() => toggleSection('details')}
        content={description}
      />

      {(material || weight || careInstructions) && (
        <AccordionItem
          title="Materials & Care"
          isOpen={openSection === 'materials'}
          onToggle={() => toggleSection('materials')}
          content={
            <ul className="list-disc pl-5 space-y-2 text-[var(--color-text-muted)]">
              {material && (
                <li>
                  <strong className="text-[var(--color-text-heading)] font-semibold">
                    Material:
                  </strong>{' '}
                  {material}
                </li>
              )}
              {weight && (
                <li>
                  <strong className="text-[var(--color-text-heading)] font-semibold">
                    Weight:
                  </strong>{' '}
                  {weight}
                  {weightUnit}
                </li>
              )}
              {careInstructions ? (
                <li>
                  <strong className="text-[var(--color-text-heading)] font-semibold">Care:</strong>{' '}
                  {careInstructions}
                </li>
              ) : (
                <>
                  <li>Dry clean only.</li>
                  <li>Do not bleach.</li>
                </>
              )}
            </ul>
          }
        />
      )}

      <AccordionItem
        title="Shipping & Returns"
        isOpen={openSection === 'shipping'}
        onToggle={() => toggleSection('shipping')}
        content={
          <div className="space-y-3">
            <p>
              <strong className="text-[var(--color-text-heading)] font-semibold">
                Free Standard Shipping:
              </strong>{' '}
              On all orders over ₦25,000. Delivery within 3-5 business days.
            </p>
            <p>
              <strong className="text-[var(--color-text-heading)] font-semibold">
                Express Shipping:
              </strong>{' '}
              Available at checkout. Delivery within 1-2 business days.
            </p>
            <p>
              <strong className="text-[var(--color-text-heading)] font-semibold">Returns:</strong>{' '}
              We accept returns within 30 days of delivery. Items must be in original condition with
              tags attached.
            </p>
          </div>
        }
      />
    </div>
  );
}
