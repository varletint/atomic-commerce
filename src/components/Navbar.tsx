import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  User,
  LogOut,
  Package,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { useAuthStore, useCartStore, useUIStore, useThemeStore } from '@/store';

/* ── Route check: hide navbar on auth pages ─────── */
const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.FORGOT_PASSWORD];

export function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const itemCount = useCartStore((s) => s.getItemCount());
  const { isMobileMenuOpen, toggleMobileMenu, closeAll } = useUIStore();
  const { theme, toggleTheme } = useThemeStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hide on auth pages

  // Close mobile menu on route change
  useEffect(() => {
    closeAll();
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  if (AUTH_ROUTES.includes(location.pathname as any)) return null;

  const isDark = theme === 'dark';

  const initial = user?.name?.charAt(0).toUpperCase() ?? '?';

  return (
    <>
      <header className="navbar" id="main-navbar">
        <div className="navbar__inner container">
          {/* ── Logo ──────────────────────────────── */}
          <Link to={ROUTES.HOME} className="navbar__logo">
            ATOMIC ORDER
          </Link>

          {/* ── Desktop Links ─────────────────────── */}
          <nav className="navbar__links" aria-label="Main navigation">
            <NavLink
              to={ROUTES.PRODUCTS}
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
            >
              Products
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to={ROUTES.ORDERS}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
              >
                Orders
              </NavLink>
            )}
          </nav>

          {/* ── Desktop Actions ───────────────────── */}
          <div className="navbar__actions">
            {/* Search */}
            <button
              type="button"
              className="navbar__icon-btn"
              aria-label="Search"
              onClick={() => useUIStore.getState().toggleSearch()}
            >
              <Search size={20} />
            </button>

            {/* Cart */}
            <Link to={ROUTES.CART} className="navbar__icon-btn navbar__cart" aria-label="Cart">
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="navbar__badge">{itemCount > 99 ? '99+' : itemCount}</span>
              )}
            </Link>

            {/* Theme toggle */}
            <button
              type="button"
              className="navbar__icon-btn"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="navbar__user" ref={dropdownRef}>
                <button
                  type="button"
                  className="navbar__avatar-btn"
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-expanded={dropdownOpen}
                  aria-label="User menu"
                >
                  <span className="navbar__avatar">{initial}</span>
                  <ChevronDown
                    size={14}
                    className={`navbar__chevron ${dropdownOpen ? 'navbar__chevron--open' : ''}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="navbar__dropdown animate-fadeIn">
                    <div className="navbar__dropdown-header">
                      <span className="navbar__dropdown-name">{user?.name}</span>
                      <span className="navbar__dropdown-email">{user?.email}</span>
                    </div>
                    <div className="navbar__dropdown-divider" />
                    <Link
                      to={ROUTES.PROFILE}
                      className="navbar__dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User size={16} /> Profile
                    </Link>
                    <Link
                      to={ROUTES.ORDERS}
                      className="navbar__dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Package size={16} /> My Orders
                    </Link>
                    <div className="navbar__dropdown-divider" />
                    <button
                      type="button"
                      className="navbar__dropdown-item navbar__dropdown-item--danger"
                      onClick={() => {
                        setDropdownOpen(false);
                        useAuthStore.getState().clearAuth();
                      }}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="navbar__auth-links">
                <Link to={ROUTES.LOGIN} className="navbar__auth-link">
                  LOGIN
                </Link>
                <Link to={ROUTES.REGISTER} className="navbar__auth-link navbar__auth-link--primary">
                  REGISTER
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile Toggle ─────────────────────── */}
          <button
            type="button"
            className="navbar__mobile-toggle"
            aria-label="Toggle menu"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* ── Mobile Menu ─────────────────────────── */}
        <div
          className={`navbar__mobile-menu ${isMobileMenuOpen ? 'navbar__mobile-menu--open' : ''}`}
        >
          <nav className="navbar__mobile-nav">
            <NavLink
              to={ROUTES.PRODUCTS}
              className={({ isActive }) =>
                `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
              }
            >
              Products
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to={ROUTES.ORDERS}
                className={({ isActive }) =>
                  `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
                }
              >
                Orders
              </NavLink>
            )}
            <Link to={ROUTES.CART} className="navbar__mobile-link">
              Cart {itemCount > 0 && <span className="navbar__badge">{itemCount}</span>}
            </Link>
          </nav>

          <div className="navbar__mobile-divider" />

          <div className="navbar__mobile-bottom">
            {isAuthenticated ? (
              <>
                <Link to={ROUTES.PROFILE} className="navbar__mobile-link">
                  Profile
                </Link>
                <button
                  type="button"
                  className="navbar__mobile-link navbar__mobile-link--danger"
                  onClick={() => {
                    closeAll();
                    useAuthStore.getState().clearAuth();
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className="navbar__mobile-link">
                  Login
                </Link>
                <Link to={ROUTES.REGISTER} className="navbar__mobile-link">
                  Register
                </Link>
              </>
            )}
            <button type="button" className="navbar__mobile-link" onClick={toggleTheme}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div className="navbar__overlay" onClick={closeAll} aria-hidden="true" />
      )}
    </>
  );
}
