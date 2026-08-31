import { useMemo } from "react";
import { Users, Mail, Phone, ShoppingBag, Search } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ADMIN_ORDERS } from "@/data/adminMockData";
import { formatPrice } from "@/lib/price";
import { Separator } from "@/components/ui/separator";

const AdminCustomers = () => {
  const [search, setSearch] = useState("");

  const customers = useMemo(() => {
    const byEmail = new Map<string, {
      email: string;
      name: string;
      cpf: string;
      phone: string;
      orders: number;
      spent: number;
      lastOrderAt: string;
      city: string;
      uf: string;
    }>();
    for (const order of ADMIN_ORDERS) {
      const { email, name, cpf, phone } = order.customer;
      if (!byEmail.has(email)) {
        byEmail.set(email, {
          email,
          name,
          cpf,
          phone,
          orders: 0,
          spent: 0,
          lastOrderAt: order.createdAt,
          city: order.address.cidade,
          uf: order.address.uf,
        });
      }
      const c = byEmail.get(email)!;
      c.orders += 1;
      c.spent += order.total;
      if (new Date(order.createdAt) > new Date(c.lastOrderAt)) c.lastOrderAt = order.createdAt;
    }
    return [...byEmail.values()].sort(
      (a, b) => b.spent - a.spent || b.orders - a.orders
    );
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.city.toLowerCase().includes(q)
    );
  }, [customers, search]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div className="space-y-1.5">
          <p className="font-heading uppercase tracking-[0.25em] text-[10px] text-gold">
            Relacionamento
          </p>
          <h1 className="font-heading text-2xl md:text-3xl tracking-tight text-foreground">
            Clientes
          </h1>
          <p className="text-sm text-muted-foreground font-light max-w-xl leading-relaxed">
            Acompanhe os clientes que mais compram, a recência de pedidos e localização
            geográfica para campanhas de fidelidade.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search
            size={16}
            strokeWidth={1.9}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cliente…"
            className="pl-10 h-11 rounded-2xl bg-card/40 border-border/80 focus-visible:ring-gold/30"
          />
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-border/80 bg-card/30 backdrop-blur-md">
          <CardContent className="p-5 space-y-1.5">
            <div className="flex items-center gap-2 text-gold">
              <Users size={17} strokeWidth={1.75} />
              <p className="text-[11px] uppercase tracking-[0.2em] font-medium">Clientes únicos</p>
            </div>
            <p className="font-heading text-2xl tracking-tight text-foreground">{customers.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/80 bg-card/30 backdrop-blur-md">
          <CardContent className="p-5 space-y-1.5">
            <div className="flex items-center gap-2 text-gold">
              <ShoppingBag size={17} strokeWidth={1.75} />
              <p className="text-[11px] uppercase tracking-[0.2em] font-medium">Ticket médio</p>
            </div>
            <p className="font-heading text-2xl tracking-tight text-foreground tabular-nums">
              {formatPrice(
                customers.length ? customers.reduce((s, c) => s + c.spent, 0) / customers.length : 0
              )}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/80 bg-card/30 backdrop-blur-md">
          <CardContent className="p-5 space-y-1.5">
            <div className="flex items-center gap-2 text-gold">
              <Mail size={17} strokeWidth={1.75} />
              <p className="text-[11px] uppercase tracking-[0.2em] font-medium">Cidades atendidas</p>
            </div>
            <p className="font-heading text-2xl tracking-tight text-foreground">
              {new Set(customers.map((c) => c.city)).size}
            </p>
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
        {filtered.map((c) => (
          <Card
            key={c.email}
            className="rounded-3xl border-border/80 bg-card/30 backdrop-blur-md shadow-[0_10px_40px_hsl(var(--gold)/0.04)] overflow-hidden"
          >
            <CardContent className="p-5 md:p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 grid place-items-center text-gold shrink-0">
                  <span className="font-heading text-xl tracking-tight">
                    {c.name
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="min-w-0 space-y-1 flex-1">
                  <p className="font-heading text-base tracking-tight text-foreground truncate">
                    {c.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-light truncate">{c.email}</p>
                </div>
                <Badge
                  variant="outline"
                  className="h-7 rounded-full border-gold/25 bg-gold/5 text-gold text-[10px] tracking-[0.2em] uppercase shrink-0"
                >
                  {c.orders > 1 ? "Fiel" : "Novo"}
                </Badge>
              </div>

              <Separator className="bg-border/70" />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
                    Localização
                  </p>
                  <p className="text-sm font-medium text-foreground truncate">
                    {c.city} — {c.uf}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
                    Último pedido
                  </p>
                  <p className="text-sm font-medium tabular-nums text-foreground">
                    {new Date(c.lastOrderAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/40 p-4">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
                    Total comprado
                  </p>
                  <p className="font-heading text-xl tracking-tight text-foreground tabular-nums">
                    {formatPrice(c.spent)}
                  </p>
                </div>
                <div className="text-right shrink-0 space-y-0.5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
                    Pedidos
                  </p>
                  <p className="font-heading text-xl tracking-tight text-foreground tabular-nums">
                    {c.orders}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground font-light">
                <Phone size={13} strokeWidth={1.75} />
                <span className="tabular-nums truncate">{c.phone}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 ? (
          <Card className="rounded-3xl border-border/80 bg-card/30 backdrop-blur-md md:col-span-2 xl:col-span-3">
            <CardContent className="p-10 text-center space-y-2">
              <Users className="mx-auto text-muted-foreground" size={26} strokeWidth={1.75} />
              <p className="font-heading text-base text-foreground tracking-tight">
                Nenhum cliente para a busca
              </p>
              <p className="text-xs text-muted-foreground font-light max-w-md mx-auto">
                Tente outro nome, e-mail, cidade ou telefone para encontrar o cliente desejado.
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default AdminCustomers;
