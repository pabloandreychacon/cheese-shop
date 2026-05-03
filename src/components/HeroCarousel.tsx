import { useState, useEffect, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getSettings, getCurrencySymbol } from '../utils/settings';
import { parseBilingualText } from '../utils/bilingual';

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  price: string;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=1920&h=1080&fit=crop&crop=entropy&q=80';

export function HeroCarousel({ fallback }: { fallback?: ReactNode }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'es') as 'es' | 'en';

  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadOfferProducts();
  }, [lang]);

  const loadOfferProducts = async () => {
    try {
      const settings = await getSettings();
      const currencySymbol = getCurrencySymbol(settings?.currencyCode);

      const { data, error } = await supabase
        .from('Products')
        .select('*')
        .eq('IdBusiness', settings.id)
        .eq('IsOffer', true)
        .eq('Active', true)
        .order('Name');

      if (error) throw error;

      const mapped: CarouselSlide[] = (data || []).map(p => ({
        id: p.Id,
        title: parseBilingualText(p.Name || '', lang),
        subtitle: parseBilingualText(p.Description || '', lang),
        image: p.ImageUrl || FALLBACK_IMAGE,
        price: `${currencySymbol}${p.Price.toFixed(2)}`
      }));

      setSlides(mapped);
    } catch (err) {
      console.error('Error loading offer products for hero:', err);
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-play
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(i => (i === slides.length - 1 ? 0 : i + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const prev = () => setCurrentIndex(i => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setCurrentIndex(i => (i === slides.length - 1 ? 0 : i + 1));

  // Return fallback while loading or if no offer products
  if (loading || slides.length === 0) return <>{fallback}</>;

  const current = slides[currentIndex];

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: index === currentIndex ? 1 : 0, zIndex: index === currentIndex ? 1 : 0 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
          </div>
        </div>
      ))}

      {/* Text content */}
      <div className="relative z-10 w-full px-8 md:px-20 text-white">
        <div className="max-w-3xl">
          <span className="text-brand-gold uppercase tracking-[0.4em] text-xs font-bold mb-4 block animate-fade-in">
            Oferta Especial
          </span>
          <h1
            key={`title-${currentIndex}`}
            className="text-5xl md:text-7xl font-serif mb-4 leading-tight animate-fade-in-up"
            style={{ textShadow: '2px 2px 12px rgba(0,0,0,0.6)' }}
          >
            {current.title}
          </h1>
          <p
            className="text-lg md:text-2xl mb-4 font-light italic max-w-xl opacity-90"
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
          >
            {current.subtitle}
          </p>
          <div
            className="text-3xl font-bold text-brand-gold mb-8"
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
          >
            {current.price}
          </div>
          <Link to="/products" className="btn-primary inline-flex items-center group">
            {t('hero.cta')}
            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
          </Link>
        </div>
      </div>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/80 hover:bg-white hover:scale-110 transition-all flex items-center justify-center shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} className="text-brand-charcoal" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/80 hover:bg-white hover:scale-110 transition-all flex items-center justify-center shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight size={24} className="text-brand-charcoal" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/80'
                }`}
                aria-label={`Ir a slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
