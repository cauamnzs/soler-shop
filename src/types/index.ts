export interface Vibe {
  id: string;
  title: string;
  description: string;
  image: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  tag?: string | null;
  category: string;
  description?: string;
}

export type ParticleLayer = "back" | "mid" | "front";

export interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  drift: number;
  layer: ParticleLayer;
}

/* ══════════════════════════════════════════════════════════════════
   PACOTE M — Carrinho
   ══════════════════════════════════════════════════════════════════ */

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: number;
}

export interface CartState {
  items: CartItem[];
  version: 1;
  updatedAt: number;
}
