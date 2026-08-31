import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { X, User, MapPin, Package, CreditCard, Sparkles, Truck } from "lucide-react";
import type { AdminOrder, AdminOrderPaymentStatus } from "@/data/adminMockData";
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
  approved: "bg-gold/10 border-gold/25 text-gold",
  authorized: "bg-gold/5 border-gold/20 text-gold/80",
  in_process: "bg-foreground/5 border-border text-foreground",
  pending: "bg-card/70 border-border/90 text-foreground/85",
  rejected: "bg-destructive/10 border-destructive/25 text-destructive",
  refunded: "bg-background border-border text-muted-foreground",
  charged_back: "bg-destructive/10 border-destructive/25 text-destructive",
};

const methodLabel = (m: "card" | "pix" | "ticket") =>
  m === "card" ? "Cartão de Crédito" : m === "pix" ? "Pix" : "Boleto Bancário";

const formatCPF = (v: string) =>
  v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const formatPhone = (v: string) => {
  const d = v.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return v;
};

const formatCEP = (v: string) =>
  v.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2");

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

interface AdminOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: AdminOrder | null;
}

const SectionHeader = ({
  icon: Icon,
  title,
}: {
  icon: typeof User;
  title: string;
}) => (
  <div className="flex items-center gap-2.5">
    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold/10 text-gold">
      <Icon size={16} strokeWidth={1.8} />
    </div>
    <h3 className="font-heading text-sm md:text-base uppercase tracking-[0.18em] text-foreground">
      {title}
    </h3>
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-3 py-2">
    <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80 font-medium">
      {label}
    </span>
    <span className="text-sm text-foreground font-normal break-words text-left sm:text-right">
      {value}
    </span>
  </div>
);

