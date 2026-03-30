import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Eye, EyeOff, KeyRound } from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { useCooldown } from '../hooks/useCooldown';
import { resetPasswordSchema, type ResetPasswordInput } from '@/schemas/authSchema';
import { ROUTES } from '@/config/routes';
import { SEO } from '@/components/SEO';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = (location.state as { email?: string })?.email ?? '';

  const {
    resetPasswordAsync,
    isResetPasswordPending,
    forgotPasswordAsync,
    isForgotPasswordPending,
  } = useAuth();
  const { remainingSeconds, isCoolingDown, startCooldown } = useCooldown('reset-password-resend');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      email: emailFromState,
      otp: '',
      password: '',
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      await resetPasswordAsync(data);
      toast.success('Password reset successfully! Please sign in.');
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Invalid or expired code. Please try again.'
      );
    }
  };

  const handleResendCode = async () => {
    const email = getValues('email');
    if (!email) {
      toast.error('Please enter your email address first.');
      return;
    }
    try {
      const response = await forgotPasswordAsync(email);
      const retryAfter = response?.data?.retryAfter ?? 60;
      startCooldown(retryAfter);
      toast.success('New reset code sent!');
    } catch (error: any) {
      const retryAfter = error?.response?.data?.retryAfter;
      if (retryAfter) {
        startCooldown(retryAfter);
      }
      toast.error(error?.response?.data?.error || 'Failed to resend code.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)]">
      <SEO
        title="Reset Password — Atomic Order"
        description="Enter your reset code and set a new password."
      />

      <div className="w-full max-w-4xl bg-white md:p-12 relative">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-gray-700" />
            </div>
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tight uppercase text-[var(--color-text-heading)]">
            Reset Password
          </h1>
          <p className="text-[var(--color-text-muted)] font-medium">
            Enter the 6-digit code from your email and choose a new password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md mx-auto">
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Reset Code"
            type="text"
            placeholder="000000"
            maxLength={6}
            {...register('otp')}
            error={errors.otp?.message}
            autoFocus
          />

          <div className="pw-field-wrapper w-full relative">
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />
            <button
              type="button"
              className="pw-toggle absolute right-3 top-[38px] text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] transition-colors"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="pt-4 space-y-3">
            <Button type="submit" className="w-full" isLoading={isResetPasswordPending}>
              RESET PASSWORD
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResendCode}
              isLoading={isForgotPasswordPending}
              disabled={isCoolingDown}
            >
              {isCoolingDown ? `RESEND CODE (${remainingSeconds}s)` : 'RESEND CODE'}
            </Button>
          </div>
        </form>

        <div className="mt-12 text-center text-sm text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-8">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-[var(--color-text-heading)] font-bold uppercase tracking-widest hover:text-[var(--color-accent)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
