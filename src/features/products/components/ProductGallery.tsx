import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images?.length) {
    return (
      <div className="w-full aspect-[3/4] bg-[var(--color-bg-muted)] flex items-center justify-center">
        <span className="text-[var(--color-text-muted)] text-sm uppercase tracking-widest font-bold">
          No Image
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 relative">
      {/* ── Thumbnails (Desktop: Left Vertical, Mobile: Bottom Horizontal) ── */}
      {images.length > 1 && (
        <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-20 shrink-0 scrollbar-hide py-1 md:py-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative w-16 h-20 md:w-20 md:h-[100px] shrink-0 overflow-hidden cursor-pointer outline-none transition-all duration-200
                ${
                  activeIndex === idx
                    ? 'border-2 border-[var(--color-accent)] opacity-100'
                    : 'border border-[var(--color-border)] opacity-60 hover:opacity-100'
                }`}
              aria-label={`View image ${idx + 1}`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Main Image (Sticky on Desktop) ── */}
      <div className="order-1 md:order-2 flex-1 relative bg-[var(--color-bg-subtle)] overflow-hidden lg:sticky lg:top-24">
        {/* Aspect ratio container matching standard fashion e-com (3:4) */}
        <div className="w-full aspect-[3/4] relative">
          <img
            src={images[activeIndex]}
            alt={`${productName} view ${activeIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
