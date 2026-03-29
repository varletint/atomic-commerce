import api from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/api/types';
import type { User, Address } from '@/types';

interface UpdateProfilePayload {
  name?: string;
  address?: Address;
}

export const profileApi = {
  getProfile: () => api.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME),

  updateProfile: (userId: string, data: UpdateProfilePayload) =>
    api.patch<ApiResponse<User>>(API_ENDPOINTS.USERS.UPDATE_PROFILE(userId), data),
};
