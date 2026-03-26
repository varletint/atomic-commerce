import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

const FOOTER_LINKS = {
  Shop: [
    { label: 'All Products', to: ROUTES.PRODUCTS },
    { label: 'Electronics', to: `${ROUTES.PRODUCTS}?category=electronics` },
    { label: 'Accessories', to: `${ROUTES.PRODUCTS}?category=accessories` },
    { label: 'Apparel', to: `${ROUTES.PRODUCTS}?category=apparel` },
  ],
  Company: [
    { label: 'About Us', to: '#' },
    { label: 'Careers', to: '#' },
    { label: 'Press', to: '#' },
  ],
  Support: [
    { label: 'Contact Us', to: '#' },
    { label: 'FAQ', to: '#' },
    { label: 'Shipping & Returns', to: '#' },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" id="site-footer">
      <div className="site-footer__inner container">
        {/* ── Brand Column ─────────────────────── */}
        <div className="site-footer__brand">
          <Link to={ROUTES.HOME} className="site-footer__logo">
            ATOMIC ORDER
          </Link>
          <p className="site-footer__tagline">
            Engineered for the bold.
          </p>
        </div>

        {/* ── Link Columns ─────────────────────── */}
        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div className="site-footer__col" key={heading}>
            <h4 className="site-footer__heading">{heading}</h4>
            <ul className="site-footer__list">
              {links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="site-footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Bottom Bar ──────────────────────────── */}
      <div className="site-footer__bottom">
        <div className="site-footer__bottom-inner container">
          <span className="site-footer__copy">
            © {year} Atomic Order. All rights reserved.
          </span>
          <div className="site-footer__legal">
            <Link to="#" className="site-footer__legal-link">Privacy Policy</Link>
            <Link to="#" className="site-footer__legal-link">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
