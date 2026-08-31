import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export interface AdminUser {
  email: string;
  name: string;
  role: "owner" | "manager";
}

interface AdminAuthContextValue {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

const STORAGE_KEY = "soler-admin-auth-v1";

const MOCK_USER: AdminUser = {
  email: "admin@solershop.com.br",
  name: "Administrador Soler",
  role: "owner",
};

const MOCK_PASSWORD = "admin123";

const readStored = (): AdminUser | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { user: AdminUser; expiresAt: number };
    if (parsed.expiresAt <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.user;
  } catch {
    return null;
  }
};

const writeStored = (user: AdminUser, ttlMs: number) => {
  const payload = { user, expiresAt: Date.now() + ttlMs };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = readStored();
    if (stored) setUser(stored);
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 700));
    const normalized = email.trim().toLowerCase();
    if (normalized === MOCK_USER.email && password === MOCK_PASSWORD) {
      writeStored(MOCK_USER, 1000 * 60 * 60 * 8);
      setUser(MOCK_USER);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = (): AdminAuthContextValue => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth deve ser usado dentro de AdminAuthProvider.");
  return ctx;
};
