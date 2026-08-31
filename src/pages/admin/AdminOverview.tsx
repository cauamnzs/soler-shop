import {
  CreditCard,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ADMIN_ORDERS } from "@/data/adminMockData";
import { formatPrice } from "@/lib/price";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const AdminOverview = () => {
  const totalRevenue = ADMIN_ORDERS.filter(
    (o) => o.paymentStatus === "approved" || o.paymentStatus === "authorized"
  ).reduce((s, o) => s + o.total, 0);
  const approvedCount = ADMIN_ORDERS.filter(
    (o) => o.paymentStatus === "approved" || o.paymentStatus === "authorized"
  ).length;
  const pendingCount = ADMIN_ORDERS.filter(
    (o) => o.paymentStatus === "pending" || o.paymentStatus === "in_process"
  ).length;
  const uniqueCustomers = new Set(ADMIN_ORDERS.map((o) => o.customer.email)).size;

  const stats = [
    {
      label: "Receita aprovada",
      value: formatPrice(totalRevenue),
      delta: "+12,4% vs. semana anterior",
      icon: TrendingUp,
      tone: "gold",
    },
    {
      label: "Pedidos processados",
      value: String(approvedCount),
      delta: "Em média 3,2 por dia",
      icon: ShoppingBag,
      tone: "neutral",
    },
    {
      label: "Aguardando pagamento",
      value: String(pendingCount),
      delta: "Sinalizados como prioridade",
      icon: Clock,
      tone: "neutral",
    },
    {
      label: "Clientes únicos",
      value: String(uniqueCustomers),
      delta: "+4 novos na última hora",
      icon: Users,
      tone: "neutral",
    },
  ] as const;

  const recent = ADMIN_ORDERS.slice(0, 6);

  return (
    <div className="space-y-7">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div className="space-y-1.5">
          <p className="font-heading uppercase tracking-[0.25em] text-[10px] text-gold">
            Painel Administrativo
          </p>
          <h1 className="font-heading text-2xl md:text-3xl tracking-tight text-foreground">
            Visão Geral
          </h1>
          <p className="text-sm text-muted-foreground font-light max-w-xl leading-relaxed">
            Acompanhe em tempo real o desempenho da loja, os pedidos por status e os
            clientes mais recentes.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="h-11 rounded-2xl border-border/80">
          <Link to="/admin/pedidos">
            Ver todos os pedidos
            <ChevronRight size={15} strokeWidth={2} />
          </Link>
        </Button>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card
              key={s.label}
              className={[
                "border-border/80 bg-card/30 backdrop-blur-md rounded-3xl shadow-[0_10px_40px_hsl(var(--gold)/0.04)]",
                s.tone === "gold" ? "ring-1 ring-gold/20" : "",
              ].join(" ")}
            >
              <CardHeader className="flex-row items-center justify-between pb-2 pt-5 px-5">
                <div
                  className={[
                    "w-11 h-11 rounded-2xl flex items-center justify-center",
                    s.tone === "gold"
                      ? "bg-gold/10 border border-gold/25 text-gold"
                      : "bg-background border border-border text-muted-foreground",
                  ].join(" ")}
                >
                  <Icon size={19} strokeWidth={1.75} />
                </div>
                {s.tone === "gold" ? (
                  <Badge
                    variant="outline"
                    className="h-7 rounded-full border-gold/30 bg-gold/5 text-gold text-[10px] tracking-widest uppercase"
                  >
                    Destaque
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="h-7 rounded-full border-border/80 text-muted-foreground text-[10px] tracking-widest uppercase"
                  >
                    Total
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-1 px-5 pb-5">
                <p className="text-xs text-muted-foreground font-light">{s.label}</p>
                <p className="font-heading text-2xl tracking-tight text-foreground">
                  {s.value}
                </p>
                <p className="text-[11px] text-muted-foreground font-light pt-1">{s.delta}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="xl:col-span-2 rounded-3xl border-border/80 bg-card/30 backdrop-blur-md shadow-[0_10px_40px_hsl(var(--gold)/0.04)] overflow-hidden">
          <CardHeader className="flex-row items-center justify-between px-6 py-5 border-b border-border/70">
            <div className="space-y-1">
              <h2 className="font-heading text-lg tracking-tight text-foreground">
                Pedidos recentes
              </h2>
              <p className="text-xs text-muted-foreground font-light">
                Atualizado há alguns segundos.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="h-9 rounded-xl text-xs">
              <Link to="/admin/pedidos">
                Ir para pedidos
                <ChevronRight size={14} strokeWidth={2} />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border/70">
              {recent.map((o) => {
                const ok =
                  o.paymentStatus === "approved" || o.paymentStatus === "authorized";
                const pending = o.paymentStatus === "pending" || o.paymentStatus === "in_process";
                return (
                  <li
                    key={o.orderNumber}
                    className="flex items-center gap-4 px-5 md:px-6 py-4 min-h-[76px]"
                  >
                    <div
                      className={[
                        "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0",
                        ok
                          ? "bg-gold/10 border border-gold/20 text-gold"
                          : pending
                            ? "bg-background border border-border text-muted-foreground"
                            : "bg-destructive/5 border border-destructive/20 text-destructive",
                      ].join(" ")}
                    >
                      {ok ? (
                        <CheckCircle2 size={19} strokeWidth={1.75} />
                      ) : pending ? (
                        <Clock size={19} strokeWidth={1.75} />
                      ) : (
                        <CreditCard size={19} strokeWidth={1.75} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="text-sm font-medium text-foreground truncate">
                        {o.orderNumber}
                      </p>
                      <p className="text-xs text-muted-foreground font-light truncate">
                        {o.customer.name} · {new Date(o.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-heading text-sm tracking-tight text-foreground tabular-nums">
                        {formatPrice(o.total)}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-light capitalize">
                        {o.paymentMethod === "card"
                          ? "Cartão"
                          : o.paymentMethod === "pix"
                            ? "Pix"
                            : "Boleto"}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-3xl border-border/80 bg-card/30 backdrop-blur-md shadow-[0_10px_40px_hsl(var(--gold)/0.04)]">
            <CardHeader className="flex-row items-center gap-3 px-5 py-5">
              <div className="w-11 h-11 rounded-2xl bg-background border border-border flex items-center justify-center text-muted-foreground">
                <Package size={19} strokeWidth={1.75} />
              </div>
              <div className="space-y-0.5 min-w-0">
                <h3 className="font-heading text-base tracking-tight text-foreground">
                  Pedidos para despachar
                </h3>
                <p className="text-xs text-muted-foreground font-light">
                  Aprovados e aguardando código de rastreio.
                </p>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0">
              <p className="font-heading text-3xl tracking-tight text-foreground">
                {approvedCount}
              </p>
              <p className="text-xs text-muted-foreground font-light pt-1">
                Priorize envios para Pix e boleto pagos hoje.
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-border/80 bg-card/30 backdrop-blur-md shadow-[0_10px_40px_hsl(var(--gold)/0.04)]">
            <CardHeader className="flex-row items-center gap-3 px-5 py-5">
              <div className="w-11 h-11 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                <Users size={19} strokeWidth={1.75} />
              </div>
              <div className="space-y-0.5 min-w-0">
                <h3 className="font-heading text-base tracking-tight text-foreground">
                  Ticket médio
                </h3>
                <p className="text-xs text-muted-foreground font-light">
                  Aprovados nos últimos 18 pedidos.
                </p>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0">
              <p className="font-heading text-3xl tracking-tight text-foreground">
                {formatPrice(
                  approvedCount
                    ? totalRevenue / approvedCount
                    : 0
                )}
              </p>
              <p className="text-xs text-muted-foreground font-light pt-1">
                Lembre-se de manter comunicação ativa com quem deixou carrinho abandonado.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AdminOverview;
