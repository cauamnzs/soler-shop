import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "1. Direito de Arrependimento (Art. 49 CDC)",
    body: `Conforme dispõe o Código de Defesa do Consumidor (Lei nº 8.078/90), você tem 7 (sete) dias corridos, contados da data do recebimento do produto ou da assinatura do contrato, para exercer o seu direito de arrependimento da compra realizada pela internet. Nessa hipótese, o Soler Shop providenciará o reembolso integral do valor pago, incluindo o frete pago, observado o estado de conservação dos itens devolvidos.`,
  },
  {
    title: "2. Troca por Defeito de Fabricação",
    body: `Em caso de produto com vício ou defeito de fabricação, e encerrado o prazo de arrependimento, a troca pode ser solicitada em até 30 (trinta) dias corridos após o recebimento, para cosméticos em geral e acessórios; e em até 90 (noventa) dias corridos para produtos com garantia expressa. O consumidor deve apresentar o pedido original, fotos do defeito e a nota fiscal. Produtos lacrados ou higienicamente selados NÃO são aceitos para troca após rompimento do lacre, em respeito à Anvisa e à saúde coletiva.`,
  },
  {
    title: "3. Condições de Devolução",
    body: `Para que a devolução seja autorizada, o produto deve estar: (a) em sua embalagem original, intacta e sem sinais de uso indevido; (b) acompanhado de nota fiscal, manual e acessórios, se houver; (c) sem danos causados por mau uso, exposição solar excessiva, queda ou negligência. Produtos importados lacrados que tenham seu selo inviolável rompido não poderão ser devolvidos, ressalvado defeito de fabricação evidente comunicado antes do uso.`,
  },
  {
    title: "4. Passo a Passo da Solicitação",
    body: `(I) Contate nosso atendimento oficial (WhatsApp ou e-mail) informando número do pedido, motivo da troca/devolução e, se aplicável, fotos nítidas do item e da embalagem. (II) Nosso time analisará sua solicitação em até 3 (três) dias úteis, enviando a autorização de postagem e o código de logística reversa quando cabível. (III) Você despachará o produto em até 5 (cinco) dias úteis após a autorização. (IV) Confirmado o recebimento e aprovada a integridade do item, efetivaremos o crédito ou a troca em até 7 (sete) dias úteis.`,
  },
  {
    title: "5. Logística Reversa",
    body: `Nas hipóteses de direito de arrependimento e defeito de fabricação, o frete de retorno (logística reversa) é de responsabilidade exclusiva do Soler Shop, nos termos do CDC. Caso o consumidor solicite troca por motivo exclusivamente de preferência pessoal (ex.: tamanho, cor, fragrância), o custo do envio de ida e de volta será suportado pelo cliente, salvo campanha promocional expressa.`,
  },
  {
    title: "6. Formas de Reembolso",
    body: `Pagamento em Pix e Boleto: o valor integral é devolvido na conta corrente ou poupança informada pelo titular em até 2 (dois) dias úteis após a confirmação da devolução. Pagamento em Cartão de Crédito: o estorno é processado junto à operadora do cartão, de acordo com a política da bandeira, podendo aparecer em até 2 (duas) faturas subsequentes.`,
  },
  {
    title: "7. Casos Excluídos de Troca ou Reembolso",
    body: `Não serão objeto de troca ou reembolso: (a) produtos com sinais de uso ou exposição indevida; (b) embalagens rompidas em itens de higiene pessoal, cosméticos e perfumaria após o lacre; (c) amostras grátis, brindes ou produtos adquiridos em liquidação expressa (comunicada como “sem troca”); (d) qualquer alteração estética ou fisiológica na pele do usuário sem vício do produto, pois cada organismo responde de maneira individual aos cosméticos.`,
  },
  {
    title: "8. Canais de Atendimento",
    body: `Nossa equipe de atendimento está à disposição por WhatsApp e e-mail institucional, de segunda a sexta-feira, em horário comercial publicado no rodapé do site. Respostas a solicitações de troca e reembolso seguem o prazo máximo de 3 dias úteis para início de tratamento.`,
  },
];

const RefundPolicy = () => {
  const today = new Date();
  const lastUpdate = `${today.toLocaleDateString("pt-BR", { day: "2-digit" })} de ${today.toLocaleDateString("pt-BR", { month: "long" })} de ${today.getFullYear()}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent z-20" />
      <div className="max-w-3xl mx-auto section-padding py-14 md:py-20">
        <div className="mb-8">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="min-h-[44px] -ml-2 text-muted-foreground hover:text-foreground hover:bg-card/40"
          >
            <Link to="/">
              <ArrowLeft size={16} strokeWidth={2} />
              Voltar para o início
            </Link>
          </Button>
        </div>

        <header className="mb-10 md:mb-14 space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            <RefreshCcw size={26} strokeWidth={1.75} />
          </div>
          <div className="space-y-2">
            <p className="font-heading uppercase tracking-[0.25em] text-xs text-gold">
              Transparência e Confiança
            </p>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl tracking-tight text-foreground leading-[1.05]">
              Trocas e Devoluções
            </h1>
            <p className="font-body text-sm md:text-base text-muted-foreground font-light max-w-2xl">
              Conheça os direitos, prazos e regras para troca e devolução dos seus produtos
              Soler Shop.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-1 text-xs text-muted-foreground font-light">
            <span className="px-3 py-1.5 rounded-full border border-border bg-card/40">
              Última atualização: {lastUpdate}
            </span>
            <span className="px-3 py-1.5 rounded-full border border-border bg-card/40">
              Versão 1.1
            </span>
          </div>
        </header>

        <article className="space-y-10 md:space-y-12">
          {sections.map((sec) => (
            <section
              key={sec.title}
              className="rounded-3xl border border-border bg-card/20 backdrop-blur-sm p-6 md:p-8 shadow-[0_8px_32px_hsl(var(--gold)/0.04)]"
            >
              <h2 className="font-heading text-xl md:text-2xl tracking-tight text-foreground mb-4">
                {sec.title}
              </h2>
              <p className="font-body text-[15px] md:text-base text-foreground/85 leading-[1.85] font-light">
                {sec.body}
              </p>
            </section>
          ))}
        </article>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
