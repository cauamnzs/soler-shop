import { ShoppingBag } from "lucide-react";
import prodPerfume from "@/assets/prod-perfume1.jpg";
import prodScrub from "@/assets/prod-scrub1.jpg";
import prodEarrings from "@/assets/prod-earrings.jpg";
import prodLipgloss from "@/assets/prod-lipgloss.jpg";
import prodLotion from "@/assets/prod-lotion.jpg";
import prodGiftset from "@/assets/prod-giftset.jpg";
import prodMistSuperberry from "@/assets/prod-mist-superberry.jpg";
import prodMistCollection from "@/assets/prod-mist-collection.jpg";
import prodMistRichHoney from "@/assets/prod-mist-richhoney.jpg";

const products = [
  { name: "Perfume Xerjoff Velvet", price: "R$ 489,00", image: prodPerfume, tag: "Mais Vendido" },
  { name: "Esfoliante Peppermint Pearl", price: "R$ 129,00", image: prodScrub, tag: null },
  { name: "Brincos Solar Soler", price: "R$ 89,00", image: prodEarrings, tag: "Novo" },
  { name: "Gloss Pink Mimosa", price: "R$ 69,00", image: prodLipgloss, tag: null },
  { name: "Hidratante Corporal Rose Silk", price: "R$ 159,00", image: prodLotion, tag: null },
  { name: "Kit Presente Fragrâncias", price: "R$ 699,00", image: prodGiftset, tag: "Limitado" },
  { name: "Body Mist Super Berry", price: "R$ 79,00", image: prodMistSuperberry, tag: "Novo" },
  { name: "Kit Body Mists Pink", price: "R$ 259,00", image: prodMistCollection, tag: null },
  { name: "Body Mist Rich Honey", price: "R$ 79,00", image: prodMistRichHoney, tag: null },
];

const ProductGrid = () => {
  return (
    <section id="products" className="bg-secondary/50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto section-padding">
        <h2 className="font-heading text-3xl md:text-4xl text-center text-foreground mb-3">
          Nossos Favoritos
        </h2>
        <p className="text-center text-muted-foreground font-body text-sm mb-12 md:mb-16">
          Importados selecionados com carinho, só pra você
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {products.map((product) => (
            <div key={product.name} className="card-luxe group bg-card">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {product.tag && (
                  <span className="absolute top-3 left-3 bg-gold text-primary-foreground text-[10px] font-body font-semibold uppercase tracking-wider px-3 py-1 rounded-sm">
                    {product.tag}
                  </span>
                )}
                <button
                  className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm text-foreground p-2.5 rounded-full
                    opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                    transition-all duration-300 hover:bg-gold hover:text-primary-foreground shadow-md"
                  aria-label={`Adicionar ${product.name} ao carrinho`}
                >
                  <ShoppingBag size={16} />
                </button>
              </div>
              <div className="p-4 md:p-5">
                <h3 className="font-body text-sm md:text-base font-medium text-foreground leading-snug mb-1.5 line-clamp-2">
                  {product.name}
                </h3>
                <p className="font-body text-sm md:text-base font-semibold text-gold">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <a href="#" className="btn-gold-outline inline-block text-sm">
            Ver Todos os Produtos
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
