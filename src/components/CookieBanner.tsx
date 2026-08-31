import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Cookie, ChevronRight } from "lucide-react";

const STORAGE_KEY = "soler-cookie-consent-v1";

type ConsentLevel = "all" | "preferences" | null;

interface ConsentValue {
  level: ConsentLevel;
  acceptedAt: number;
}

const readConsent = (): ConsentValue | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentValue;
  } catch {
    return null;
  }
};

const writeConsent = (level: Exclude<ConsentLevel, null>) => {
  const payload: ConsentValue = { level, acceptedAt: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    if (!stored) {
      const t = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(t);
    }
    setAnalytics(stored.level === "all");
    setMarketing(stored.level === "all");
  }, []);

  if (!visible) return null;

  const close = () => setVisible(false);

  const handleAcceptAll = () => {
    writeConsent("all");
    setAnalytics(true);
    setMarketing(true);
    close();
  };

  const handleSavePrefs = () => {
    writeConsent("preferences");
    close();
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed left-0 right-0 bottom-0 z-[9990] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 md:px-6 md:pb-6 md:pt-0 pointer-events-none"
    >
      <div className="pointer-events-auto w-full max-w-6xl mx-auto rounded-3xl border border-border bg-background/80 backdrop-blur-md shadow-[0_-8px_40px_hsl(var(--gold)/0.08)] ring-1 ring-black/5 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-5 md:gap-8 p-5 md:p-8 items-start">
          <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-2">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
              <Cookie size={24} strokeWidth={1.75} />
            </div>
            <div className="md:hidden">
              <h3 className="font-heading text-base md:text-lg tracking-tight text-foreground">
                Utilizamos cookies
              </h3>
              <p className="text-xs text-muted-foreground mt-1 font-light">
                Personalizamos sua experiência.
              </p>
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-4">
            <div className="hidden md:block">
              <h3 className="font-heading text-lg tracking-tight text-foreground">
                Utilizamos cookies para melhorar sua experiência
              </h3>
              <p className="text-sm text-muted-foreground mt-2 font-light leading-relaxed">
                Utilizamos cookies essenciais para o funcionamento do site. Com o seu
                consentimento, também poderemos ativar cookies analíticos e de marketing para
                entender como você navega e lhe enviar ofertas personalizadas. Para saber mais,
                consulte a nossa{" "}
                <a
                  href="/politica-de-privacidade"
                  className="text-gold underline-offset-4 hover:underline transition-opacity"
                >
                  Política de Privacidade
                </a>
                .
              </p>
            </div>
            <div className="md:hidden">
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                Cookies essenciais sempre ativos. Aceite todos para ter uma experiência
                personalizada ou configure suas preferências.
              </p>
            </div>

            {showPrefs ? (
              <div className="rounded-2xl border border-border bg-card/40 p-4 md:p-5 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground">Essenciais</span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-foreground/5 text-muted-foreground">
                      Sempre ativos
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-light">
                    Necessários para o funcionamento do carrinho, checkout e navegação básica.
                  </p>
                </div>
                <div className="h-px bg-border/70" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground">Analíticos</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={analytics}
                      onClick={() => setAnalytics((v) => !v)}
                      className={`w-11 h-6 min-w-[44px] rounded-full relative border transition-colors ${
                        analytics
                          ? "bg-gold/20 border-gold/40"
                          : "bg-card border-border"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full transition-all ${
                          analytics
                            ? "left-6 bg-gold"
                            : "left-1 bg-muted-foreground/40"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground font-light">
                    Permitem medir desempenho e volume de acessos.
                  </p>
                </div>
                <div className="h-px bg-border/70" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground">Marketing</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={marketing}
                      onClick={() => setMarketing((v) => !v)}
                      className={`w-11 h-6 min-w-[44px] rounded-full relative border transition-colors ${
                        marketing
                          ? "bg-gold/20 border-gold/40"
                          : "bg-card border-border"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full transition-all ${
                          marketing
                            ? "left-6 bg-gold"
                            : "left-1 bg-muted-foreground/40"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground font-light">
                    Ofertas personalizadas por e-mail e anúncios remarketing.
                  </p>
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPrefs(false)}
                    className="min-h-[44px] sm:min-h-0"
                  >
                    Voltar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSavePrefs}
                    className="min-h-[44px] sm:min-h-0 bg-foreground text-background hover:bg-foreground/90"
                  >
                    Salvar preferências
                    <ChevronRight size={16} strokeWidth={2} />
                  </Button>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPrefs((v) => !v)}
                className="min-h-[44px] sm:min-h-0 border-border/80"
              >
                <Settings size={16} strokeWidth={1.75} />
                Preferências
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleAcceptAll}
                className="min-h-[44px] sm:min-h-0 bg-gold text-background hover:bg-gold/90 shadow-[0_8px_24px_hsl(var(--gold)/0.25)]"
              >
                Aceitar todos
                <ChevronRight size={16} strokeWidth={2} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
