import { useEffect, lazy, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Truck, Zap, MessageCircle, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProductById } from "@/hooks/useProductById";
import { getWhatsAppLink } from "@/lib/envConfig";

const AddToCartButton = lazy(() => import("@/components/AddToCartButton"));

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, isError, isNotFound } = useProductById(id);

  useEffect(() => {
    if (product?.name) {
      document.title = `${product.name} — Soler Shop`;
    } else if (!isLoading) {
      document.title = "Produto — Soler Shop";
    }
  }, [product?.name, isLoading]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [id]);

  const handleWhatsAppClick = () => {
    if (!product) return;
    try { navigator.vibrate?.(12); } catch {}
    const message = `Olá! Gostaria de consultar a disponibilidade do ${product.name} (Ref: ${product.id}) que vi no site Soler Shop.`;
    window.open(getWhatsAppLink(message), "_blank");
  };

  const Skeleton = () => (
    <div className="max-w-6xl mx-auto section-padding py-16 md:py-24">
      <div className="animate-shimmer aspect-[4/3] md:aspect-[5/4] w-full rounded-2xl mb-12" />
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="animate-shimmer h-5 w-40 rounded-full mb-5" />
          <div className="animate-shimmer h-12 w-3/4 rounded-lg mb-5" />
          <div className="animate-shimmer h-8 w-1/3 rounded-lg mb-8" />
          <div className="space-y-3">
            <div className="animate-shimmer h-4 w-full rounded" />
            <div className="animate-shimmer h-4 w-11/12 rounded" />
            <div className="animate-shimmer h-4 w-10/12 rounded" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="animate-shimmer h-56 rounded-xl" />
          <div className="animate-shimmer h-14 rounded-xl" />
        </div>
      </div>
    </div>
  );

  const NotFoundState = () => (
    <div className="max-w-3xl mx-auto section-padding py-24 md:py-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
          <ShoppingBag size={32} strokeWidth={1.5} />
        </div>
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 leading-tight">
          Produto <span className="italic text-gold font-light">não encontrado</span>
        </h1>
        <p className="font-body text-muted-foreground text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed font-light">
          O produto que você procura não está mais disponível ou o link está incorreto.
          Confira nosso catálogo completo para descobrir novas joias olfativas.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/#products"
            className="touch-cta group inline-flex items-center gap-3 bg-gold text-background px-8 py-4 rounded-xl uppercase tracking-[0.22em] font-semibold text-[11px] md:text-sm hover:shadow-lux-hover active:brightness-90 active:scale-[0.97] transition-all duration-500"
          >
            Explorar Catálogo
            <span className="text-base leading-none font-light group-hover:translate-x-1 transition-transform duration-500 ease-lux">→</span>
          </Link>
          <Link
            to="/"
            className="touch-cta inline-flex items-center gap-3 border border-gold/50 text-gold px-8 py-4 rounded-xl uppercase tracking-[0.22em] font-semibold text-[11px] md:text-sm hover:bg-gold hover:text-background active:scale-[0.97] transition-all duration-500 ease-lux"
          >
            <ArrowLeft size={16} />
            Voltar à Home
          </Link>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen relative bg-background selection:bg-gold/20 overflow-x-hidden">
      <Header />

      <main className="relative z-10">
        {isLoading ? (
          <Skeleton />
        ) : isError ? (
          <div className="max-w-3xl mx-auto section-padding py-24 text-center">
            <p className="font-body text-destructive uppercase tracking-[0.2em] mb-4">
              Falha ao carregar o produto
            </p>
            <Link
              to="/#products"
              className="inline-flex items-center gap-3 border border-gold/50 text-gold px-8 py-4 rounded-xl uppercase tracking-[0.22em] font-semibold text-xs hover:bg-gold hover:text-background transition-all duration-500 ease-lux"
            >
              Tentar catálogo
            </Link>
          </div>
        ) : isNotFound || !product ? (
          <NotFoundState />
        ) : (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative py-10 md:py-16 lg:py-20"
          >
            <div className="max-w-6xl mx-auto section-padding relative z-10">
              {/* Breadcrumb / Voltar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-8 md:mb-12"
              >
                <Link
                  to="/#products"
                  className="touch-cta group inline-flex items-center gap-2 text-muted-foreground font-body text-[10px] md:text-xs uppercase tracking-[0.28em] hover:text-gold transition-colors duration-500 active:text-gold active:opacity-80"
                >
                  <ArrowLeft size={14} strokeWidth={1.8} className="group-hover:-translate-x-1 transition-transform duration-500 ease-lux" />
                  Catálogo completo
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="grid lg:grid-cols-2 gap-6 md:gap-10 lg:gap-16 items-start"
              >
                {/* Coluna da Imagem */}
                <div className="relative aspect-[4/3] md:aspect-[5/4] overflow-hidden bg-secondary/5 rounded-2xl md:rounded-3xl border border-border/50 md:border-border/30 shadow-xl">
                  <motion.img
                    initial={{ scale: 1.06 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                    src={product.image}
                    alt={`Imagem do produto ${product.name}`}
                    width={800}
                    height={800}
                    className="w-full h-full object-cover object-center"
                  />
                  {product.tag && (
                    <motion.span
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="absolute top-5 left-5 md:top-6 left-6 backdrop-blur-md text-[10px] md:text-xs font-body font-bold uppercase tracking-[0.22em] px-4 py-2 md:px-5 md:py-2.5 rounded-full border bg-card/90 text-foreground shadow-lg"
                    >
                      {product.tag === "Novo" ? (
                        <span className="inline-flex items-center gap-1.5 text-gold border-gold/25 bg-gold/10 px-4 py-2">
                          Novo<span className="text-[7px] animate-pulse opacity-60">&bull;</span>
                        </span>
                      ) : product.tag === "Limitado" ? (
                        <span className="bg-gold/20 border-gold/30 text-gold px-4 py-2 inline-flex items-center">
                          {product.tag}
                        </span>
                      ) : (
                        product.tag
                      )}
                    </motion.span>
                  )}
                </div>

                {/* Coluna de Conteúdo */}
                <div className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] overflow-y-auto lg:overscroll-contain pr-0 lg:pr-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col justify-center py-2"
                  >
                    <div className="mb-6 md:mb-8">
                      <span className="text-gold font-body text-[10px] md:text-xs uppercase tracking-[0.4em] mb-3 md:mb-5 block opacity-60">
                        {product.category} — Ref: {product.id}
                      </span>
                      <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground mb-5 md:mb-7 leading-[1.05] break-words line-clamp-2 lg:line-clamp-none">
                        {product.name}
                      </h1>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-body font-semibold text-gradient-gold mb-5 md:mb-8">
                        {product.price}
                      </p>
                      <p className="font-body text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed font-light line-clamp-4 md:line-clamp-none">
                        {product.description}
                      </p>
                    </div>

                    {/* Gatilhos de Escassez e Confiança */}
                    <div className="grid grid-cols-1 gap-3 md:gap-4 mb-8 md:mb-10">
                      <div className="flex items-center gap-4 text-muted-foreground/60">
                        <ShieldCheck size={18} className="text-gold shrink-0" strokeWidth={1.5} />
                        <span className="text-xs uppercase tracking-widest font-body">Autenticidade 100% Garantida</span>
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground/60">
                        <Truck size={18} className="text-gold shrink-0" strokeWidth={1.5} />
                        <span className="text-xs uppercase tracking-widest font-body">Entrega White-Glove Segura</span>
                      </div>
                      <div className="flex items-center gap-4 text-destructive/80 font-medium">
                        <Zap size={18} strokeWidth={1.5} className="shrink-0" />
                        <span className="text-xs uppercase tracking-widest font-body animate-pulse">Últimas unidades em estoque</span>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col gap-3 md:gap-4 mb-8 md:mb-10">
                      <Suspense fallback={null}>
                        <AddToCartButton product={product} variant="primary" />
                      </Suspense>

                      <button
                        onClick={handleWhatsAppClick}
                        className="group relative flex items-center justify-center gap-3 border-2 border-gold/40 text-gold w-full py-4.5 md:py-5 rounded-xl uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold text-[11px] md:text-xs transition-all duration-500 hover:border-gold hover:bg-gold hover:text-background hover:shadow-gold-glow hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <MessageCircle size={18} />
                        Consultar no WhatsApp
                        <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left rounded-xl pointer-events-none" />
                      </button>
                    </div>

                    <p className="text-center text-[9px] text-muted-foreground uppercase tracking-widest opacity-40">
                      Entrega nacional • Embalagem premium contra impactos
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </main>

      <Suspense fallback={<div style={{ minHeight: "16rem" }} />}>
        <Footer />
      </Suspense>

      {/* Mobile Sticky CTA Bar */}
      <div
        className="md:hidden fixed bottom-3 left-3 right-3 z-[9960] rounded-2xl border border-border/15 bg-background/90 dark:bg-background/95 backdrop-blur-xl shadow-2xl p-2"
        style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
      >
        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/#products"
            onClick={() => { try { navigator.vibrate?.(6); } catch {} }}
            className="touch-cta inline-flex items-center justify-center rounded-xl py-3.5 text-[10px] uppercase tracking-[0.22em] font-body text-foreground border border-foreground/15 bg-foreground/[0.04] active:scale-[0.96] active:bg-foreground/[0.08] transition-transform duration-75 min-h-[44px]"
          >
            Ver Cat&aacute;logo
          </Link>
          <a
            href={product ? getWhatsAppLink(`Ol&aacute;! Gostaria de consultar a disponibilidade do ${product.name} (Ref: ${product.id}) que vi no site Soler Shop.`) : getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { try { navigator.vibrate?.(10); } catch {} }}
            className="touch-cta inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-[10px] uppercase tracking-[0.22em] font-body text-background bg-gold active:scale-[0.96] active:brightness-90 transition-transform duration-75 shadow-[0_2px_12px_rgba(212,175,55,0.35)] min-h-[44px]"
          >
            <MessageCircle size={14} strokeWidth={1.7} />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
