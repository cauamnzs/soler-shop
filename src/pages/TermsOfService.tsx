import { Link } from "react-router-dom";
import { ArrowLeft, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "1. Objeto e Aceite",
    body: `Os presentes Termos de Uso regulamentam o acesso e a contratação de produtos pelo Soler Shop Importados por pessoas físicas, em caráter exclusivamente pessoal e não comercial. Ao navegar, criar conta, cadastrar e-mail, adicionar itens ao carrinho ou finalizar uma compra, você manifesta seu aceite irrestrito e irrevogável a todas as disposições abaixo, bem como à Política de Privacidade e à Política de Trocas e Devoluções deste site.`,
  },
  {
    title: "2. Serviços e Produtos",
    body: `O Soler Shop comercializa cosméticos importados, perfumaria, acessórios e kits de presente, cuidadosamente selecionados. As descrições, imagens e valores apresentados em cada página de produto são meramente ilustrativos e atualizados com a maior frequência possível. Todas as fotos são de propriedade do Soler Shop, estando protegidas pela Lei 9.610/98 (Direitos Autorais) — proibida qualquer reprodução sem autorização prévia e por escrito.`,
  },
  {
    title: "3. Preços e Promoções",
    body: `Os preços dos produtos e do frete são exibidos em Real brasileiro (R$) e incluem todos os impostos incidentes sobre a venda ao consumidor final, salvo disposição em contrário. Cupons de desconto, cashback e promoções são cumulativos apenas quando expressamente informado na campanha. Reservamo-nos o direito de corrigir eventuais erros de digitação ou falhas de sistema em valores, sem qualquer responsabilidade antes da confirmação definitiva do pedido pelo pagamento.`,
  },
  {
    title: "4. Contrato de Compra e Venda",
    body: `A aquisição de produtos configura contrato de compra e venda bilateral, perfeito e oneroso, celebrado nas seguintes etapas: (I) seleção de itens e adição ao carrinho; (II) preenchimento dos dados pessoais e de entrega; (III) escolha da forma de pagamento e confirmação; (IV) aprovação do pagamento pelo provedor. A transmissão da confirmação do pagamento é considerada o marco de aceitação contratual pelo Soler Shop, sendo o consumidor cientificado por meio do e-mail cadastrado.`,
  },
  {
    title: "5. Pagamento e Parcelamento",
    body: `As formas de pagamento disponíveis são: cartão de crédito (Visa, Mastercard, Elo e demais bandeiras aceitas pelo Mercado Pago), Pix e Boleto Bancário. Para cartão de crédito, o parcelamento mínimo e máximo é informado em tela no momento do checkout, com incidência de juros conforme taxa vigente. Em nenhum caso a aprovação do pagamento é garantida, podendo ser recusada por políticas internas de prevenção a fraudes.`,
  },
  {
    title: "6. Entrega e Rastreamento",
    body: `O prazo de entrega é contado em dias úteis, a partir da confirmação do pagamento, e varia conforme região do CEP informado. O frete é gratuito para compras com valor igual ou superior ao limite vigente no site. Em caso de ausência de pessoa capaz de receber no endereço indicado, a transportadora realizará até 3 (três) tentativas de entrega, retornando o produto à central de distribuição, sem ônus para o Soler Shop.`,
  },
  {
    title: "7. Responsabilidade do Consumidor",
    body: `Cabe ao usuário: (a) manter a veracidade, atualidade e segurança dos dados de cadastro, em especial e-mail, senha, endereço e telefone; (b) tomar as devidas providências de segurança em seu ambiente de acesso ao site (antivírus, firewall, senhas robustas); (c) conferir as informações do pedido e do endereço antes da finalização da compra; (d) respeitar os direitos de propriedade intelectual do Soler Shop e de seus parceiros.`,
  },
  {
    title: "8. Limitação de Responsabilidade",
    body: `Nas hipóteses de caso fortuito, força maior, instabilidade de rede de internet, indisponibilidade temporária do provedor de pagamento ou falha de provedores terceirizados sem culpa do Soler Shop, não haverá responsabilidade contratual, ressarcimento ou indenização por eventuais danos indiretos, lucros cessantes, dano moral ou lucratividade. O nosso compromisso se limita ao objeto do contrato de compra e venda no limite do valor do pedido.`,
  },
  {
    title: "9. Foro e Legislação Aplicável",
    body: `Este contrato integral é regido e interpretado pela legislação brasileira, em especial pelo Código de Defesa do Consumidor (Lei nº 8.078/90), pelo Código Civil e pela LGPD. Qualquer controvérsia emergente será solucionada pelo foro da comarca do domicílio do Soler Shop Importados, com renúncia expressa a qualquer outro, por mais privilegiado que seja.`,
  },
];

const TermsOfService = () => {
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
            <Scale size={26} strokeWidth={1.75} />
          </div>
          <div className="space-y-2">
            <p className="font-heading uppercase tracking-[0.25em] text-xs text-gold">
              Contrato Digital
            </p>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl tracking-tight text-foreground leading-[1.05]">
              Termos de Uso
            </h1>
            <p className="font-body text-sm md:text-base text-muted-foreground font-light max-w-2xl">
              Regras que regem a relação contratual entre você e o Soler Shop em suas
              interações e compras no site.
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

export default TermsOfService;
