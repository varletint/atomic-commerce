import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { CheckEmailPage } from '@/features/auth/pages/CheckEmailPage';
import { VerifyEmailPage } from '@/features/auth/pages/VerifyEmailPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { HomePage } from '@/features/home/pages/HomePage';
import { ProductsPage } from '@/features/products/pages/ProductsPage';
import { ProductDetailsPage } from '@/features/products/pages/ProductDetailsPage';
import { CreateProductPage } from '@/features/products/pages/CreateProductPage';
import { CartPage } from '@/features/cart/pages/CartPage';
import { ProfilePage } from '@/features/account/pages/ProfilePage';
import { CheckoutPage } from '@/features/checkout/pages/CheckoutPage';
import { PaymentCallbackPage } from '@/features/checkout/pages/PaymentCallbackPage';
import { OrdersPage } from '@/features/orders/pages/OrdersPage';
import { OrderDetailPage } from '@/features/orders/pages/OrderDetailPage';
import { AuthGuard } from '@/guards/AuthGuard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { useAuth } from '@/features/auth/hooks/useAuth';
import './App.css';

function GuestGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="animate-pulse text-[var(--color-text-muted)] text-sm font-bold uppercase tracking-widest">
          Loading...
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || ROUTES.PROFILE} replace />;
  }

  return <>{children}</>;
}

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="animate-pulse text-[var(--color-text-muted)] text-sm font-bold uppercase tracking-widest">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <SEO
        title="Atomic Order"
        description="Seamless order management platform for all your purchasing needs."
      />
      <Navbar />
      <main className="page-content">
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
          <Route
            path={ROUTES.CREATE_PRODUCT}
            element={
              // <AuthGuard>
              <CreateProductPage />
              // </AuthGuard>
            }
          />
          <Route path="/products/:slug" element={<ProductDetailsPage />} />
          <Route path={ROUTES.CART} element={<CartPage />} />
          <Route
            path={ROUTES.LOGIN}
            element={
              <GuestGuard>
                <LoginPage />
              </GuestGuard>
            }
          />
          <Route
            path={ROUTES.REGISTER}
            element={
              <GuestGuard>
                <RegisterPage />
              </GuestGuard>
            }
          />
          <Route path={ROUTES.CHECK_EMAIL} element={<CheckEmailPage />} />
          <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
          <Route
            path={ROUTES.FORGOT_PASSWORD}
            element={
              <GuestGuard>
                <ForgotPasswordPage />
              </GuestGuard>
            }
          />
          <Route
            path={ROUTES.RESET_PASSWORD}
            element={
              <GuestGuard>
                <ResetPasswordPage />
              </GuestGuard>
            }
          />
          <Route
            path={ROUTES.PROFILE}
            element={
              <AuthGuard>
                <ProfilePage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.ORDERS}
            element={
              <AuthGuard>
                <OrdersPage />
              </AuthGuard>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <AuthGuard>
                <OrderDetailPage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.CHECKOUT}
            element={
              <AuthGuard>
                <CheckoutPage />
              </AuthGuard>
            }
          />
          <Route
            path="/checkout/verify"
            element={
              <AuthGuard>
                <PaymentCallbackPage />
              </AuthGuard>
            }
          />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
