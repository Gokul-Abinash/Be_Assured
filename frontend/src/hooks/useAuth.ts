import { useState, useEffect, useCallback } from "react";
import { getUser, type KindeUser } from "@/api/auth";

interface AuthState {
  user: KindeUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<KindeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const userData = await getUser();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    isLoading,
    isAuthenticated: user !== null,
    refetch: fetchUser,
  };
}
