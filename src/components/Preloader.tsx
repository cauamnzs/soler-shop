import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import solerLogo from "@/assets/soler-logo.png";

// Letter-by-letter reveal animation
const LetterReveal = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const letters = useMemo(() => text.split(""), [text]);
  
  return (
    <span className="inline-flex overflow-hidden">
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ y: 50, opacity: 0, rotateX: -90 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.04,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
          style={{ transformOrigin: "bottom" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  );
};

// Organic progress indicator
const OrganicProgress = ({ progress }: { progress: number }) => {
  return (
    <div className="relative w-64 h-[2px] bg-white/5 overflow-hidden">
      {/* Base glow line */}
      <motion.div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold via-gold-light to-gold"
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "400%" }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 0.5,
        }}
      />
      
      {/* End glow */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold blur-sm"
        animate={{
          opacity: progress > 5 ? [0.4, 1, 0.4] : 0,
          scale: progress > 5 ? [1, 1.2, 1] : 0,
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
  );
};

const Preloader = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"entering" | "loading" | "exiting">("entering");

  useEffect(() => {
    // Organic loading simulation — shorter on mobile for better UX
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const duration = isMobile ? 2000 : 3500;
    const startTime = Date.now();
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min((elapsed / duration) * 100, 100);
      
      // Non-linear progress (ease out)
      const eased = 100 - Math.pow(1 - rawProgress / 100, 3) * 100;
      setProgress(Math.min(eased, 99));
      
      if (rawProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setPhase("exiting");
        setTimeout(() => setLoading(false), 800);
      }
    };

    // Start loading phase after logo reveal
    const phaseTimer = setTimeout(() => setPhase("loading"), 1200);
    const progressTimer = setTimeout(updateProgress, 1200);

    return () => {
      clearTimeout(phaseTimer);
      clearTimeout(progressTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          }}
          className="fixed inset-0 z-[10000] bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Ambient light effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0, 0.3, 0.2],
              scale: [0.8, 1.5, 1.3],
            }}
            transition={{ duration: 4, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)",
            }}
          />

          {/* Secondary ambient glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0.1] }}
            transition={{ duration: 3, delay: 0.5 }}
            className="absolute bottom-0 left-0 right-0 h-1/2"
            style={{
              background: "linear-gradient(to top, rgba(212,175,55,0.08), transparent)",
            }}
          />

          {/* Main Content Container */}
          <div className="relative z-10 flex flex-col items-center gap-12">
            
            {/* Logo with golden reveal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                filter: "blur(0px)",
              }}
              transition={{ 
                duration: 1.2, 
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2 
              }}
              className="relative"
            >
              {/* Logo glow effect */}
              <motion.div
                className="absolute inset-0 blur-2xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img 
                  src={solerLogo} 
                  alt="" 
                  className="w-24 h-24 md:w-28 md:h-28 opacity-50"
                  style={{ filter: "sepia(100%) saturate(300%) hue-rotate(10deg)" }}
                />
              </motion.div>
              
              <img 
                src={solerLogo} 
                alt="Soler Shop" 
                className="relative w-24 h-24 md:w-28 md:h-28"
                style={{ 
                  filter: "brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(350deg)",
                }}
              />
            </motion.div>

            {/* Brand name with letter reveal */}
            <div className="text-center">
              <h1 className="font-heading text-2xl md:text-3xl tracking-[0.3em] text-white/90">
                <LetterReveal text="SOLER" delay={0.6} />
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.5em] text-gold/60 font-body"
              >
                Shop
              </motion.p>
            </div>

            {/* Organic progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "loading" ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <OrganicProgress progress={progress} />
              
              {/* Progress percentage */}
              <motion.span
                className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-body tabular-nums"
                animate={{ opacity: progress > 0 ? 1 : 0 }}
              >
                {Math.round(progress)}%
              </motion.span>
            </motion.div>

            {/* Tagline with stagger */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "loading" ? 1 : 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute bottom-12 md:bottom-16"
            >
              <p className="text-[9px] md:text-[10px] uppercase tracking-[0.6em] text-white/20 font-body text-center">
                <LetterReveal text="Curadoria de Luxo" delay={1.6} />
              </p>
            </motion.div>
          </div>

          {/* Top accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent origin-center"
          />

          {/* Grain texture overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Vignette effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
