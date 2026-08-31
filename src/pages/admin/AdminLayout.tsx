import { ReactNode, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  Menu,
  LogOut,
  ChevronRight,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAdminAuth, type AdminUser } from "@/contexts/AdminAuthContext";

const NAV = [
  { to: "/admin", label: "Visão Geral", icon: LayoutDashboard, end: true },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
] as const;

const pathLabels: Record<string, string> = {
  "": "Visão Geral",
  pedidos: "Pedidos",
  clientes: "Clientes",
  configuracoes: "Configurações",
};

const NavItem = ({
  to,
  label,
  icon: Icon,
  end,
  onClick,
}: (typeof NAV)[number] & { onClick?: () => void; end?: boolean }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      [
        "group min-h-[48px] w-full flex items-center gap-3 px-3.5 rounded-2xl transition-all",
        isActive
          ? "bg-gold/10 border border-gold/25 text-gold shadow-[inset_0_0_0_1px_hsl(var(--gold)/0.2)]"
          : "border border-transparent text-muted-foreground hover:text-foreground hover:bg-card/50",
      ].join(" ")
    }
  >
    <span
      className={[
        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
        "bg-background/60 border border-border/70 group-hover:border-gold/20",
      ].join(" ")}
    >
      <Icon size={18} strokeWidth={1.75} />
    </span>
    <span className="font-body text-sm font-medium tracking-wide flex-1 min-w-0 truncate">
      {label}
    </span>
    <ChevronRight
      size={14}
      strokeWidth={2}
      className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
    />
  </NavLink>
);

const Sidebar = ({ compact, onNavigate }: { compact?: boolean; onNavigate?: () => void }) => (
  <aside
    className={[
      "flex h-full flex-col gap-6",
      compact ? "p-4" : "p-6",
    ].join(" ")}
  >
    <div className="flex items-center gap-3 px-1">
      <div className="w-11 h-11 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
        <Home size={20} strokeWidth={1.75} />
      </div>
      <div className="space-y-0.5 min-w-0">
        <p className="font-heading text-sm tracking-wide text-foreground truncate">
          Soler Shop
        </p>
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Painel Admin
        </p>
      </div>
    </div>

    <nav className="space-y-2">
      {NAV.map((item) => (
        <NavItem key={item.to} {...item} onClick={onNavigate} />
      ))}
    </nav>
  </aside>
);

const UserBadge = ({ user, onLogout }: { user: AdminUser; onLogout: () => void }) => (
  <div className="rounded-2xl border border-border bg-card/30 backdrop-blur p-3.5 flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-foreground/5 border border-border/80 grid place-items-center text-foreground shrink-0">
      <span className="font-heading text-sm tracking-tight text-foreground/80">
        {user.name
          .split(/\s+/)
          .slice(0, 2)
          .map((n) => n[0])
          .join("")}
      </span>
    </div>
    <div className="min-w-0 flex-1 space-y-0.5">
      <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
    </div>
    <Button
      variant="ghost"
      size="icon"
      onClick={onLogout}
      title="Sair"
      className="h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-background"
    >
      <LogOut size={17} strokeWidth={1.75} />
    </Button>
  </div>
);

const AdminLayoutShell = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAdminAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("admin-shell");
    return () => document.body.classList.remove("admin-shell");
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const slug = location.pathname.replace(/^\/admin\/?/, "");
  const currentLabel = pathLabels[slug] ?? "Visão Geral";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[38rem] w-[38rem] rounded-full bg-gold/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[32rem] w-[32rem] rounded-full bg-foreground/[0.04] blur-[120px]" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex w-[300px] shrink-0 sticky top-0 h-screen border-r border-border/80 bg-background/40 backdrop-blur-xl">
          <div className="w-full flex flex-col p-4 gap-6">
            <Sidebar compact />
            <div className="mt-auto">
              {user ? <UserBadge user={user} onLogout={logout} /> : null}
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-30 border-b border-border/80 bg-background/60 backdrop-blur-xl">
            <div className="section-padding py-3.5 md:py-4 flex items-center gap-3">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden h-11 w-11 rounded-2xl border border-border/80 bg-card/40"
                    aria-label="Abrir menu"
                  >
                    <Menu size={18} strokeWidth={1.8} />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[86%] max-w-sm p-0 border-r border-border/80 bg-background/90 backdrop-blur-xl"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <Sidebar compact />
                    </div>
                    <div className="p-4">
                      {user ? <UserBadge user={user} onLogout={logout} /> : null}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Breadcrumb className="min-w-0 flex-1">
                <BreadcrumbList className="gap-1.5">
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-muted-foreground hover:text-foreground text-xs tracking-wide">
                      Loja
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-muted-foreground/50">
                    <ChevronRight size={13} strokeWidth={2} />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/admin" className="text-muted-foreground hover:text-foreground text-xs tracking-wide">
                      Admin
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-muted-foreground/50">
                    <ChevronRight size={13} strokeWidth={2} />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-foreground text-xs tracking-wide">
                      {currentLabel}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="hidden md:flex items-center gap-2">
                {user ? <UserBadge user={user} onLogout={logout} /> : null}
              </div>
            </div>
          </header>

          <main className="flex-1">
            <div className="section-padding py-6 md:py-8 max-w-7xl w-full mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

const AdminLayout = () => (
  <AdminLayoutShell>
    <Outlet />
  </AdminLayoutShell>
);

export default AdminLayout;
