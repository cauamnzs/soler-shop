import { FormEvent, useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowRight, Loader2, Lock, Mail, Store, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("admin@solershop.com.br");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, user } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    (location.state as { redirectTo?: string } | undefined)?.redirectTo ?? "/admin";

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [user, navigate, redirectTo]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const ok = await login(email, password);
      if (!ok) {
        setError("Credenciais inválidas. Verifique e-mail e senha.");
        return;
      }
      navigate(redirectTo, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
        <div className="absolute -top-40 -right-40 h-[40rem] w-[40rem] rounded-full bg-gold/10 blur-[120px] opacity-60" />
        <div className="absolute -bottom-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-foreground/5 blur-[120px]" />
      </div>
      <div className="min-h-screen grid place-items-center px-4 section-padding py-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 mb-10 text-foreground/80 hover:text-foreground transition-opacity"
          >
            <span className="w-10 h-10 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
              <Store size={20} strokeWidth={1.75} />
            </span>
            <span className="font-heading tracking-widest uppercase text-xs text-muted-foreground">
              Soler Shop
            </span>
          </Link>

          <div className="rounded-3xl border border-border bg-background/60 backdrop-blur-xl shadow-[0_30px_80px_hsl(var(--gold)/0.10)] ring-1 ring-black/5 p-6 md:p-8">
            <div className="space-y-2 mb-7">
              <p className="font-heading uppercase tracking-[0.25em] text-[10px] text-gold">
                Painel Administrativo
              </p>
              <h1 className="font-heading text-2xl md:text-3xl tracking-tight text-foreground">
                Acesso restrito
              </h1>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                Informe suas credenciais para acessar a gestão de pedidos, clientes e
                configurações da loja.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  E-mail
                </Label>
                <div className="relative">
                  <Mail
                    size={17}
                    strokeWidth={1.75}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="voce@solershop.com.br"
                    className="pl-11 h-12 rounded-2xl bg-card/40 border-border/80 focus-visible:ring-gold/30"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Senha
                </Label>
                <div className="relative">
                  <Lock
                    size={17}
                    strokeWidth={1.75}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="pl-11 h-12 rounded-2xl bg-card/40 border-border/80 focus-visible:ring-gold/30"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>

              {error ? (
                <div className="flex items-start gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/5 p-3.5">
                  <AlertTriangle size={17} className="mt-0.5 shrink-0 text-destructive" strokeWidth={1.75} />
                  <span className="text-xs md:text-sm text-destructive font-light">{error}</span>
                </div>
              ) : null}

              <div className="rounded-2xl border border-gold/20 bg-gold/[0.04] p-3.5 space-y-1">
                <p className="text-[11px] uppercase tracking-[0.2em] text-gold font-medium">
                  Credenciais de demonstração
                </p>
                <div className="font-mono text-[11px] text-muted-foreground leading-relaxed">
                  admin@solershop.com.br · senha: admin123
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-2xl bg-gold text-background hover:bg-gold/90 shadow-[0_10px_32px_hsl(var(--gold)/0.25)] font-medium text-sm tracking-wide"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" strokeWidth={2} />
                    Entrando…
                  </>
                ) : (
                  <>
                    Entrar no painel
                    <ArrowRight size={16} strokeWidth={2} />
                  </>
                )}
              </Button>

              <p className="pt-1 text-center text-[11px] text-muted-foreground font-light leading-relaxed">
                Ao continuar, você concorda com as políticas internas de segurança e de
                confidencialidade das informações dos clientes.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
