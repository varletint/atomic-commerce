import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/config/routes';

export function HeroSection() {
  return (
    <section className="hero" id="hero-section">
      {/* ── Full-width Background Image ─────────── */}
      <div className="hero__image-wrapper">
        <img
          src="/images/home/1.png"
          alt="Premium product showcase"
          className="hero__image"
          loading="eager"
        />
        <div className="hero__overlay" aria-hidden="true" />
      </div>

      {/* ── Text Overlay ────────────────────────── */}
      <div className="hero__content container">
        <div className="hero__text">
          <span className="hero__label">NEW SEASON 2026</span>
          <h1 className="hero__heading">
            ENGINEERED
            <br />
            FOR THE <span className="hero__heading--accent">BOLD</span>
          </h1>
          <p className="hero__sub">
            Premium products designed with precision. No compromises, no noise — just what matters.
          </p>
          <div className="hero__actions">
            <Link to={ROUTES.PRODUCTS} className="btn btn-primary hero__cta">
              SHOP NOW
              <ArrowRight size={18} />
            </Link>
            <Link to={ROUTES.PRODUCTS} className="btn btn-secondary hero__cta-secondary">
              VIEW LOOKBOOK
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
