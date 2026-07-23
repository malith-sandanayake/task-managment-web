import { apiClient } from "./client";

import type {
  CurrentUserResponse,
  LoginCredentials,
  LoginResponse,
} from "../types/auth.types";

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    "/auth/login",
    credentials,
  );

  return response.data;
}

export async function getCurrentUserRequest(): Promise<CurrentUserResponse> {
  const response = await apiClient.get<CurrentUserResponse>(
    "/auth/me",
  );

  return response.data;
}
