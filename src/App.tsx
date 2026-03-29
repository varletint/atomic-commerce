import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { CheckEmailPage } from '@/features/auth/pages/CheckEmailPage';
import { VerifyEmailPage } from '@/features/auth/pages/VerifyEmailPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { HomePage } from '@/features/home/pages/HomePage';
import { ProductsPage } from '@/features/products/pages/ProductsPage';
import { ProductDetailsPage } from '@/features/products/pages/ProductDetailsPage';
import { CartPage } from '@/features/cart/pages/CartPage';
import { ProfilePage } from '@/features/account/pages/ProfilePage';
import { AuthGuard } from '@/guards/AuthGuard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import './App.css';

function App() {
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
          <Route path="/products/:slug" element={<ProductDetailsPage />} />
          <Route path={ROUTES.CART} element={<CartPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.CHECK_EMAIL} element={<CheckEmailPage />} />
          <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
          <Route
            path={ROUTES.PROFILE}
            element={
              <AuthGuard>
                <ProfilePage />
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
