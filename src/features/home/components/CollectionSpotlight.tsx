import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/config/routes';

export function CollectionSpotlight() {
  return (
    <section className="spotlight" id="collection-spotlight">
      <div className="spotlight__inner">
        {/* ── Image ──────────────────────────────── */}
        <div className="spotlight__image-wrapper">
          <img
            src="/images/home/2.png"
            alt="New collection preview"
            className="spotlight__image"
            loading="lazy"
          />
        </div>

        {/* ── Content ────────────────────────────── */}
        <div className="spotlight__content">
          <span className="spotlight__label">NEW COLLECTION</span>
          <h2 className="spotlight__title">
            THE MONOCHROME
            <br />
            EDIT
          </h2>
          <p className="spotlight__text">
            A tightly edited capsule of essential pieces. Each item designed to stand alone or pair
            seamlessly — built for those who value intention over excess.
          </p>
          <Link to={ROUTES.PRODUCTS} className="btn btn-primary spotlight__cta">
            EXPLORE COLLECTION
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
