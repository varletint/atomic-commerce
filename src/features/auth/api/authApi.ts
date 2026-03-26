import api from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/api/types';
import type { User, Address } from '@/types';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  address: Address;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  login: (data: LoginPayload) => api.post<ApiResponse<User>>(API_ENDPOINTS.AUTH.LOGIN, data),

  register: (data: RegisterPayload) =>
    api.post<ApiResponse<User>>(API_ENDPOINTS.AUTH.REGISTER, data),

  logout: () => api.post<ApiResponse>(API_ENDPOINTS.AUTH.LOGOUT),

  refreshTokens: () => api.post<ApiResponse>(API_ENDPOINTS.AUTH.REFRESH),

  getMe: () => api.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME),

  verifyEmailByToken: (token: string) =>
    api.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      params: { token },
    }),

  resendVerification: () => api.post<ApiResponse>(API_ENDPOINTS.AUTH.RESEND_VERIFICATION),
};
