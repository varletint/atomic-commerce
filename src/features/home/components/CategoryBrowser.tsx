import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/config/routes';

const CATEGORIES = [
  {
    name: 'Electronics',
    slug: 'electronics',
    image: '/images/home/category-electronics.png',
    count: 24,
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: '/images/home/category-accessories.png',
    count: 36,
  },
  {
    name: 'Apparel',
    slug: 'apparel',
    image: '/images/home/category-apparel.png',
    count: 18,
  },
] as const;

export function CategoryBrowser() {
  return (
    <section className="categories" id="category-browser">
      <div className="categories__inner container">
        <div className="categories__header">
          <span className="categories__label">BROWSE BY</span>
          <h2 className="categories__title">SHOP CATEGORIES</h2>
        </div>

        <div className="categories__grid">
          {CATEGORIES.map((cat) => (
            <Link
              to={`${ROUTES.PRODUCTS}?category=${cat.slug}`}
              className="cat-tile"
              key={cat.slug}
              id={`cat-tile-${cat.slug}`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="cat-tile__image"
                loading="lazy"
              />
              <div className="cat-tile__overlay" />
              <div className="cat-tile__content">
                <h3 className="cat-tile__name">{cat.name}</h3>
                <span className="cat-tile__count">{cat.count} Products</span>
                <span className="cat-tile__arrow">
                  <ArrowRight size={20} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
