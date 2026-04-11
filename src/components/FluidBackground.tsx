import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

// Criamos um evento customizado para a onda de choque
export const triggerShockwave = (intensity: number = 1) => {
  window.dispatchEvent(new CustomEvent("soler-shockwave", { detail: { intensity } }));
};

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  drift: number;
}

const FluidBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shockwave, setShockwave] = useState(0);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 30 : 80;

    const generateParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: Math.random() * (isMobile ? 2 : 2.8) + 0.8,
      x: Math.random() * 100,
      y: Math.random() * 150, 
      duration: Math.random() * 15 + 20, 
      delay: Math.random() * -30, 
      drift: (Math.random() - 0.5) * (isMobile ? 20 : 40),
    }));
    
    setParticles(generateParticles);

    // Listener para a onda de choque
    const handleShockwave = (e: any) => {
      setShockwave(e.detail.intensity);
      setTimeout(() => setShockwave(0), 1000); // Reset após 1s
    };

    window.addEventListener("soler-shockwave", handleShockwave);
    return () => window.removeEventListener("soler-shockwave", handleShockwave);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-[#faf9f6] pointer-events-none overflow-hidden h-[100dvh] w-full">
      
      {/* Esfera Esquerda (Dourada) */}
      <motion.div
        className="absolute -top-[10%] -left-[20%] w-[100vw] md:w-[70vw] h-[100vw] md:h-[70vw] rounded-full bg-[#d4af37]/10 blur-[80px] md:blur-[120px]"
        animate={{ 
          x: ["0%", "10%", "0%"], 
          y: ["0%", "15%", "0%"],
          scale: shockwave > 0 ? [1, 1.2, 1] : 1
        }}
        transition={{ 
          duration: shockwave > 0 ? 0.5 : 25, 
          repeat: shockwave > 0 ? 0 : Infinity, 
          ease: "easeInOut" 
        }}
      />
      
      {/* Esfera Direita (Rosa) */}
      <motion.div
        className="absolute top-[20%] -right-[20%] w-[100vw] md:w-[65vw] h-[100vw] md:h-[65vw] rounded-full bg-[#e8a892]/12 blur-[80px] md:blur-[140px]"
        animate={{ 
          x: ["0%", "-15%", "0%"], 
          y: ["0%", "-10%", "0%"],
          scale: shockwave > 0 ? [1, 1.1, 1] : 1
        }}
        transition={{ 
          duration: shockwave > 0 ? 0.6 : 30, 
          repeat: shockwave > 0 ? 0 : Infinity, 
          ease: "easeInOut", 
          delay: shockwave > 0 ? 0 : 1 
        }}
      />

      {/* Partículas Efervescentes */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold/60"
          style={{ 
            width: p.size, 
            height: p.size, 
            left: `${p.x}vw`, 
            top: `${p.y}vh`,
            boxShadow: `0 0 ${p.size * (shockwave > 0 ? 10 : 3)}px rgba(212, 175, 55, ${shockwave > 0 ? 0.8 : 0.5})`,
            willChange: "transform, opacity",
          }}
          animate={{
            y: ["0vh", "-150vh"],
            x: ["0vw", `${p.drift}vw`],
            opacity: shockwave > 0 ? [0, 1, 0] : [0, 0.8, 0.3, 0.8, 0],
            scale: shockwave > 0 ? [0, 2, 0] : [0, 1, 0.7, 1, 0],
          }}
          transition={{ 
            duration: shockwave > 0 ? 1 : p.duration, 
            repeat: shockwave > 0 ? 0 : Infinity, 
            ease: shockwave > 0 ? "easeOut" : "linear", 
            delay: shockwave > 0 ? 0 : p.delay 
          }}
        />
      ))}

      {/* Ruído Premium */}
      <div 
        className="absolute -inset-[300px] opacity-[0.05] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
};

export default FluidBackground;
