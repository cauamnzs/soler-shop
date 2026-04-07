import catFragrances from "@/assets/cat-fragrances.jpg";
import catBodycare from "@/assets/cat-bodycare.jpg";
import catLips from "@/assets/cat-lips.jpg";

const categories = [
  { 
    title: "Perfumes Importados", 
    image: catFragrances, 
    alt: "Frasco de perfume importado com tampa dourada" 
  },
  { 
    title: "Esfoliantes", 
    image: catBodycare, 
    alt: "Pote de esfoliante corporal da Tree Hut" 
  },
  { 
    title: "Kits Exclusivos", 
    image: catLips, 
    alt: "Kits exclusivos de beleza e cuidados" 
  },
];

const CategoryCards = () => {
  return (
    <section className="max-w-7xl mx-auto section-padding py-16 md:py-24">
      <h2 className="font-heading text-3xl md:text-4xl text-center text-foreground mb-3">
        Compre por Categoria
      </h2>
      <p className="text-center text-muted-foreground font-body text-sm mb-12 md:mb-16">
        Explore nossas coleções exclusivas
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {categories.map((cat) => (
          <a key={cat.title} href="#" className="card-luxe group cursor-pointer">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={cat.image}
                alt={cat.alt}
                loading="lazy"
                width={800}
                height={1024}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="p-5 md:p-6 text-center">
              <h3 className="font-heading text-xl md:text-2xl text-foreground group-hover:text-gold transition-colors duration-300">
                {cat.title}
              </h3>
              <span className="inline-block mt-2 text-xs font-body uppercase tracking-[0.2em] text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Explorar →
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default CategoryCards;
