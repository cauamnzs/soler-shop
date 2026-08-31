import { useState } from "react";
import { Check, Info, Shield, Truck, CreditCard, Mail, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/price";
import {
  FREE_SHIPPING_THRESHOLD_BRL,
  SHIPPING_FLAT_RATE_BRL,
  TICKET_FEE_BRL,
} from "@/schemas/checkout";

const SettingsIconCard = ({
  icon: Icon,
  title,
  desc,
  status,
}: {
  icon: typeof Shield;
  title: string;
  desc: string;
  status?: string;
}) => (
  <Card className="rounded-3xl border-border/80 bg-card/30 backdrop-blur-md shadow-[0_10px_40px_hsl(var(--gold)/0.04)]">
    <CardHeader className="flex-row items-start gap-4 pb-3 pt-5 px-5">
      <div className="w-11 h-11 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center text-gold shrink-0">
        <Icon size={19} strokeWidth={1.75} />
      </div>
      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading text-base tracking-tight text-foreground">{title}</h3>
          {status ? (
            <Badge
              variant="outline"
              className="h-6 rounded-full border-gold/25 bg-gold/10 text-gold text-[10px] uppercase tracking-[0.2em]"
            >
              {status}
            </Badge>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground font-light leading-relaxed">{desc}</p>
      </div>
    </CardHeader>
  </Card>
);

const AdminSettings = () => {
  const [tab, setTab] = useState("general");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const handleSave = () => {
    setSavedAt(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
  };

  return (
    <div className="space-y-7">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div className="space-y-1.5">
          <p className="font-heading uppercase tracking-[0.25em] text-[10px] text-gold">
            Sistema
          </p>
          <h1 className="font-heading text-2xl md:text-3xl tracking-tight text-foreground">
            Configurações
          </h1>
          <p className="text-sm text-muted-foreground font-light max-w-xl leading-relaxed">
            Visualize e gerencie os principais parâmetros operacionais da loja. A edição
            definitiva estará disponível após integração com o Supabase.
          </p>
        </div>
        <Breadcrumb className="text-[11px] tracking-wide text-muted-foreground">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Versão atual · v1.1.0</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        <SettingsIconCard
          icon={Shield}
          title="Autenticação"
          desc="Sessões simuladas em localStorage. Trocar para Supabase Auth em produção."
          status="Mock"
        />
        <SettingsIconCard
          icon={CreditCard}
          title="Mercado Pago"
          desc="SDK v2 injetado client-side e endpoints serverless publicados na Vercel."
          status="Ativo"
        />
        <SettingsIconCard
          icon={Truck}
          title="Regras de frete"
          desc={`Valor fixo ${formatPrice(SHIPPING_FLAT_RATE_BRL)} · Grátis acima de ${formatPrice(
            FREE_SHIPPING_THRESHOLD_BRL
          )}.`}
          status="Ativo"
        />
        <SettingsIconCard
          icon={Mail}
          title="Boleto bancário"
          desc={`Taxa fixa: ${formatPrice(TICKET_FEE_BRL)} por operação, cobrada no checkout.`}
          status="Ativo"
        />
      </section>

      <Card className="rounded-3xl border-border/80 bg-card/30 backdrop-blur-md shadow-[0_10px_40px_hsl(var(--gold)/0.04)] overflow-hidden">
        <CardHeader className="border-b border-border/70 px-5 md:px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="space-y-1">
              <h2 className="font-heading text-lg tracking-tight text-foreground">
                Preferências da loja
              </h2>
              <p className="text-xs text-muted-foreground font-light">
                Campos leitura por enquanto. Integração Supabase liberará edição persistente.
              </p>
            </div>
            {savedAt ? (
              <Badge
                variant="outline"
                className="h-8 rounded-full border-gold/25 bg-gold/10 text-gold text-[11px] uppercase tracking-[0.2em] w-fit"
              >
                <Check size={13} strokeWidth={2} className="mr-1.5" />
                Salvo às {savedAt}
              </Badge>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <div className="px-5 md:px-6 pt-5">
              <TabsList className="h-11 w-full md:w-auto rounded-2xl border border-border/80 bg-background/50 p-1">
                <TabsTrigger
                  value="general"
                  className="h-9 rounded-xl data-[state=active]:bg-gold data-[state=active]:text-background"
                >
                  Geral
                </TabsTrigger>
                <TabsTrigger
                  value="shipping"
                  className="h-9 rounded-xl data-[state=active]:bg-gold data-[state=active]:text-background"
                >
                  Frete & Pagamento
                </TabsTrigger>
                <TabsTrigger
                  value="channels"
                  className="h-9 rounded-xl data-[state=active]:bg-gold data-[state=active]:text-background"
                >
                  Canais
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="general" className="p-5 md:p-6 mt-4 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="storeName" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Nome da loja
                  </Label>
                  <Input
                    id="storeName"
                    defaultValue="Soler Shop Importados"
                    readOnly
                    className="h-12 rounded-2xl bg-card/50 border-border/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Sede
                  </Label>
                  <Input
                    id="location"
                    defaultValue="Santos / Ilhabela — Envio Nacional"
                    readOnly
                    className="h-12 rounded-2xl bg-card/50 border-border/80"
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-gold/20 bg-gold/[0.04] p-4 flex gap-3 items-start">
                <Info size={17} strokeWidth={1.75} className="text-gold shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  Este módulo está preparado para persistência em Supabase. A próxima etapa
                  habilita edição real com validação de campos e auditoria por usuário admin.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="p-5 md:p-6 mt-4 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="freeThreshold" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Limite frete grátis
                  </Label>
                  <Input
                    id="freeThreshold"
                    defaultValue={formatPrice(FREE_SHIPPING_THRESHOLD_BRL)}
                    readOnly
                    className="h-12 rounded-2xl bg-card/50 border-border/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flatRate" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Frete fixo (abaixo do limite)
                  </Label>
                  <Input
                    id="flatRate"
                    defaultValue={formatPrice(SHIPPING_FLAT_RATE_BRL)}
                    readOnly
                    className="h-12 rounded-2xl bg-card/50 border-border/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticket" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Taxa boleto
                  </Label>
                  <Input
                    id="ticket"
                    defaultValue={formatPrice(TICKET_FEE_BRL)}
                    readOnly
                    className="h-12 rounded-2xl bg-card/50 border-border/80"
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/40 p-4 flex gap-3 items-start">
                <Shield size={17} strokeWidth={1.75} className="text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  As regras de negócio também são validadas e recalculadas server-side dentro
                  de <span className="font-mono text-[11px] bg-card/60 px-1.5 py-0.5 rounded">computeServerTotals</span>,
                  independentemente de qualquer valor enviado pelo cliente.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="channels" className="p-5 md:p-6 mt-4 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    WhatsApp
                  </Label>
                  <div className="relative">
                    <Smartphone size={16} strokeWidth={1.8} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="whatsapp"
                      defaultValue="+55 (13) 99123-4567"
                      readOnly
                      className="h-12 pl-11 rounded-2xl bg-card/50 border-border/80"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailAdmin" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    E-mail institucional
                  </Label>
                  <div className="relative">
                    <Mail size={16} strokeWidth={1.8} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="emailAdmin"
                      defaultValue="contato@solershop.com.br"
                      readOnly
                      className="h-12 pl-11 rounded-2xl bg-card/50 border-border/80"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 px-5 md:px-6 pb-5 md:pb-6 border-t border-border/70 pt-4">
            <Button
              variant="outline"
              size="sm"
              className="h-11 rounded-2xl border-border/80"
              disabled
            >
              Restaurar padrões
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
              className="h-11 rounded-2xl bg-gold text-background hover:bg-gold/90 shadow-[0_10px_28px_hsl(var(--gold)/0.25)]"
            >
              <Check size={15} strokeWidth={2} />
              Salvar configurações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
