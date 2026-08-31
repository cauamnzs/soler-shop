import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Loader2 } from "lucide-react";

interface AdminProtectedRouteProps {
  children: ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, loading } = useAdminAuth();
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.classList.add("admin-shell");
    return () => document.body.classList.remove("admin-shell");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 size={28} className="animate-spin text-gold" strokeWidth={1.75} />
          <span className="text-sm font-light tracking-wide">Autenticando…</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ redirectTo: location.pathname + location.search }}
      />
    );
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
