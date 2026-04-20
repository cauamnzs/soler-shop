import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { useEffect, useState, memo } from "react";

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [hoverType, setHoverType] = useState<string | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Configuração de mola para o anel externo (inércia cinematográfica)
  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Só ativa se for um dispositivo com ponteiro preciso (mouse)
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, a, [data-cursor="magnetic"]');
      if (isInteractive) {
        setIsHovering(true);
        if (target.closest('[data-cursor-label]')) {
          setHoverType(target.closest('[data-cursor-label]')?.getAttribute('data-cursor-label') || 'Explorar');
        }
      } else {
        setIsHovering(false);
        setHoverType(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9990] hidden md:block">
      {/* O Anel Externo (Outer Ring) */}
      <motion.div
        className="absolute w-8 h-8 border border-gold/40 rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovering ? 2.5 : isClicking ? 0.8 : 1,
          opacity: isHovering ? 0.6 : 0.4,
          backgroundColor: isHovering ? "rgba(212, 175, 55, 0.05)" : "transparent",
          willChange: "transform, scale, opacity",
        }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
      />

      {/* O Ponto Central (Dot) */}
      <motion.div
        className="absolute w-1.5 h-1.5 bg-gold rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovering ? 0 : 1,
          opacity: 0.8,
        }}
      />

      {/* Label de Texto (Magnetic Label) */}
      <motion.span
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: hoverType ? 1 : 0, 
          scale: hoverType ? 1 : 0
        }}
        className="absolute text-[8px] uppercase tracking-[0.3em] font-body font-bold text-gold pointer-events-none"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "50%",
          translateY: "50%",
          marginLeft: "20px",
          marginTop: "20px",
        }}
      >
        {hoverType}
      </motion.span>
    </div>
  );
};

export default memo(CustomCursor);
