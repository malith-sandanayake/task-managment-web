import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUserRequest,
  loginRequest,
} from "../api/auth.api";
import type {
  LoginCredentials,
  User,
} from "../types/auth.types";
import {
  getToken,
  removeToken,
  setToken,
} from "../utils/authStorage";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCurrentUser = useCallback(async (): Promise<void> => {
    const token = getToken();

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await getCurrentUserRequest();
      setUser(response.data.user);
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCurrentUser();
  }, [loadCurrentUser]);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      const response = await loginRequest(credentials);

      setToken(response.data.token);
      setUser(response.data.user);
    },
    [],
  );

  const logout = useCallback((): void => {
    removeToken();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
    }),
    [isLoading, login, logout, user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider",
    );
  }

  return context;
}
