import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useProfile } from '../hooks/useProfile';

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'Zip is required'),
  country: z.string().min(1, 'Country is required'),
});

type AddressInput = z.infer<typeof addressSchema>;

export function AddressTab() {
  const { user, updateProfileAsync, isUpdating } = useProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: user?.address?.street ?? '',
      city: user?.address?.city ?? '',
      state: user?.address?.state ?? '',
      zip: user?.address?.zip ?? '',
      country: user?.address?.country ?? '',
    },
  });

  const onSubmit = async (data: AddressInput) => {
    try {
      await updateProfileAsync({ address: data });
      toast.success('Address updated successfully!');
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to update address. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black uppercase tracking-widest text-[var(--color-text-heading)] mb-1">
          Shipping Address
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          This address will be pre-filled during checkout.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-6 space-y-4"
      >
        <Input
          label="Street Address"
          placeholder="123 Main St"
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
          <Button
            type="submit"
            isLoading={isUpdating}
            disabled={!isDirty}
            className="w-full sm:w-auto"
          >
            SAVE ADDRESS
          </Button>
        </div>
      </form>
    </div>
  );
}
