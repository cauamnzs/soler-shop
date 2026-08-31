import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "1. Titularidade e Âmbito",
    body: `Esta Política de Privacidade é mantida pela Soler Shop Importados, pessoa jurídica de direito privado, inscrita sob o CNPJ informado no rodapé do site, com sede na localidade também divulgada no rodapé. Ela se aplica a todas as interações que você realiza em nosso site, aplicativos, atendimentos por WhatsApp, e-mail e formulários de contato, incluindo navegação anônima e checkout de compras.`,
  },
  {
    title: "2. Dados Coletados e Finalidades",
    body: `Coletamos estritamente os dados necessários para o cumprimento do contrato de venda e atendimento ao cliente, observando os princípios da Lei Geral de Proteção de Dados (Lei nº 13.709/2019). Entre eles: (a) identificação: nome completo, CPF, endereço de e-mail, telefone celular; (b) entrega: CEP, rua, número, complemento, bairro, cidade e unidade federativa; (c) transacional: histórico de pedidos, método e status de pagamento (nunca armazenamos número completo de cartão, CVV ou senha — a tokenização é de responsabilidade do Mercado Pago); (d) navegação: cookies essenciais, analíticos e de marketing, mediante o seu consentimento obtido no banner de cookies.`,
  },
  {
    title: "3. Base Legal e Tratamento",
    body: `Os seus dados são tratados com base em: (I) execução de contrato de compra e venda; (II) cumprimento de obrigação legal (ex.: emissão de nota fiscal, solicitações de autoridades fiscais); (III) legítimo interesse (ex.: recuperação de carrinho abandonado, envio de atualização de pedido por WhatsApp ou e-mail); e (IV) consentimento explícito do titular (ex.: marketing, cookies analíticos e remarketing).`,
  },
  {
    title: "4. Compartilhamento com Terceiros",
    body: `Seus dados pessoais podem ser compartilhados apenas com os parceiros necessários à operação: (a) Mercado Pago — para processamento de pagamento e prevenção a fraudes; (b) transportadoras e correios — para etiqueta de envio e rastreabilidade; (c) plataformas de e-mail transacional — para envio de confirmações e atualizações. Em qualquer hipótese, exigimos que os parceiros adotem cláusulas de confidencialidade e conformidade com a LGPD.`,
  },
  {
    title: "5. Retenção e Segurança",
    body: `Armazenamos seus dados apenas pelo período necessário ao cumprimento das finalidades elencadas, respeitando prazos legais de guarda (ex.: 5 anos para notas fiscais, conforme RFB). A segurança técnica adotada compreende criptografia em trânsito (HTTPS/TLS 1.2+), tokens no lugar de dados sensíveis de cartão, princípio do mínimo privilégio nos acessos internos e monitoramento contínuo de vulnerabilidades.`,
  },
  {
    title: "6. Direitos do Titular",
    body: `Você pode, a qualquer momento e sem ônus, exercer os seus direitos de: confirmação da existência de tratamento, acesso aos dados, correção de dados incompletos ou inexatos, anonimização ou eliminação de dados desnecessários, portabilidade, eliminação ou revogação de consentimento, bem como oposição ao tratamento. Para exercer qualquer direito, contate nosso Encarregado de Proteção de Dados no e-mail institucional, informando no assunto “LGPD — Solicitação”.`,
  },
  {
    title: "7. Alterações desta Política",
    body: `Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças legislativas, novas funcionalidades ou práticas comerciais. A versão vigente sempre estará publicada nesta página, com a data de última atualização indicada ao final. Caso a alteração seja material, notificaremos você por e-mail ou por aviso proeminente no site.`,
  },
  {
    title: "8. Contato",
    body: `Dúvidas, questionamentos ou solicitações ligadas à proteção de dados pessoais devem ser encaminhadas ao canal de atendimento oficial do Soler Shop, disponível na seção “Conecte-se” do rodapé deste site.`,
  },
];

const PrivacyPolicy = () => {
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
            <Shield size={26} strokeWidth={1.75} />
          </div>
          <div className="space-y-2">
            <p className="font-heading uppercase tracking-[0.25em] text-xs text-gold">
              Conformidade & Transparência
            </p>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl tracking-tight text-foreground leading-[1.05]">
              Política de Privacidade
            </h1>
            <p className="font-body text-sm md:text-base text-muted-foreground font-light max-w-2xl">
              Esta página descreve como coletamos, armazenamos, tratamos e protegemos os seus
              dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD).
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

export default PrivacyPolicy;
