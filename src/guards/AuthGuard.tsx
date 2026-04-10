import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/config';
import { useAuth } from '@/features/auth';
// import { useAuthStore } from '@/store';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  // const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
