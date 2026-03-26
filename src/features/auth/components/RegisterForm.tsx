import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { registerSchema, type RegisterInput } from '@/schemas/authSchema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function RegisterForm() {
  const { registerAsync, isRegistering } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
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

  const onSubmit = async (data: RegisterInput) => {
    try {
      await registerAsync(data);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
          <Input
            label="Full Name"
            placeholder="John Doe"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
        </div>

        {/* Address Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Shipping Address</h3>
          <Input
            label="Street Address"
            placeholder="123 Main St"
            {...register('address.street')}
            error={errors.address?.street?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              placeholder="New York"
              {...register('address.city')}
              error={errors.address?.city?.message}
            />
            <Input
              label="State/Province"
              placeholder="NY"
              {...register('address.state')}
              error={errors.address?.state?.message}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Postal/Zip Code"
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
      </div>

      <Button type="submit" className="w-full mt-8" size="lg" isLoading={isRegistering}>
        CREATE ACCOUNT
      </Button>
    </form>
  );
}
