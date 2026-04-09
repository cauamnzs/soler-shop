import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    // Detecta se é mobile para não fritar o celular e manter a elegância
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 30 : 80; // No celular 30 bolinhas já dão o efeito sem pesar

    const generateParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: Math.random() * (isMobile ? 2 : 2.8) + 0.8,
      x: Math.random() * 100,
      // O segredo do mobile: espalhar o nascimento em 150vh para elas virem de "fora" da tela
      y: Math.random() * 150, 
      duration: Math.random() * 15 + 20, 
      delay: Math.random() * -30, 
      drift: (Math.random() - 0.5) * (isMobile ? 20 : 40),
    }));
    
    setParticles(generateParticles);
  }, []);

  return (
    // Usamos h-[100dvh] que é a unidade moderna para ignorar a barra do navegador no celular
    <div className="fixed inset-0 z-[-1] bg-[#faf9f6] pointer-events-none overflow-hidden h-[100dvh] w-full">
      
      {/* Esfera Esquerda (Dourada) */}
      <motion.div
        className="absolute -top-[10%] -left-[20%] w-[100vw] md:w-[70vw] h-[100vw] md:h-[70vw] rounded-full bg-[#d4af37]/10 blur-[80px] md:blur-[120px]"
        animate={{ x: ["0%", "10%", "0%"], y: ["0%", "15%", "0%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Esfera Direita (Rosa) */}
      <motion.div
        className="absolute top-[20%] -right-[20%] w-[100vw] md:w-[65vw] h-[100vw] md:h-[65vw] rounded-full bg-[#e8a892]/12 blur-[80px] md:blur-[140px]"
        animate={{ x: ["0%", "-15%", "0%"], y: ["0%", "-10%", "0%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 1 }}
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
            boxShadow: `0 0 ${p.size * 3}px rgba(212, 175, 55, 0.5)` 
          }}
          animate={{
            y: ["0vh", "-150vh"], // Sobem mais para garantir que cruzam a tela inteira do celular
            x: ["0vw", `${p.drift}vw`],
            opacity: [0, 0.8, 0.3, 0.8, 0],
            scale: [0, 1, 0.7, 1, 0],
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            ease: "linear", 
            delay: p.delay 
          }}
        />
      ))}

      {/* Ruído Premium (Tamanho maior para mobile não ver a emenda) */}
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