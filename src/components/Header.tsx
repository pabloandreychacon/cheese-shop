import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { getSettings, BusinessSettings } from '../utils/settings';

export default function Header() {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSettings();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-brand-charcoal text-white shadow-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-serif tracking-widest font-bold text-brand-gold uppercase">
          {settings?.name || 'Don Beto'}
        </Link>

        <nav className="hidden md:flex space-x-10 uppercase text-xs tracking-widest font-semibold">
          <Link to="/" className="hover:text-brand-gold transition-colors">{t('nav.home')}</Link>
          <Link to="/about" className="hover:text-brand-gold transition-colors">{t('nav.about')}</Link>
          <Link to="/products" className="hover:text-brand-gold transition-colors">{t('nav.products')}</Link>
          <Link to="/contact" className="hover:text-brand-gold transition-colors">{t('nav.contact')}</Link>
        </nav>

        <button 
          onClick={toggleLanguage}
          className="flex items-center space-x-2 text-xs tracking-widest uppercase hover:text-brand-gold transition-colors border border-brand-gold/30 px-3 py-1 rounded-sm"
        >
          <Globe size={14} />
          <span>{i18n.language === 'es' ? 'English' : 'Español'}</span>
        </button>
      </div>
    </header>
  );
}
