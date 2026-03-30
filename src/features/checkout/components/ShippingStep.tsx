import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store';
import type { Address } from '@/types/user';

const shippingSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'Zip is required'),
  country: z.string().min(1, 'Country is required'),
});

interface ShippingStepProps {
  initialAddress?: Address;
  onNext: (address: Address) => void;
}

export function ShippingStep({ initialAddress, onNext }: ShippingStepProps) {
  const user = useAuthStore((s) => s.user);
  const profileAddress = user?.address;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Address>({
    resolver: zodResolver(shippingSchema),
    defaultValues: initialAddress ??
      profileAddress ?? {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      },
  });

  const handleUseProfile = () => {
    if (profileAddress) {
      reset(profileAddress);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest text-[var(--color-text-heading)]">
            Shipping Address
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Where should we deliver your order?
          </p>
        </div>

        {profileAddress && (
          <button
            type="button"
            onClick={handleUseProfile}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] transition-colors cursor-pointer border border-[var(--color-border)] px-3 py-2"
          >
            <MapPin size={12} /> Use Profile Address
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-4">
        <Input
          label="Street Address"
          placeholder="123 Main St, Apt 4B"
          {...register('street')}
          error={errors.street?.message}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="City"
            placeholder="Lagos"
            {...register('city')}
            error={errors.city?.message}
          />
          <Input
            label="State / Province"
            placeholder="Lagos"
            {...register('state')}
            error={errors.state?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Postal / Zip Code"
            placeholder="100001"
            {...register('zip')}
            error={errors.zip?.message}
          />
          <Input
            label="Country"
            placeholder="Nigeria"
            {...register('country')}
            error={errors.country?.message}
          />
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full">
            CONTINUE TO PAYMENT
          </Button>
        </div>
      </form>
    </div>
  );
}
