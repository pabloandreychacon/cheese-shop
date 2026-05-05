import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroCarousel } from '../components/HeroCarousel';
import SEO from '../components/SEO';
import heroBg from '../assets/cheese/ea7ebe7d1ea44ed4a339416986435357.avif';
import secondaryBg from '../assets/cheese/932241edcad04ff180cacc6033d156b8.avif';
import quoteBg from '../assets/cheese/8cbd8c_6862d831da7144769fc2d061b454d3c1~mv2_d_2027_1348_s_2.avif';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden">
      <SEO title="Inicio" description="Quesos artesanales elaborados con tradición y pasión. Descubre nuestra selección de quesos únicos, hechos con ingredientes naturales y recetas de autor." keywords="quesos artesanales, quesería, queso artesanal, queso de autor" image="/og-home.jpg" />
      {/* Hero Carousel — shows IsOffer products; falls back to static hero if none */}
      <HeroCarousel fallback={
        <section
          className="relative h-[90vh] flex items-center justify-center text-center text-white bg-fixed bg-center bg-cover"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-black/40 z-0"></div>
          <div className="relative z-10 max-w-4xl px-4 animate-fade-in-up">
            <span className="text-brand-gold uppercase tracking-[0.5em] text-sm font-bold mb-4 block">
              Tradición Quesera
            </span>
            <h1 className="text-6xl md:text-8xl font-serif mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-10 font-light tracking-wide max-w-2xl mx-auto italic">
              "{t('hero.subtitle')}"
            </p>
            <Link to="/products" className="btn-primary inline-flex items-center group">
              {t('hero.cta')}
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>
        </section>
      } />

      {/* Featured Section */}
      <section className="py-24 px-4 bg-brand-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-brand-gold font-bold tracking-widest uppercase text-xs mb-4 block">Nuestra Historia</span>
              <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">Quesos hechos con el corazón de la tierra</h2>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                Desde hace generaciones, en Quesera Kali nos hemos dedicado a perfeccionar el arte de la quesería artesanal.
                Utilizando técnicas ancestrales y la leche más pura, creamos productos que cuentan la historia de nuestra región.
              </p>
              <Link to="/about" className="text-brand-charcoal font-bold uppercase tracking-widest text-sm border-b-2 border-brand-gold pb-1 hover:text-brand-gold transition-colors">
                Conoce más sobre nosotros
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-brand-charcoal overflow-hidden shadow-2xl">
                <img
                  src={secondaryBg}
                  alt="Crafting Cheese"
                  className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-brand-gold/10 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section with Parallax Effect */}
      <section
        className="relative h-[60vh] flex items-center justify-center text-center text-white bg-fixed bg-center bg-cover"
        style={{ backgroundImage: `url(${quoteBg})` }}
      >
        <div className="absolute inset-0 bg-brand-charcoal/60 z-0"></div>
        <div className="relative z-10 max-w-4xl px-4">
          <h2 className="text-3xl md:text-5xl font-serif italic mb-6 leading-relaxed">
            "La paciencia es el ingrediente secreto de un buen queso madurado."
          </h2>
          <div className="w-16 h-1 bg-brand-gold mx-auto"></div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 px-4 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-serif mb-8">Descubre el sabor de la tradición</h2>
          <p className="text-gray-600 mb-10 text-lg">
            Visítanos y prueba nuestra amplia variedad de quesos artesanales, hechos con leche 100% natural.
          </p>
          <Link to="/contact" className="btn-primary">
            Contáctanos hoy
          </Link>
        </div>
      </section>
    </div>
  );
}
