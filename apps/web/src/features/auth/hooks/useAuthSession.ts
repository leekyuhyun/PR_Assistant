import { useEffect, useState } from "react";
import type { AuthSession } from "@pullwise/shared";
import {
  fetchAuthSession,
  logout as requestLogout,
} from "../api/auth.api";

const anonymous: AuthSession = { authenticated: false, user: null };

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession>(anonymous);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuthSession()
      .then(setSession)
      .catch(() => setSession(anonymous))
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    await requestLogout();
    setSession(anonymous);
  }

  return { ...session, loading, logout };
}
