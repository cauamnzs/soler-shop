import { useState, useEffect, useCallback, FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Mail, Sparkles, Check } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "soler-lead-closed";
const AUTO_OPEN_DELAY_MS = 35000;

const emailSchema = z
  .string()
  .trim()
  .min(1, "Informe seu e-mail.")
  .email("Informe um e-mail válido.");

type LeadPhase = "idle" | "loading" | "success";

const LeadCaptureModal = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<LeadPhase>("idle");
  const { toast } = useToast();

  const closePermanently = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ closedAt: Date.now(), v: 1 }));
    } catch { /* noop */ }
    setOpen(false);
    setEmail("");
    setPhase("idle");
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const trySchedule = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object" && parsed.closedAt) return;
        }
      } catch { /* storage indisponivel, ignora */ }

      timerId = setTimeout(() => {
        if (cancelled) return;
        setOpen(true);
      }, AUTO_OPEN_DELAY_MS);
    };

    trySchedule();

    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePermanently();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    try {
      const control = (window as unknown as { lenisControl?: { stop: () => void; start: () => void } }).lenisControl;
      control?.stop?.();
    } catch { /* noop */ }

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      try {
        const control = (window as unknown as { lenisControl?: { stop: () => void; start: () => void } }).lenisControl;
        control?.start?.();
      } catch { /* noop */ }
    };
  }, [open, closePermanently]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    const parsed = emailSchema.safeParse(trimmed);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message ?? "Informe um e-mail válido.";
      toast({
        title: "E-mail inválido",
        description: firstIssue,
        variant: "destructive",
        duration: 3200,
      });
      return;
    }

    setPhase("loading");
    setTimeout(() => {
      setPhase("success");
      toast({
        title: "Bem-vindo ao Clube VIP",
        description: "Cheque sua caixa de entrada nos próximos minutos para ativar seu acesso exclusivo.",
        duration: 4200,
      });
      setTimeout(() => {
        closePermanently();
      }, 1400);
    }, 650);
  };

  if (typeof document === "undefined") return null;

  return (
    <AnimatePresence mode="wait">
      {open && (
        <div
          className="fixed inset-0 z-[10002] flex items-center justify-center p-4 sm:p-6 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Acesso VIP Soler Shop"
        >
          <motion.div
            key="lead-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.3 }}
            onClick={closePermanently}
            className="absolute inset-0 backdrop-blur-sm bg-background/60 dark:bg-background/80"
          />

          <motion.div
            key="lead-panel"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.25 } }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md sm:max-w-lg overflow-hidden rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl md:backdrop-blur-2xl shadow-[-12px_0_60px_-12px_hsl(var(--charcoal)_/_0.35),0_0_0_1px_hsl(var(--border)_/_0.3)]"
          >
            <button
              onClick={closePermanently}
              aria-label="Fechar"
              className="touch-cta absolute top-4 right-4 z-[10] w-11 h-11 flex items-center justify-center rounded-full bg-background/60 hover:bg-gold/10 text-muted-foreground hover:text-gold border border-border/40 hover:border-gold/30 backdrop-blur-md transition-all duration-300 active:scale-90 shadow-lg"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            <div className="absolute -top-24 -left-20 w-64 h-64 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-28 -right-24 w-72 h-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

            <div className="relative px-6 sm:px-8 py-10 sm:py-12 flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-gold/40 bg-gold/10 backdrop-blur-md flex items-center justify-center mb-6 shadow-[0_0_30px_hsl(var(--gold)_/_0.2)]"
              >
                <Sparkles size={28} className="text-gold" strokeWidth={1.6} />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-body text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-gold/90 mb-3"
              >
                Acesso Exclusivo
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground leading-[1.05] mb-4 break-words"
              >
                Acesso VIP e Ofertas{" "}
                <span className="italic text-gold font-light">Exclusivas Soler</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed max-w-sm mb-8"
              >
                Entre no clube VIP e receba com prioridade os lançamentos de importados, descontos exclusivos e condições especiais para membros.
              </motion.p>

              <motion.form
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.25 }}
                onSubmit={onSubmit}
                className="w-full space-y-3.5"
              >
                <label className="relative block">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    <Mail size={16} strokeWidth={1.6} />
                  </div>
                  <input
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    disabled={phase !== "idle"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className={cn(
                      "w-full h-12 sm:h-14 pl-12 pr-4 rounded-2xl border border-border/60 bg-background/50 backdrop-blur-md text-foreground placeholder:text-muted-foreground/60 font-body text-sm md:text-base min-h-[48px]",
                      "focus:outline-none focus:border-gold focus:bg-background/70 focus:ring-2 focus:ring-gold/25",
                      "transition-all duration-300 ease-lux",
                      "disabled:opacity-60 disabled:cursor-wait"
                    )}
                  />
                </label>

                <Button
                  type="submit"
                  disabled={phase !== "idle"}
                  className={cn(
                    "w-full h-12 sm:h-14 rounded-2xl uppercase tracking-[0.22em] md:tracking-[0.28em] text-[11px] md:text-xs font-bold transition-lux duration-500 ease-lux active:scale-[0.98] group relative overflow-hidden min-h-[48px]",
                    phase === "success"
                      ? "bg-gold text-background shadow-[0_8px_30px_hsl(var(--gold)_/_0.45)]"
                      : "bg-gold text-background shadow-[0_8px_30px_hsl(var(--gold)_/_0.32)] hover:bg-gold-dark hover:shadow-lux-hover"
                  )}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-900 ease-lux pointer-events-none" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {phase === "idle" && "Ativar Meu Acesso VIP"}
                    {phase === "loading" && (
                      <>
                        <svg className="w-4 h-4 animate-spin text-background" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                          <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        Confirmando…
                      </>
                    )}
                    {phase === "success" && (
                      <>
                        <Check size={15} strokeWidth={2.5} />
                        Acesso Ativado
                      </>
                    )}
                  </span>
                </Button>
              </motion.form>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-5 font-body text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-muted-foreground/55"
              >
                Sem spam. Apenas ofertas selecionadas.
              </motion.p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeadCaptureModal;
