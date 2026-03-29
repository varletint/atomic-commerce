import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/Button';
import { useAuth } from '../hooks/useAuth';

type VerifyState = 'loading' | 'success' | 'error';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmailAsync } = useAuth();

  const token = searchParams.get('token');

  const [state, setState] = useState<VerifyState>(token ? 'loading' : 'error');
  const [errorMsg, setErrorMsg] = useState(token ? '' : 'No verification token found in the URL.');

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    verifyEmailAsync(token)
      .then(() => {
        if (!cancelled) setState('success');
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState('error');
          const message =
            (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
            'This verification link is invalid or has expired.';
          setErrorMsg(message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token, verifyEmailAsync]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SEO title="Verify Email" description="Verify your email address." />

      <div className="w-full max-w-md text-center">
        {/* Loading */}
        {state === 'loading' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <Loader2 className="w-16 h-16 text-gray-400 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Verifying your email…</h1>
            <p className="text-gray-500">Please wait while we confirm your email address.</p>
          </div>
        )}

        {/* Success */}
        {state === 'success' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Email Verified!</h1>
            <p className="text-gray-500">
              Your email has been confirmed and your account is now active. You're all set to start
              shopping.
            </p>
            <Button
              className="w-full mt-4"
              onClick={() => navigate(ROUTES.HOME, { replace: true })}
            >
              Continue to Shop
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Error */}
        {state === 'error' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Verification Failed</h1>
            <p className="text-gray-500">{errorMsg}</p>
            <div className="flex flex-col gap-3 mt-4">
              <Button onClick={() => navigate(ROUTES.LOGIN)} className="w-full">
                Go to Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
