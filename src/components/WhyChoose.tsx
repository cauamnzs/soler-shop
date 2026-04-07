import { ShieldCheck, Sparkles, MapPin, Truck } from "lucide-react";

const highlights = [
  { icon: ShieldCheck, title: "100% Originais", desc: "Todos os produtos são importados autênticos com origem verificada" },
  { icon: Sparkles, title: "Curadoria Especial", desc: "Cada item é selecionado pessoalmente por qualidade e elegância" },
  { icon: MapPin, title: "Santos & Ilhabela", desc: "Nascidos no litoral de São Paulo, inspirados pelo sol e mar" },
  { icon: Truck, title: "Envio Rápido Nacional", desc: "Entrega confiável para todo o Brasil" },
];

const WhyChoose = () => {
  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto section-padding">
      <h2 className="font-heading text-3xl md:text-4xl text-center text-foreground mb-3">
        Por Que Escolher a Soler Shop
      </h2>
      <p className="text-center text-muted-foreground font-body text-sm mb-12 md:mb-16 max-w-lg mx-auto">
        Mais do que uma loja — um estilo de vida curado com amor
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {highlights.map((item) => (
          <div key={item.title} className="text-center group">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-peach flex items-center justify-center
              group-hover:bg-gold transition-colors duration-500">
              <item.icon size={24} className="text-gold group-hover:text-primary-foreground transition-colors duration-500" />
            </div>
            <h3 className="font-heading text-lg text-foreground mb-2">{item.title}</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChoose;
