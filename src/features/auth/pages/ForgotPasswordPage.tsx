import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Mail } from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { useCooldown } from '../hooks/useCooldown';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/schemas/authSchema';
import { ROUTES } from '@/config/routes';
import { SEO } from '@/components/SEO';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPasswordAsync, isForgotPasswordPending } = useAuth();
  const { remainingSeconds, isCoolingDown, startCooldown } = useCooldown('forgot-password');
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      const response = await forgotPasswordAsync(data.email);
      const retryAfter = response?.data?.retryAfter ?? 60;
      startCooldown(retryAfter);
      setEmailSent(true);
      setSentEmail(data.email);
      toast.success('If an account exists, a reset code has been sent.');
    } catch (error: any) {
      const retryAfter = error?.response?.data?.retryAfter;
      if (retryAfter) {
        startCooldown(retryAfter);
      }
      toast.error(error?.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  const handleResendCode = async () => {
    const email = sentEmail || getValues('email');
    if (!email) return;
    try {
      const response = await forgotPasswordAsync(email);
      const retryAfter = response?.data?.retryAfter ?? 60;
      startCooldown(retryAfter);
      toast.success('Reset code resent!');
    } catch (error: any) {
      const retryAfter = error?.response?.data?.retryAfter;
      if (retryAfter) {
        startCooldown(retryAfter);
      }
      toast.error(error?.response?.data?.error || 'Failed to resend. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)]">
      <SEO
        title="Forgot Password — Atomic Order"
        description="Reset your Atomic Order account password."
      />

      <div className="w-full max-w-4xl bg-white md:p-12 relative">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Mail className="w-8 h-8 text-gray-700" />
            </div>
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tight uppercase text-[var(--color-text-heading)]">
            {emailSent ? 'Check Your Email' : 'Forgot Password'}
          </h1>
          <p className="text-[var(--color-text-muted)] font-medium">
            {emailSent ? (
              <>
                We've sent a 6-digit reset code to{' '}
                <span className="font-semibold text-[var(--color-text-heading)]">{sentEmail}</span>.
              </>
            ) : (
              "Enter your email address and we'll send you a code to reset your password."
            )}
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md mx-auto">
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              {...register('email')}
              error={errors.email?.message}
              autoFocus
            />

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                isLoading={isForgotPasswordPending}
                disabled={isCoolingDown}
              >
                {isCoolingDown ? `SEND CODE (${remainingSeconds}s)` : 'SEND RESET CODE'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6 w-full max-w-md mx-auto">
            <div className="bg-gray-50 border border-gray-200 p-4 text-left text-sm text-gray-600 space-y-2">
              <p className="font-semibold text-gray-800">What to do next:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Check your inbox for a 6-digit code</li>
                <li>Check your spam / junk folder</li>
                <li>The code expires in 15 minutes</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate(ROUTES.RESET_PASSWORD, { state: { email: sentEmail } })}
                className="w-full"
              >
                ENTER RESET CODE
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
          </div>
        )}

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
