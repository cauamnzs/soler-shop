import { Product, Vibe } from "@/types";

import vibe1 from "@/assets/cat-fragrances.jpg";
import vibe2 from "@/assets/cat-bodycare.jpg";
import vibe3 from "@/assets/cat-lips.jpg";
import vibe4 from "@/assets/hero-perfume.jpg";

import prodPerfume from "@/assets/prod-perfume1.jpg";
import prodScrub from "@/assets/prod-scrub1.jpg";
import prodEarrings from "@/assets/prod-earrings.jpg";
import prodLipgloss from "@/assets/prod-lipgloss.jpg";
import prodLotion from "@/assets/prod-lotion.jpg";
import prodGiftset from "@/assets/prod-giftset.jpg";
import prodMistSuperberry from "@/assets/prod-mist-superberry.jpg";
import prodMistCollection from "@/assets/prod-mist-collection.jpg";
import prodMistRichHoney from "@/assets/prod-mist-richhoney.jpg";

export const vibes: Vibe[] = [
  {
    id: "vibe-1",
    title: "Ocaso Romântico",
    description: "Dourado Quente e Âmbar. Uma fragrância que captura o último raio de sol.",
    image: vibe1,
    color: "rgba(212, 175, 55, 0.15)",
  },
  {
    id: "vibe-2",
    title: "Amanhecer Fresco",
    description: "Cítrico e Off-White. A pureza do orvalho matinal em um frasco de cristal.",
    image: vibe2,
    color: "rgba(250, 249, 246, 0.15)",
  },
  {
    id: "vibe-3",
    title: "Mistério Noturno",
    description: "Amadeirado e Prata. O enigma das noites cosmopolitas revelado.",
    image: vibe3,
    color: "rgba(0, 0, 0, 0.2)",
  },
  {
    id: "vibe-4",
    title: "Aura Clássica",
    description: "Neutro e Dourado suave. A quintessência da elegância atemporal.",
    image: vibe4,
    color: "rgba(212, 175, 55, 0.1)",
  }
];

export const products: Product[] = [
  { 
    id: "SOL-001",
    name: "Perfume Xerjoff Velvet", 
    price: "R$ 489,00", 
    image: prodPerfume, 
    tag: "Mais Vendido",
    category: "Perfumes",
    description: "Uma fragrância opulenta que combina notas de veludo e especiarias raras, evocando o luxo de uma noite em Florença."
  },
  { 
    id: "SOL-002",
    name: "Esfoliante Peppermint Pearl", 
    price: "R$ 129,00", 
    image: prodScrub, 
    tag: null,
    category: "Esfoliantes",
    description: "Cristais de pérola moídos com infusão de hortelã-pimenta orgânica para uma renovação celular revigorante."
  },
  { 
    id: "SOL-003",
    name: "Brincos Solar Soler", 
    price: "R$ 89,00", 
    image: prodEarrings, 
    tag: "Novo",
    category: "Variedades",
    description: "Banho de ouro 18k com design assimétrico inspirado nos reflexos do sol nas águas de Ilhabela."
  },
  { 
    id: "SOL-004",
    name: "Gloss Pink Mimosa", 
    price: "R$ 69,00", 
    image: prodLipgloss, 
    tag: null,
    category: "Maquiagem",
    description: "Brilho intenso com micro-partículas de brilho que refletem a luz, mantendo os lábios hidratados por 12h."
  },
  { 
    id: "SOL-005",
    name: "Hidratante Corporal Rose Silk", 
    price: "R$ 159,00", 
    image: prodLotion, 
    tag: null,
    category: "Body Lotion",
    description: "Textura de seda que derrete na pele, deixando um rastro sutil de rosas damascenas colhidas ao amanhecer."
  },
  { 
    id: "SOL-006",
    name: "Kit Presente Fragrâncias", 
    price: "R$ 699,00", 
    image: prodGiftset, 
    tag: "Limitado",
    category: "Kits",
    description: "Uma seleção curada das nossas fragrâncias mais exclusivas em frascos de viagem de 30ml."
  },
  { 
    id: "SOL-007",
    name: "Body Mist Super Berry", 
    price: "R$ 79,00", 
    image: prodMistSuperberry, 
    tag: "Novo",
    category: "Body Splash",
    description: "Uma explosão cítrica e adocicada de frutas silvestres, perfeita para refrescar o dia com energia."
  },
  { 
    id: "SOL-008",
    name: "Kit Body Mists Pink", 
    price: "R$ 259,00", 
    image: prodMistCollection, 
    tag: null,
    category: "Kits",
    description: "A coleção completa de mists florais, permitindo camadas de fragrâncias para uma assinatura olfativa única."
  },
  { 
    id: "SOL-009",
    name: "Body Mist Rich Honey", 
    price: "R$ 79,00", 
    image: prodMistRichHoney, 
    tag: null,
    category: "Body Splash",
    description: "A doçura reconfortante do mel silvestre combinada com notas quentes de baunilha de Madagascar."
  },
];
