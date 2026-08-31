import { lazy, Suspense, useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";

const FluidBackground = lazy(() => import("@/components/FluidBackground"));
const Spotlight = lazy(() => import("@/components/Spotlight"));
const CustomCursor = lazy(() => import("@/components/CustomCursor"));

const GlobalShell = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      {/* Scroll Progress Bar — Global */}
      {isDesktop && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-dark via-gold to-gold-light z-[9965] origin-left pointer-events-none"
          style={{ scaleX: scrollYProgress }}
        />
      )}

      {/* Fundo Líquido Vivo — desktop only */}
      {isDesktop && (
        <Suspense fallback={null}>
          <FluidBackground />
        </Suspense>
      )}

      {/* Lanterna do Mouse (Spotlight) — desktop only */}
      {isDesktop && (
        <Suspense fallback={null}>
          <Spotlight />
        </Suspense>
      )}

      {/* Cursor Personalizado — desktop only */}
      {isDesktop && (
        <Suspense fallback={null}>
          <CustomCursor />
        </Suspense>
      )}

      {/* Overlay de Grain Global — desktop only */}
      {isDesktop && (
        <div
          className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.025] dark:opacity-[0.012] mix-blend-overlay dark:mix-blend-soft-light"
          style={{
            backgroundImage:
              `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}
    </>
  );
};

export default GlobalShell;
