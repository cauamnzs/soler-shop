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
    // Motor de Física "Effervescente": 80 partículas pulsantes
    const generateParticles = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2.8 + 0.8, // Tamanhos variados (0.8 a 3.6px)
      x: Math.random() * 100,
      y: Math.random() * 110 + 10,
      duration: Math.random() * 18 + 18, // Velocidade variada (18 a 36 seg)
      delay: Math.random() * -30, // Já nascem em posições diferentes no load
      drift: (Math.random() - 0.5) * 40, // Deriva lateral caótica
    }));
    
    setParticles(generateParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-[#faf9f6] pointer-events-none overflow-hidden">
      
      {/* CAMADA 1: A Seda Líquida Original (Sutil e Equilibrada) */}
      
      {/* Esfera Esquerda: Dourado Sutil */}
      <motion.div
        className="absolute -top-[15%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-[#d4af37]/12 blur-[120px]"
        animate={{ x: ["0%", "15%", "0%"], y: ["0%", "20%", "0%"], scale: [1, 1.1, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Esfera Direita: Rosa Pêssego Suave (O Rosa que você queria de volta) */}
      <motion.div
        className="absolute top-[30%] -right-[15%] w-[65vw] h-[65vw] rounded-full bg-[#e8a892]/15 blur-[140px]"
        animate={{ x: ["0%", "-20%", "0%"], y: ["0%", "-15%", "0%"], scale: [1, 1.2, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* CAMADA 2: A Física do "Pó de Ouro" Efervescente */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold/80"
          style={{ 
            width: p.size, 
            height: p.size, 
            left: `${p.x}vw`, 
            top: `${p.y}vh`,
            boxShadow: `0 0 ${p.size * 5}px rgba(212, 175, 55, 0.7)` 
          }}
          animate={{
            y: ["0vh", "-120vh"], // Sobem mais
            x: ["0vw", `${p.drift}vw`],
            opacity: [0, 1, 0.4, 1, 0], // Pulsação de brilho mantida
            scale: [0, 1.2, 0.8, 1.2, 0], // Pulsação de escala mantida
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            ease: "linear", 
            delay: p.delay 
          }}
        />
      ))}

      {/* CAMADA 3: Ruído Premium Infinito (Blindagem anti-corte) */}
      <div 
        className="absolute -inset-[250px] opacity-[0.06] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
};

export default FluidBackground;