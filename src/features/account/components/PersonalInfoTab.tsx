import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Pencil, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useProfile } from '../hooks/useProfile';

const nameSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type NameInput = z.infer<typeof nameSchema>;

export function PersonalInfoTab() {
  const { user, updateProfileAsync, isUpdating } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NameInput>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: user?.name ?? '' },
  });

  const onSubmit = async (data: NameInput) => {
    try {
      await updateProfileAsync({ name: data.name });
      toast.success('Name updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to update name. Please try again.');
    }
  };

  const handleCancel = () => {
    reset({ name: user?.name ?? '' });
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className=" font-black uppercase tracking-widest text-[var(--color-text-heading)] mb-1">
          Personal Information
        </h3>
        <p className="text-sm text-[var(--color-text-muted)]">Manage your personal details.</p>
      </div>

      {/* Name Field */}
      <div className="bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            Full Name
          </span>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 text-xs font-bold uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] transition-colors cursor-pointer"
            >
              <Pencil size={12} /> Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label=""
              placeholder="Your full name"
              {...register('name')}
              error={errors.name?.message}
              autoFocus
            />
            <div className="flex gap-3">
              <Button type="submit" isLoading={isUpdating} className="flex-1">
                SAVE
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancel} className="flex-1">
                <X size={14} /> CANCEL
              </Button>
            </div>
          </form>
        ) : (
          <p className="sm:text-lg font-semibold text-[var(--color-text-heading)]">
            {user?.name || '—'}
          </p>
        )}
      </div>

      {/* Email Field (read-only) */}
      <div className="bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] block mb-4">
          Email Address
        </span>
        <p className="sm:text-lg font-semibold text-[var(--color-text-heading)]">
          {user?.email || '—'}
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-2">
          Email cannot be changed. Contact support if you need to update it.
        </p>
      </div>

      {/* Role (read-only) */}
      <div className="bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] block mb-4">
          Account Role
        </span>
        <p className="sm:text-lg font-semibold text-[var(--color-text-heading)] uppercase tracking-wider">
          {user?.role || '—'}
        </p>
      </div>
    </div>
  );
}
