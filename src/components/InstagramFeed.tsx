import { Instagram } from "lucide-react";
import insta1 from "@/assets/insta-1.jpg";
import insta2 from "@/assets/insta-2.jpg";
import insta3 from "@/assets/insta-3.jpg";
import insta4 from "@/assets/insta-4.jpg";
import insta5 from "@/assets/insta-5.jpg";
import insta6 from "@/assets/insta-6.jpg";

const photos = [insta1, insta2, insta3, insta4, insta5, insta6];

const InstagramFeed = () => {
  return (
    <section className="bg-secondary/30 py-16 md:py-24">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-3">
            Da Comunidade Soler
          </h2>
          <a
            href="https://instagram.com/solershop_"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold font-body text-sm hover:text-gold-dark transition-colors"
          >
            <Instagram size={16} />
            @solershop_
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {photos.map((photo, i) => (
            <a
              key={i}
              href="https://instagram.com/solershop_"
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square overflow-hidden rounded-sm group relative"
            >
              <img
                src={photo}
                alt={`Foto da comunidade Soler Shop ${i + 1}`}
                loading="lazy"
                width={800}
                height={800}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 flex items-center justify-center">
                <Instagram
                  size={28}
                  className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
