import { useTranslation } from 'react-i18next';
import aboutImg from '../assets/cheese/©_UVE___MKT_-_Quesos_Don_Beto_-_IMG_9589.avif';
import SEO from '../components/SEO';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="py-24 px-4 bg-brand-cream min-h-screen">
      <SEO title="Nosotros" description="Conoce la historia de Quesera Kali, tradición quesera de generaciones. Artesanos dedicados a perfeccionar el arte de la quesería." keywords="sobre nosotros, historia quesería, tradición artesanal, queso artesanal" image="/og-about.jpg" />
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="text-5xl font-serif mb-8 leading-tight">{t('about.title')}</h1>
            <div className="prose prose-lg text-gray-600 leading-relaxed space-y-6">
              <p>{t('about.p1')}</p>
              <p>{t('about.p2')}</p>
              <p className="italic font-serif text-brand-gold text-2xl">
                "{t('about.quote')}"
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative p-4 border border-brand-gold/20">
              <img 
                src={aboutImg} 
                alt={t('about.imgAlt')} 
                className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 bg-brand-gold text-white p-4 text-xs tracking-widest font-bold uppercase">
                {t('about.since')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
