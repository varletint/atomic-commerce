import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { SEO } from '@/components/SEO';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)]">
      <SEO title="Login — Atomic Order" description="Sign in to your Atomic Order account." />

      <div className="w-full max-w-4xl bg-white md:p-12 relative">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-2 tracking-tight uppercase text-[var(--color-text-heading)]">
            Welcome Back
          </h1>
          <p className="text-[var(--color-text-muted)] font-medium">
            Sign in to access your orders, saved items, and profile.
          </p>
        </div>

        <LoginForm />

        <div className="mt-12 text-center text-sm text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-8">
          Don't have an account?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="text-[var(--color-text-heading)] font-bold uppercase tracking-widest hover:text-[var(--color-accent)] transition-colors ml-1"
          >
            Create One
          </Link>
        </div>
      </div>
    </div>
  );
}
