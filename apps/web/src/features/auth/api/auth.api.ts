import type { AuthSession } from "@pullwise/shared";
import { apiRequest } from "../../../shared/api/client";

export function fetchAuthSession(): Promise<AuthSession> {
  return apiRequest<AuthSession>("/api/auth/session");
}

export async function logout(): Promise<void> {
  await apiRequest<void>("/api/auth/logout", { method: "POST" });
}
