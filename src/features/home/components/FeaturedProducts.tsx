import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { formatCurrency } from '@/utils';

/* ── Mock featured products (replace with API call later) ── */
const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'Precision Chronograph',
    price: 99549.0,
    compareAtPrice: 105900.0,
    category: 'Accessories',
    image: '/images/home/category-accessories.png',
    slug: 'precision-chronograph',
  },
  {
    id: '2',
    name: 'Babban Riga',
    price: 99000.0,
    compareAtPrice: 105000.0,
    category: 'Kaftan',
    image: '/images/home/7.jpg',
    slug: 'babban-riga',
  },
  {
    id: '3',
    name: 'Essential Crew Tee',
    price: 25788.0,
    compareAtPrice: 75.0,
    category: 'Apparel',
    image: '/images/home/category-apparel.png',
    slug: 'essential-crew-tee',
  },
  {
    id: '4',
    name: 'Qube',
    price: 50999.0,
    category: 'Hulla',
    image: '/images/home/6.jpg',
    slug: 'matte-leather-folio',
  },
];

export function FeaturedProducts() {
  return (
    <section className="featured" id="featured-products">
      <div className="featured__inner container">
        {/* ── Header ─────────────────────────────── */}
        <div className="featured__header">
          <div>
            <span className="featured__label">HAND-PICKED</span>
            <h2 className="featured__title">CURATED FOR YOU</h2>
          </div>
          <Link to={ROUTES.PRODUCTS} className="featured__view-all">
            VIEW ALL
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* ── Product Grid (desktop) / List (mobile) ── */}
        <div className="featured__grid">
          {FEATURED_PRODUCTS.map((product) => (
            <article className="f-card" key={product.id} id={`f-card-${product.id}`}>
              {/* Image */}
              <div className="f-card__image-wrapper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="f-card__image"
                  loading="lazy"
                />
                {product.compareAtPrice && <span className="f-card__badge">SALE</span>}
                <button
                  type="button"
                  className="f-card__cart-btn"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingBag size={18} />
                </button>
              </div>

              {/* Info */}
              <div className="f-card__info">
                <span className="f-card__category">{product.category}</span>
                <h3 className="f-card__name">{product.name}</h3>
                <div className="f-card__prices">
                  <span className="f-card__price">{formatCurrency(product.price)}</span>
                  {product.compareAtPrice && (
                    <span className="f-card__compare">
                      {formatCurrency(product.compareAtPrice)}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
