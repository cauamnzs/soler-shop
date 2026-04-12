import { motion } from "framer-motion";
import { useEffect, useState, memo } from "react";

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  drift: number;
  layer: "back" | "mid" | "front";
}

// Configurações das camadas movidas para fora para performance e segurança
const layerConfigs = {
  back: { 
    opacity: [0.1, 0.2, 0.1], 
    blur: "blur-[2px]", 
    scale: [0.8, 1, 0.8],
    shadow: "none" 
  },
  mid: { 
    opacity: [0.15, 0.35, 0.15], 
    blur: "blur-none", 
    scale: [0.9, 1.1, 0.9],
    shadow: "0 0 10px rgba(212, 175, 55, 0.15)" 
  },
  front: { 
    opacity: [0.2, 0.6, 0.2], 
    blur: "blur-[3px]", 
    scale: [1, 1.2, 1],
    shadow: "0 0 15px rgba(212, 175, 55, 0.6)" 
  }
};

// Sub-componente para renderização de partículas individuais com movimento Browniano sutil
const ParticleItem = memo(({ p, isMobile }: { p: Particle, isMobile: boolean }) => {
  const config = layerConfigs[p.layer] || layerConfigs.mid;
  const blurClass = isMobile ? (p.layer === 'back' ? 'blur-[1px]' : p.layer === 'front' ? 'blur-[1.5px]' : 'blur-none') : config.blur;
  const shadowValue = isMobile ? "none" : config.shadow;

  return (
    <motion.div
      className={`absolute rounded-full bg-gold/60 ${blurClass}`}
      style={{ 
        width: p.size, 
        height: p.size, 
        left: `${p.x}vw`, 
        top: `${p.y}vh`,
        boxShadow: shadowValue,
        willChange: "transform, opacity",
      }}
      animate={{
        y: ["0vh", "-100vh"],
        x: ["0vw", `${p.drift}vw`],
        opacity: config.opacity,
        scale: config.scale,
      }}
      transition={{ 
        duration: p.duration, 
        repeat: Infinity, 
        ease: "linear", 
        delay: p.delay 
      }}
    />
  );
});

ParticleItem.displayName = "ParticleItem";

const FluidBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const count = window.innerWidth < 768 ? 30 : 80;
    const innerWidth = window.innerWidth;

    const generateParticles = Array.from({ length: count }).map((_, i) => {
      const rand = Math.random();
      let layer: "back" | "mid" | "front" = "mid";
      let sizeScale = 1;
      
      if (rand < 0.3) {
        layer = "back";
        sizeScale = 0.6;
      } else if (rand > 0.7) {
        layer = "front";
        sizeScale = 1.6;
      }

      return {
        id: i,
        size: (Math.random() * 2 + 1.5) * sizeScale,
        x: Math.random() * 100,
        y: Math.random() * 120, 
        duration: (Math.random() * 20 + 30) / (layer === "front" ? 1.2 : layer === "back" ? 0.8 : 1), 
        delay: Math.random() * -50, 
        drift: (Math.random() - 0.5) * (innerWidth < 768 ? 10 : 20),
        layer
      };
    });
    
    setParticles(generateParticles);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-10] bg-background pointer-events-none overflow-hidden h-[100dvh] w-full">
      
      {/* Camada de Ambiência (Esferas Nebulosas Estáticas/Lentas) */}
      <motion.div
        className="absolute -top-[10%] -left-[20%] w-[100vw] md:w-[70vw] h-[100vw] md:h-[70vw] rounded-full bg-[#d4af37]/5 blur-[100px] md:blur-[150px]"
        animate={{ 
          x: ["0%", "3%", "0%"], 
          y: ["0%", "5%", "0%"],
        }}
        transition={{ 
          duration: 40, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      
      {!isMobile && (
        <motion.div
          className="absolute top-[30%] -right-[20%] w-[100vw] md:w-[65vw] h-[100vw] md:h-[65vw] rounded-full bg-[#e8a892]/6 blur-[100px] md:blur-[180px]"
          animate={{ 
            x: ["0%", "-4%", "0%"], 
            y: ["0%", "-3%", "0%"],
          }}
          transition={{ 
            duration: 45, 
            repeat: Infinity, 
            ease: "easeInOut", 
            delay: 2 
          }}
        />
      )}

      {/* Sistema de Partículas Ambientais (Ambient Noise) */}
      {particles.map((p) => (
        <ParticleItem 
          key={p.id} 
          p={p} 
          isMobile={isMobile}
        />
      ))}

      {/* Ruído de Filme sutil */}
      <div 
        className="absolute -inset-[300px] opacity-[0.02] md:opacity-[0.03] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
};

export default memo(FluidBackground);
