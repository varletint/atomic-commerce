import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import { profileApi } from '../api/profileApi';
import type { Address } from '@/types';

export function useProfile() {
  const { user, updateUser } = useAuthStore();

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name?: string; address?: Address }) => {
      if (!user?._id) throw new Error('User not authenticated');
      return profileApi.updateProfile(user._id, data);
    },
    onSuccess: ({ data }) => {
      if (data.data) {
        updateUser(data.data);
      }
    },
  });

  return {
    user,
    updateProfile: updateProfileMutation.mutate,
    updateProfileAsync: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,
  };
}