const AdminOrderModal = ({ open, onOpenChange, order }: AdminOrderModalProps) => {
  if (!order) return null;

  const createdFormatted = formatDate(order.createdAt);
  const itemsTotal = order.items.reduce((s, i) => s + i.lineTotal, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl md:max-w-3xl p-0 border-border/80 bg-card/40 backdrop-blur-2xl rounded-3xl shadow-[0_30px_120px_hsl(var(--gold)/0.08)]">
        <DialogHeader className="px-5 md:px-8 pt-6 md:pt-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
                <span className="font-heading text-xl md:text-2xl tracking-tight text-foreground truncate">
                  Pedido {order.orderNumber}
                </span>
                <Badge
                  variant={statusVariant[order.paymentStatus]}
                  className={[
                    "w-fit border rounded-full h-7 px-3 text-[10px] uppercase tracking-[0.16em] font-medium",
                    statusToneClass[order.paymentStatus],
                    statusVariant[order.paymentStatus] === "default"
                      ? "!bg-gold/10 !border-gold/25 !text-gold shadow-none"
                      : "",
                  ].join(" ")}
                >
                  {statusLabel[order.paymentStatus]}
                </Badge>
              </DialogTitle>
              <p className="text-xs text-muted-foreground font-light tabular-nums">
                Criado em {createdFormatted} · {methodLabel(order.paymentMethod)}
                {order.paymentMethod === "card" && order.installments
                  ? ` · ${order.installments}x de ${formatPrice(order.installmentValue ?? 0)}`
                  : ""}
                {order.mpPaymentId ? ` · MP ${order.mpPaymentId}` : ""}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-10 w-10 rounded-2xl border border-border/70 text-muted-foreground hover:text-foreground hover:bg-background/80 shrink-0 self-end md:self-auto"
              aria-label="Fechar detalhes"
            >
              <X size={17} strokeWidth={1.75} />
            </Button>
          </div>
        </DialogHeader>

        <Separator className="bg-border/60" />

        <ScrollArea className="max-h-[65vh] md:max-h-[70vh]">
          <div className="px-5 md:px-8 py-6 md:py-7 space-y-8 md:space-y-10">
            <section className="space-y-3">
              <SectionHeader icon={User} title="Cliente" />
              <Card className="rounded-2xl border-border/60 bg-background/30 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-4 md:p-5 divide-y divide-border/40">
                  <InfoRow label="Nome completo" value={order.customer.name} />
                  <InfoRow label="CPF" value={formatCPF(order.customer.cpf)} />
                  <InfoRow label="E-mail" value={order.customer.email} />
                  <InfoRow label="Telefone" value={formatPhone(order.customer.phone)} />
                </CardContent>
              </Card>
            </section>

            <section className="space-y-3">
              <SectionHeader icon={MapPin} title="Endereço de Entrega" />
              <Card className="rounded-2xl border-border/60 bg-background/30 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-4 md:p-5 divide-y divide-border/40">
                  <InfoRow
                    label="Logradouro"
                    value={`${order.address.rua}, ${order.address.numero}${
                      order.address.complemento ? ` · ${order.address.complemento}` : ""
                    }`}
                  />
                  <InfoRow label="Bairro" value={order.address.bairro} />
                  <InfoRow
                    label="Cidade / UF"
                    value={`${order.address.cidade} · ${order.address.uf}`}
                  />
                  <InfoRow label="CEP" value={formatCEP(order.address.cep)} />
                  {order.trackingCode ? (
                    <InfoRow label="Código de rastreio" value={order.trackingCode} />
                  ) : null}
                </CardContent>
              </Card>
            </section>

            <section className="space-y-3">
              <SectionHeader icon={Package} title="Itens do Pedido" />
              <Card className="rounded-2xl border-border/60 bg-background/30 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-3 md:p-4 space-y-2">
                  {order.items.map((it) => (
                    <div
                      key={it.productId}
                      className="flex items-center gap-3 md:gap-4 p-2 rounded-xl hover:bg-foreground/[0.03] transition-colors"
                    >
                      <div className="relative h-14 w-14 md:h-16 md:w-16 shrink-0 rounded-xl border border-border/70 bg-card/50 overflow-hidden">
                        {it.image && it.image !== "/placeholder.svg" ? (
                          <img
                            src={it.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <div className="relative h-full w-full bg-gradient-to-br from-gold/15 via-gold/5 to-transparent">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles
                                  size={18}
                                  strokeWidth={1.4}
                                  className="text-gold/70"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <p className="text-sm font-medium text-foreground truncate">
                          {it.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-light tabular-nums">
                          {it.quantity}× {formatPrice(it.unitPrice)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-heading text-sm tabular-nums text-foreground">
                          {formatPrice(it.lineTotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

            <section className="space-y-3">
              <SectionHeader icon={CreditCard} title="Resumo Financeiro" />
              <Card className="rounded-2xl border-border/60 bg-background/30 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-4 md:p-5 space-y-0.5">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-muted-foreground font-light">
                      Subtotal ({order.items.reduce((s, i) => s + i.quantity, 0)} itens)
                    </span>
                    <span className="text-sm text-foreground tabular-nums">
                      {formatPrice(itemsTotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-muted-foreground font-light">Frete</span>
                    <span
                      className={[
                        "text-sm tabular-nums",
                        order.shipping > 0 ? "text-foreground" : "text-gold font-medium",
                      ].join(" ")}
                    >
                      {order.shipping > 0 ? formatPrice(order.shipping) : "Grátis"}
                    </span>
                  </div>
                  {order.ticketFee > 0 ? (
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-sm text-muted-foreground font-light">
                        Taxa boleto
                      </span>
                      <span className="text-sm text-foreground tabular-nums">
                        {formatPrice(order.ticketFee)}
                      </span>
                    </div>
                  ) : null}
                  <Separator className="my-3 bg-border/60" />
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <Truck size={14} strokeWidth={1.8} className="text-gold" />
                      <span className="font-heading uppercase tracking-[0.18em] text-[11px] text-foreground">
                        Total
                      </span>
                    </div>
                    <span className="font-heading text-lg md:text-xl tracking-tight text-foreground tabular-nums">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </ScrollArea>

        <Separator className="bg-border/60" />

        <DialogFooter className="px-5 md:px-8 py-4 md:py-5 flex-col sm:flex-row gap-2.5 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto h-11 rounded-2xl border-border/80 hover:bg-background/60"
          >
            Fechar
          </Button>
          <Button
            className="w-full sm:w-auto h-11 rounded-2xl bg-gold text-background hover:bg-gold/90 shadow-[0_6px_20px_hsl(var(--gold)/0.22)] active:brightness-90"
          >
            Marcar como Enviado
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminOrderModal;
