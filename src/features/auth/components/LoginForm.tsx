import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { loginSchema, type LoginInput } from '@/schemas/authSchema';
import { ROUTES } from '@/config/routes';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAsync, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // If the user was redirected to /login by a guard, return them back afterward
  const from = location.state?.from?.pathname || ROUTES.PROFILE;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await loginAsync(data);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (error) {
      const res = (error as { response?: { data?: { code?: string; message?: string } } })?.response
        ?.data;

      if (res?.code === 'EMAIL_NOT_VERIFIED') {
        toast.error('Please verify your email first.');
        navigate(ROUTES.CHECK_EMAIL, { state: { email: data.email }, replace: true });
        return;
      }

      toast.error(res?.message || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md mx-auto">
      <Input
        label="Email Address"
        type="email"
        placeholder="john@example.com"
        {...register('email')}
        error={errors.email?.message}
        autoFocus
      />

      <div className="space-y-2">
        <div className="pw-field-wrapper w-full relative">
          <Input
            label="Password"
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

        <div className="flex justify-end pt-1">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] transition-colors underline"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full" isLoading={isLoggingIn}>
          SIGN IN
        </Button>
      </div>
    </form>
  );
}
