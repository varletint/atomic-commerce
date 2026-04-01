import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, KeyRound, CheckCircle2, XCircle } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCooldown } from '@/features/auth/hooks/useCooldown';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export function SecurityTab() {
  const { user } = useProfile();
  const { resendVerificationAsync, isResendingVerification } = useAuth();
  const { remainingSeconds, isCoolingDown, startCooldown } = useCooldown(
    'resend-verification-security'
  );

  const isVerified = user?.isEmailVerified ?? false;

  const handleResendVerification = async () => {
    if (!user?.email) return;
    try {
      const response = await resendVerificationAsync(user.email);
      const retryAfter = response?.data?.retryAfter ?? 60;
      startCooldown(retryAfter);
      toast.success('Verification email sent! Check your inbox.');
    } catch (err: any) {
      const retryAfter = err?.response?.data?.retryAfter;
      if (retryAfter) {
        startCooldown(retryAfter);
      }
      toast.error(
        err?.response?.data?.error || 'Failed to send verification email. Try again later.'
      );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black uppercase tracking-widest text-[var(--color-text-heading)] mb-1">
          Security
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Manage your account security settings.
        </p>
      </div>

      {/* Email Verification Status */}
      <div className="bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-6">
        <div className="flex items-center gap-3 mb-4">
          {isVerified ? (
            <ShieldCheck size={20} className="text-green-600" />
          ) : (
            <ShieldAlert size={20} className="text-amber-500" />
          )}
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            Email Verification
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          {isVerified ? (
            <>
              <CheckCircle2 size={16} className="text-green-600" />
              <span className="text-sm font-bold text-green-600">Email Verified</span>
            </>
          ) : (
            <>
              <XCircle size={16} className="text-amber-500" />
              <span className="text-sm font-bold text-amber-500">Email Not Verified</span>
            </>
          )}
        </div>

        {!isVerified && (
          <div className="mt-4">
            <p className="text-sm text-[var(--color-text-muted)] mb-3">
              Please verify your email address to unlock full account features.
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={handleResendVerification}
              isLoading={isResendingVerification}
              disabled={isCoolingDown}
            >
              {isCoolingDown ? `RESEND IN ${remainingSeconds}s` : 'RESEND VERIFICATION EMAIL'}
            </Button>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-6">
        <div className="flex items-center gap-3 mb-4">
          <KeyRound size={20} className="text-[var(--color-text-muted)]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            Password
          </span>
        </div>

        <p className="text-sm text-[var(--color-text)] mb-4">
          To change your password, we'll send a secure reset code to your email address.
        </p>

        <Link to={ROUTES.FORGOT_PASSWORD}>
          <Button type="button" variant="secondary">
            CHANGE PASSWORD
          </Button>
        </Link>
      </div>

      {/* Account Status */}
      <div className="bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] block mb-4">
          Account Status
        </span>
        <p className="text-lg font-bold text-[var(--color-text-heading)] uppercase tracking-wider">
          {user?.status || '—'}
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-2">
          If your account is suspended or deactivated, please contact support.
        </p>
      </div>
    </div>
  );
}
