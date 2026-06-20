import { api } from "./api";
import type { LoginRequest, TokenResponse, UserCreate, UserRead } from "../types/auth";

export const authService = {
  login: (data: LoginRequest) => api.post<TokenResponse>("/auth/login", data),

  register: (data: UserCreate) => api.post<UserRead>("/auth/register", data),

  refreshToken: (refreshToken: string) =>
    api.post<TokenResponse>("/auth/refresh-token", { refresh_token: refreshToken }),

  logout: (refreshToken: string) =>
    api.post<{ message: string }>("/auth/logout", { refresh_token: refreshToken }),
};
