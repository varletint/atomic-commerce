import { useState, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Check, Eye, EyeOff, Pencil } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { registerSchema, type RegisterInput } from '@/schemas/authSchema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const STEPS = [
  { id: 1, title: 'Personal', fields: ['name', 'email'] },
  { id: 2, title: 'Password', fields: ['password', 'confirmPassword'] },
  { id: 3, title: 'Address', fields: ['address'] },
  { id: 4, title: 'Review', fields: [] },
] as const;

/* ── Password Strength helpers ──────────────────── */
function getPasswordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-5
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
const STRENGTH_COLORS = ['', '#dc2626', '#ca8a04', '#737373', '#16a34a', '#0a0a0a'];

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
  { label: 'Uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
  { label: 'Lowercase letter', test: (pw: string) => /[a-z]/.test(pw) },
  { label: 'Number', test: (pw: string) => /[0-9]/.test(pw) },
  { label: 'Special character', test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
];

export function RegisterFormMultiStep() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReviewPw, setShowReviewPw] = useState(false);
  const { registerAsync, isRegistering } = useAuth();
  const animationKey = useRef(0);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      },
    },
  });

  const watchedPassword = watch('password');
  const allValues = watch();
  const strength = useMemo(() => getPasswordStrength(watchedPassword || ''), [watchedPassword]);

  /* ── Navigation ──────────────────────────────────── */
  const handleNext = async () => {
    const currentFields = STEPS[currentStep - 1].fields;
    if (currentFields.length > 0) {
      const isValid = await trigger(currentFields as any);
      if (!isValid) return;
    }
    setDirection('right');
    animationKey.current++;
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setDirection('left');
    animationKey.current++;
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const jumpToStep = (step: number) => {
    setDirection(step < currentStep ? 'left' : 'right');
    animationKey.current++;
    setCurrentStep(step);
  };

  const onSubmit = async (data: RegisterInput) => {
    try {
      await registerAsync(data);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-multi w-full max-w-md mx-auto">
      {/* ── Step Indicator ─────────────────────────── */}
      <div className="step-indicator" role="navigation" aria-label="Registration steps">
        {STEPS.map((step, i) => (
          <div key={step.id} className="step-indicator__item">
            {/* Connector line (before circle, except first) */}
            {i > 0 && (
              <div className={`step-line ${step.id <= currentStep ? 'step-line--active' : ''}`} />
            )}
            {/* Circle */}
            <div
              className={`step-circle ${
                step.id === currentStep
                  ? 'step-circle--active'
                  : step.id < currentStep
                  ? 'step-circle--done'
                  : ''
              }`}
            >
              {step.id < currentStep ? (
                <Check className="step-check-icon" size={14} strokeWidth={3} />
              ) : (
                <span>{step.id}</span>
              )}
            </div>
            {/* Label (hidden on very small screens, shown on sm+) */}
            <span className={`step-label ${step.id === currentStep ? 'step-label--active' : ''}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* ── Form ───────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div
          key={animationKey.current}
          className={direction === 'right' ? 'animate-slideInRight' : 'animate-slideInLeft'}
        >
          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Personal Details</h3>
              <Input
                label="Full Name"
                placeholder="John Doe"
                {...register('name')}
                error={errors.name?.message}
                autoFocus
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>
          )}

          {/* Step 2: Password */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Create Password</h3>

              {/* Password field with toggle */}
              <div className="pw-field-wrapper">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  error={errors.password?.message}
                  autoFocus
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Strength meter */}
              {watchedPassword && (
                <div className="pw-strength">
                  <div className="pw-strength__bar">
                    {[1, 2, 3, 4, 5].map((seg) => (
                      <div
                        key={seg}
                        className="pw-strength__segment"
                        style={{
                          backgroundColor:
                            seg <= strength ? STRENGTH_COLORS[strength] : 'var(--color-border)',
                        }}
                      />
                    ))}
                  </div>
                  <span className="pw-strength__label" style={{ color: STRENGTH_COLORS[strength] }}>
                    {STRENGTH_LABELS[strength]}
                  </span>
                </div>
              )}

              {/* Requirements checklist */}
              <ul className="pw-rules">
                {PASSWORD_RULES.map((rule) => {
                  const met = rule.test(watchedPassword || '');
                  return (
                    <li key={rule.label} className={`pw-rule ${met ? 'pw-rule--met' : ''}`}>
                      {met ? (
                        <Check size={12} strokeWidth={3} />
                      ) : (
                        <span className="pw-rule__dot" />
                      )}
                      {rule.label}
                    </li>
                  );
                })}
              </ul>

              {/* Confirm password with toggle */}
              <div className="pw-field-wrapper">
                <Input
                  label="Confirm Password"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Shipping Address */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Shipping Address</h3>
              <Input
                label="Street Address"
                placeholder="123 Main St"
                {...register('address.street')}
                error={errors.address?.street?.message}
                autoFocus
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  placeholder="New York"
                  {...register('address.city')}
                  error={errors.address?.city?.message}
                />
                <Input
                  label="State / Province"
                  placeholder="NY"
                  {...register('address.state')}
                  error={errors.address?.state?.message}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Postal / Zip"
                  placeholder="10001"
                  {...register('address.zip')}
                  error={errors.address?.zip?.message}
                />
                <Input
                  label="Country"
                  placeholder="USA"
                  {...register('address.country')}
                  error={errors.address?.country?.message}
                />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-2">Review & Confirm</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Please verify your information before creating your account.
              </p>

              {/* Personal */}
              <div className="review-section">
                <div className="review-section__header">
                  <span className="review-section__title">Personal Details</span>
                  <button type="button" className="review-edit-btn" onClick={() => jumpToStep(1)}>
                    <Pencil size={14} /> Edit
                  </button>
                </div>
                <div className="review-field">
                  <span className="review-field__label">Name</span>
                  <span className="review-field__value">{allValues.name}</span>
                </div>
                <div className="review-field">
                  <span className="review-field__label">Email</span>
                  <span className="review-field__value">{allValues.email}</span>
                </div>
              </div>

              {/* Password */}
              <div className="review-section">
                <div className="review-section__header">
                  <span className="review-section__title">Password</span>
                  <button type="button" className="review-edit-btn" onClick={() => jumpToStep(2)}>
                    <Pencil size={14} /> Edit
                  </button>
                </div>
                <div className="review-field">
                  <span className="review-field__label">Password</span>
                  <span className="review-field__value review-pw">
                    {showReviewPw ? allValues.password : '••••••••'}
                    <button
                      type="button"
                      className="pw-toggle-inline"
                      onClick={() => setShowReviewPw((v) => !v)}
                      aria-label={showReviewPw ? 'Hide password' : 'Show password'}
                    >
                      {showReviewPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="review-section">
                <div className="review-section__header">
                  <span className="review-section__title">Shipping Address</span>
                  <button type="button" className="review-edit-btn" onClick={() => jumpToStep(3)}>
                    <Pencil size={14} /> Edit
                  </button>
                </div>
                <div className="review-field">
                  <span className="review-field__label">Street</span>
                  <span className="review-field__value">{allValues.address?.street}</span>
                </div>
                <div className="review-field">
                  <span className="review-field__label">City</span>
                  <span className="review-field__value">{allValues.address?.city}</span>
                </div>
                <div className="review-field">
                  <span className="review-field__label">State</span>
                  <span className="review-field__value">{allValues.address?.state}</span>
                </div>
                <div className="review-field">
                  <span className="review-field__label">Postal Code</span>
                  <span className="review-field__value">{allValues.address?.zip}</span>
                </div>
                <div className="review-field">
                  <span className="review-field__label">Country</span>
                  <span className="review-field__value">{allValues.address?.country}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Navigation Buttons ─────────────────────── */}
        <div className="flex gap-4 pt-6">
          {currentStep > 1 && (
            <Button type="button" variant="secondary" onClick={handleBack} className="flex-1">
              <ChevronLeft className="w-4 h-4" />
              BACK
            </Button>
          )}

          {currentStep < STEPS.length ? (
            <Button type="button" onClick={handleNext} className="flex-1">
              NEXT
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button type="submit" className="flex-1" isLoading={isRegistering}>
              CREATE ACCOUNT
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
