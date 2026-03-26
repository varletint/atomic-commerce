import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { ROUTES } from '@/config/routes';
import { formatCurrency } from '@/utils';
import { useCartStore } from '@/store/useCartStore';

// Components
import { ProductGallery } from '../components/ProductGallery';
import { VariantSelector } from '../components/VariantSelector';
import { QuantitySelector } from '../components/QuantitySelector';
import { ProductAccordion } from '../components/ProductAccordion';

// Mock Data / Hooks
// In a real app we'd use: const { data: product, isLoading } = useProduct(slug!);
import type { Product } from '@/types';
const MOCK_COLORS = [
  { name: 'Obsidian Black', hex: '#0a0a0a' },
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Slate Gray', hex: '#737373' },
];

const MOCK_PRODUCT: Product = {
  id: '2',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  name: 'Babban Riga',
  description:
    'Traditional elegance redefined. Hand-tailored from premium quality cotton, the Babban Riga features intricate embroidery and a relaxed, draped silhouette. Designed to offer both supreme comfort and undeniable presence for formal occasions. The attention to detail in the stitching makes every piece unique.',
  price: 99000.0,
  compareAtPrice: 105000.0,
  images: ['/images/home/7.jpg', '/images/home/6.jpg', '/images/home/category-apparel.png'],
  category: 'Kaftan',
  stock: 12,
  sku: 'KAF-001',
  slug: 'babban-riga',
  colors: MOCK_COLORS,
  sizes: ['S', 'M', 'L', 'XL'],
  material: 'Premium Cotton',
  weight: 850,
  tags: ['new-arrival', 'premium'],
  rating: 4.9,
  reviewCount: 42,
  variants: [],
};

export function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  // Load state
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  // Variant state
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Simulate fetching based on slug
    setIsLoading(true);
    const timer = setTimeout(() => {
      setProduct(MOCK_PRODUCT);
      if (MOCK_PRODUCT.colors?.[0]?.name) setSelectedColor(MOCK_PRODUCT.colors[0].name);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    if (product.sizes?.length && !selectedSize) {
      setError('Please select a size');
      return;
    }

    setError('');

    // In a real app, we'd add the specific variant:
    // addItem({ ...product, selectedVariant: { color: selectedColor, size: selectedSize } }, quantity);
    addItem(product, quantity);

    // Briefly show success or navigate to cart
    // navigate(ROUTES.CART);
    alert(`Added ${quantity}x ${product.name} to cart!`);
  };

  const hasDiscount = product?.compareAtPrice && product.compareAtPrice > product.price;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-text-heading)] animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8 text-[var(--color-text-muted)]">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link to={ROUTES.PRODUCTS} className="btn btn-primary">
          BACK TO PRODUCTS
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${product.name} — Atomic Order`}
        description={product.description.substring(0, 150)}
      />

      <div className="bg-[var(--color-bg)] min-h-screen pt-4 pb-24">
        <div className="container">
          {/* ── Breadcrumbs ── */}
          <nav className="flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mt-2 mb-8 md:mb-12 border-b border-[var(--color-border)] pb-4">
            <Link
              to={ROUTES.HOME}
              className="hover:text-[var(--color-text-heading)] transition-colors"
            >
              Home
            </Link>
            <ChevronRight size={14} />
            <Link
              to={ROUTES.PRODUCTS}
              className="hover:text-[var(--color-text-heading)] transition-colors"
            >
              Products
            </Link>
            <ChevronRight size={14} />
            <span className="text-[var(--color-text-heading)]">{product.category}</span>
            <ChevronRight size={14} />
            <span className="text-[var(--color-text-heading)] truncate max-w-[150px] sm:max-w-none">
              {product.name}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 xl:gap-20">
            {/* ── Left: Image Gallery ── */}
            <div>
              <ProductGallery images={product.images} productName={product.name} />
            </div>

            {/* ── Right: Product Info & Buy Box ── */}
            <div className="flex flex-col">
              {/* Badges */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-[0.625rem] font-extrabold uppercase tracking-[0.2em] bg-[var(--color-bg-muted)] text-[var(--color-text-heading)]"
                    >
                      {tag.replace('-', ' ')}
                    </span>
                  ))}
                  {hasDiscount && (
                    <span className="px-3 py-1 text-[0.625rem] font-extrabold uppercase tracking-[0.2em] bg-[var(--color-accent)] text-[var(--color-text-inverse)]">
                      SALE
                    </span>
                  )}
                </div>
              )}

              {/* Title & Reviews */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[var(--color-text-heading)] mb-4 leading-none">
                {product.name}
              </h1>

              {product.rating !== undefined && (
                <div className="flex items-center gap-2 mb-6 border-b border-[var(--color-border)] pb-6">
                  <div className="flex items-center gap-0.5 text-[var(--color-text-heading)]">
                    <Star size={16} className="fill-current" />
                  </div>
                  <span className="text-sm font-bold text-[var(--color-text-heading)] mt-0.5">
                    {product.rating.toFixed(1)}
                  </span>
                  {product.reviewCount !== undefined && (
                    <span className="text-sm text-[var(--color-text-muted)] mt-0.5 underline hover:text-[var(--color-text-heading)] cursor-pointer transition-colors">
                      {product.reviewCount} Reviews
                    </span>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="flex items-end gap-3 mb-8">
                <span className="text-3xl font-bold text-[var(--color-text-heading)] leading-none">
                  {formatCurrency(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-xl font-medium text-[var(--color-text-muted)] line-through pb-0.5">
                    {formatCurrency(product.compareAtPrice!)}
                  </span>
                )}
              </div>

              {/* Description Snippet */}
              <p className="text-base text-[var(--color-text)] leading-relaxed mb-10">
                {product.description}
              </p>

              {/* Variant Selectors */}
              <div className="mb-10 p-6 bg-[var(--color-bg-subtle)] border border-[var(--color-border)]">
                <VariantSelector
                  colors={product.colors}
                  selectedColor={selectedColor}
                  onColorSelect={(c) => setSelectedColor(c)}
                  sizes={product.sizes}
                  selectedSize={selectedSize}
                  onSizeSelect={(s) => {
                    setSelectedSize(s);
                    setError('');
                  }}
                />
              </div>

              {/* Buy Box */}
              <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <QuantitySelector
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                    maxQuantity={product.stock}
                  />

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 h-[52px] bg-[var(--color-accent)] text-[var(--color-text-inverse)]
                      text-sm font-black uppercase tracking-[0.15em] border border-[var(--color-accent)]
                      hover:bg-[var(--color-accent-hover)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>

                {/* Error message slot */}
                {error && (
                  <p className="text-sm font-bold text-[var(--color-error)] mt-2 bg-[rgba(239,68,68,0.1)] py-2 px-4 border-l-4 border-[var(--color-error)]">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  disabled={product.stock === 0}
                  className="w-full h-[52px] bg-[var(--color-bg)] text-[var(--color-text-heading)]
                    text-sm font-black uppercase tracking-[0.15em] border border-[var(--color-border-strong)]
                    hover:border-[var(--color-text-heading)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy It Now
                </button>
              </div>

              <div className="flex items-center gap-2 mb-10 text-xs text-[var(--color-text-muted)] tracking-wider">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {product.stock > 0 ? `IN STOCK — READY TO SHIP` : 'CURRENTLY OUT OF STOCK'}
              </div>

              {/* Details Accordion */}
              <ProductAccordion
                description={product.description}
                material={product.material}
                weight={product.weight}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
