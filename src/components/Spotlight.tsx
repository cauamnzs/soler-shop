import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { useEffect, memo } from "react";

const Spotlight = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Física de movimento ultra-suave (High Mass para inércia cinematográfica)
  const springConfig = { stiffness: 40, damping: 30, mass: 1.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Só adiciona o listener se não for mobile/touch
    if (window.matchMedia("(pointer: fine)").matches) {
      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [mouseX, mouseY]);

  // Templates de movimento declarados no nível superior
  const mainGradient = useMotionTemplate`radial-gradient(650px circle at ${springX}px ${springY}px, rgba(212, 175, 55, 0.15), transparent 80%)`;
  const interactiveGlow = useMotionTemplate`radial-gradient(350px circle at ${springX}px ${springY}px, rgba(212, 175, 55, 0.25), transparent 70%)`;
  const grainMask = useMotionTemplate`radial-gradient(500px circle at ${springX}px ${springY}px, black, transparent 80%)`;

  return (
    <div className="hidden md:block">
      {/* Camada 1: Ambiência de Fundo (z-0) */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0 opacity-60"
        style={{ background: mainGradient, willChange: "background" }}
      />

      {/* Camada 2: Interatividade de Conteúdo (color-dodge para realçar textos/imagens) */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-20 mix-blend-color-dodge opacity-40"
        style={{ background: interactiveGlow, willChange: "background" }}
      />

      {/* Camada 3: VFX de Lente (Aberração Cromática e Film Grain) */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {/* SVG Filter para Aberração Cromática microscópica nas bordas */}
        <svg className="hidden">
          <filter id="cinematicLens">
            <feOffset in="SourceGraphic" dx="-1.5" dy="0" result="red" />
            <feOffset in="SourceGraphic" dx="1.5" dy="0" result="blue" />
            <feColorMatrix in="red" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="redMask" />
            <feColorMatrix in="blue" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="blueMask" />
            <feBlend in="redMask" in2="blueMask" mode="screen" result="rgbSplit" />
            <feBlend in="rgbSplit" in2="SourceGraphic" mode="screen" />
          </filter>
        </svg>

        {/* Textura de Film Grain localizada dentro do raio de luz */}
        <motion.div
          className="absolute inset-0 opacity-[0.07] dark:opacity-[0.025] mix-blend-overlay dark:mix-blend-soft-light"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            maskImage: grainMask,
            WebkitMaskImage: grainMask,
          }}
        />

        {/* Glow de Borda da Lente com filtro cromático */}
        <motion.div
          className="absolute inset-0 opacity-[0.1]"
          style={{ 
            background: interactiveGlow,
            filter: "url(#cinematicLens) blur(2px)",
            willChange: "background, filter"
          }}
        />
      </div>
    </div>
  );
};

export default memo(Spotlight);
