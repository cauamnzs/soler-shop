import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { useEffect } from "react";

const Spotlight = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Física do movimento
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Luz bem maior (800px), muito mais suave (0.12) e puramente dourada
  const background = useMotionTemplate`radial-gradient(800px circle at ${springX}px ${springY}px, rgba(212, 175, 55, 0.12), transparent 80%)`;

  return (
    <motion.div
      // z-0 joga a luz pro fundo da página (como um LED na parede)
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background }}
    />
  );
};

export default Spotlight;