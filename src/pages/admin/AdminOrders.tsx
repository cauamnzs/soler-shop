import { useMemo, useState } from "react";
import { Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import AdminOrderModal from "@/components/admin/AdminOrderModal";
import { ADMIN_ORDERS, type AdminOrderPaymentStatus, type AdminOrder } from "@/data/adminMockData";
import { formatPrice } from "@/lib/price";

const statusLabel: Record<AdminOrderPaymentStatus, string> = {
  approved: "Aprovado",
  authorized: "Autorizado",
  in_process: "Em processamento",
  pending: "Pendente",
  rejected: "Rejeitado",
  refunded: "Reembolsado",
  charged_back: "Chargeback",
};

const statusVariant: Record<
  AdminOrderPaymentStatus,
  "outline" | "default" | "secondary" | "destructive"
> = {
  approved: "default",
  authorized: "secondary",
  in_process: "outline",
  pending: "outline",
  rejected: "destructive",
  refunded: "secondary",
  charged_back: "destructive",
};

const statusToneClass: Record<AdminOrderPaymentStatus, string> = {
  approved:
    "bg-gold/10 border-gold/25 text-gold",
  authorized:
    "bg-gold/5 border-gold/20 text-gold/80",
  in_process:
    "bg-foreground/5 border-border text-foreground",
  pending:
    "bg-card/70 border-border/90 text-foreground/85",
  rejected:
    "bg-destructive/10 border-destructive/25 text-destructive",
  refunded:
    "bg-background border-border text-muted-foreground",
  charged_back:
    "bg-destructive/10 border-destructive/25 text-destructive",
};

const methodLabel = (m: "card" | "pix" | "ticket") =>
  m === "card" ? "Cartão" : m === "pix" ? "Pix" : "Boleto";

const PAGE_SIZE = 8;

const AdminOrders = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? ADMIN_ORDERS.filter(
          (o) =>
            o.orderNumber.toLowerCase().includes(q) ||
            o.customer.name.toLowerCase().includes(q) ||
            o.customer.email.toLowerCase().includes(q)
        )
      : ADMIN_ORDERS;
    return [...list].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const pageSlice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const summary = useMemo(() => {
    const total = filtered.reduce((s, o) => s + o.total, 0);
    return {
      count: filtered.length,
      total,
      approved: filtered.filter(
        (o) => o.paymentStatus === "approved" || o.paymentStatus === "authorized"
      ).length,
      pending: filtered.filter(
        (o) => o.paymentStatus === "pending" || o.paymentStatus === "in_process"
      ).length,
    };
  }, [filtered]);

  return (
    <>
      <AdminOrderModal
        open={modalOpen}
        onOpenChange={(v) => {
          setModalOpen(v);
          if (!v) setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div className="space-y-1.5">
          <p className="font-heading uppercase tracking-[0.25em] text-[10px] text-gold">
            Operações
          </p>
          <h1 className="font-heading text-2xl md:text-3xl tracking-tight text-foreground">
            Pedidos
          </h1>
          <p className="text-sm text-muted-foreground font-light max-w-xl leading-relaxed">
            Acompanhe o detalhamento de cada pedido, status de pagamento e ações de
            acompanhamento para os clientes.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative w-full md:w-72">
            <Search
              size={16}
              strokeWidth={1.9}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar pedido ou cliente…"
              className="pl-10 h-11 rounded-2xl bg-card/40 border-border/80 focus-visible:ring-gold/30"
            />
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border/80 bg-card/30 backdrop-blur-md">
          <CardContent className="p-4 md:p-5 space-y-1">
            <p className="text-xs text-muted-foreground font-light">Total listado</p>
            <p className="font-heading text-2xl tracking-tight text-foreground">{summary.count}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/80 bg-card/30 backdrop-blur-md">
          <CardContent className="p-4 md:p-5 space-y-1">
            <p className="text-xs text-muted-foreground font-light">Faturamento filtrado</p>
            <p className="font-heading text-2xl tracking-tight text-foreground tabular-nums">
              {formatPrice(summary.total)}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/80 bg-card/30 backdrop-blur-md">
          <CardContent className="p-4 md:p-5 space-y-1">
            <p className="text-xs text-muted-foreground font-light">Pagos ou autorizados</p>
            <p className="font-heading text-2xl tracking-tight text-foreground">{summary.approved}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/80 bg-card/30 backdrop-blur-md">
          <CardContent className="p-4 md:p-5 space-y-1">
            <p className="text-xs text-muted-foreground font-light">Aguardando liquidação</p>
            <p className="font-heading text-2xl tracking-tight text-foreground">{summary.pending}</p>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-3xl border-border/80 bg-card/30 backdrop-blur-md shadow-[0_10px_40px_hsl(var(--gold)/0.04)] overflow-hidden">
        <CardHeader className="p-0" />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-background/40 backdrop-blur-sm">
                <TableRow className="border-border/70 hover:bg-transparent">
                  <TableHead className="text-[11px] uppercase tracking-[0.18em] font-medium text-muted-foreground px-5 py-4 min-w-[180px]">
                    ID do Pedido
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-[0.18em] font-medium text-muted-foreground px-5 py-4 min-w-[240px]">
                    Cliente
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-[0.18em] font-medium text-muted-foreground px-5 py-4 min-w-[150px]">
                    Data
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-[0.18em] font-medium text-muted-foreground px-5 py-4 min-w-[170px]">
                    Status do Pagamento
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-[0.18em] font-medium text-muted-foreground px-5 py-4 text-right min-w-[150px]">
                    Total
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-[0.18em] font-medium text-muted-foreground px-5 py-4 text-right min-w-[120px]">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageSlice.length === 0 ? (
                  <TableRow className="border-transparent">
                    <TableCell colSpan={6} className="py-14 px-5">
                      <div className="text-center space-y-2">
                        <p className="font-heading text-base text-foreground tracking-tight">
                          Nenhum pedido encontrado
                        </p>
                        <p className="text-xs text-muted-foreground font-light max-w-md mx-auto">
                          Tente ajustar a busca pelo nome do cliente ou código do pedido.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pageSlice.map((o) => (
                    <TableRow
                      key={o.orderNumber}
                      className="border-border/60 hover:bg-gold/[0.035] transition-colors"
                    >
                      <TableCell className="px-5 py-4 align-top">
                        <div className="min-w-0 space-y-0.5">
                          <p className="font-mono text-xs md:text-sm tracking-tight text-foreground">
                            {o.orderNumber}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-light">
                            {methodLabel(o.paymentMethod)}
                            {o.installments ? ` · ${o.installments}x` : ""}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 align-top">
                        <div className="min-w-0 space-y-0.5">
                          <p className="text-sm font-medium text-foreground truncate">
                            {o.customer.name}
                          </p>
                          <p className="text-xs text-muted-foreground font-light truncate">
                            {o.customer.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 align-top whitespace-nowrap">
                        <p className="text-sm text-foreground tabular-nums">
                          {new Date(o.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-light tabular-nums">
                          {new Date(o.createdAt).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </TableCell>
                      <TableCell className="px-5 py-4 align-top">
                        <Badge
                          variant={statusVariant[o.paymentStatus]}
                          className={[
                            "border rounded-full h-7 px-3 text-[11px] uppercase tracking-[0.16em] font-medium",
                            statusToneClass[o.paymentStatus],
                            statusVariant[o.paymentStatus] === "default"
                              ? "!bg-gold/10 !border-gold/25 !text-gold shadow-none"
                              : "",
                          ].join(" ")}
                        >
                          {statusLabel[o.paymentStatus]}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 align-top text-right">
                        <p className="font-heading text-sm md:text-base tracking-tight text-foreground tabular-nums">
                          {formatPrice(o.total)}
                        </p>
                        {o.shipping > 0 ? (
                          <p className="text-[11px] text-muted-foreground font-light tabular-nums">
                            Frete + {formatPrice(o.shipping)}
                          </p>
                        ) : (
                          <p className="text-[11px] text-gold/90 font-light">Frete grátis</p>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-4 align-top text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedOrder(o);
                              setModalOpen(true);
                            }}
                            className="h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-background border border-transparent hover:border-border/80"
                            title="Ver detalhes"
                          >
                            <Eye size={17} strokeWidth={1.75} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 md:px-6 border-t border-border/70 bg-background/30">
            <p className="text-xs text-muted-foreground font-light tabular-nums">
              Exibindo {pageSlice.length} de {filtered.length} pedidos · Página {safePage} /{" "}
              {totalPages}
            </p>
            <div className="inline-flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="h-11 w-11 rounded-2xl border-border/80 disabled:opacity-40"
                aria-label="Página anterior"
              >
                <ChevronLeft size={16} strokeWidth={2} />
              </Button>
              <div className="flex items-center gap-1.5 px-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const startPage = Math.max(1, Math.min(totalPages - 4, safePage - 2));
                  const n = startPage + i;
                  const active = n === safePage;
                  return (
                    <Button
                      key={n}
                      variant={active ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(n)}
                      className={[
                        "h-9 min-w-[40px] w-auto px-3 rounded-xl tabular-nums",
                        active
                          ? "bg-gold text-background shadow-[0_4px_14px_hsl(var(--gold)/0.25)] hover:bg-gold/90"
                          : "border-border/80 hover:bg-card/40",
                      ].join(" ")}
                    >
                      {n}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="h-11 w-11 rounded-2xl border-border/80 disabled:opacity-40"
                aria-label="Próxima página"
              >
                <ChevronRight size={16} strokeWidth={2} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default AdminOrders;
