import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import solerLogo from "@/assets/soler-logo.png";

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula um carregamento de assets pesados para o luxo da entrada
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800); // Tempo cinematográfico

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
          }}
          className="fixed inset-0 z-[10000] bg-background flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Névoa Dourada de Fundo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.2, 1],
              opacity: [0, 0.15, 0.1],
            }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute w-[80vw] h-[80vw] bg-gold rounded-full blur-[120px]"
          />

          {/* Logo Emergindo */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
              animate={{ 
                y: 0, 
                opacity: 1, 
                filter: "blur(0px)",
              }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="mb-8"
            >
              <img src={solerLogo} alt="Soler Shop Logo" className="w-20 h-20 md:w-24 md:h-24 grayscale brightness-0 opacity-80" />
            </motion.div>

            {/* Linha de Carregamento Minimalista */}
            <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 bg-gold/60"
              />
            </div>
            
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-4 text-[8px] uppercase tracking-[0.8em] text-gold font-body"
            >
              Curadoria de Luxo
            </motion.span>
          </div>

          {/* Grain Overlay no Preloader */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
