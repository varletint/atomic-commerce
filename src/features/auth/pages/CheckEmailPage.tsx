import { useLocation, Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { ROUTES } from '@/config/routes';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export function CheckEmailPage() {
  const location = useLocation();
  const email = (location.state as { email?: string })?.email;
  const { resendVerification, isResendingVerification } = useAuth();

  const handleResend = () => {
    if (!email) {
      toast.error('No email address available. Please register again.');
      return;
    }

    resendVerification(email, {
      onSuccess: () => toast.success('Verification email resent! Check your inbox.'),
      onError: (err: any) =>
        toast.error(err?.response?.data?.error || 'Failed to resend. Please try again.'),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SEO
        title="Check Your Email"
        description="A verification link has been sent to your email."
      />

      <div className="w-full max-w-md text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
            <Mail className="w-12 h-12 text-gray-700" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
          <p className="text-gray-500 leading-relaxed">
            We've sent a verification link to
            {email ? (
              <>
                <br />
                <span className="font-semibold text-black">{email}</span>
              </>
            ) : (
              ' your email address'
            )}
            . Click the link in the email to activate your account.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 border border-gray-200 p-4 text-left text-sm text-gray-600 space-y-2">
          <p className="font-semibold text-gray-800">Didn't receive it?</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Check your spam / junk folder</li>
            <li>Make sure you entered the correct email</li>
            <li>Click below to resend the link</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleResend}
            isLoading={isResendingVerification}
            className="w-full"
            variant="outline"
          >
            Resend Verification Email
          </Button>

          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
