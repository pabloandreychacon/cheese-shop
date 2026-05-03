import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Menu, X } from 'lucide-react';
import { getSettings } from '../utils/settings';
import type { BusinessSettings } from '../utils/settings';
import CheeseLogo from './CheeseLogo';

export default function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSettings();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-brand-charcoal text-white shadow-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <CheeseLogo className="w-10 h-10 group-hover:scale-110 transition-transform" />
          <span className="text-xl md:text-2xl font-serif tracking-widest font-bold text-brand-gold uppercase">
            {settings?.name || 'Quesera Kali'}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-10 uppercase text-xs tracking-widest font-semibold">
          <Link to="/" className="hover:text-brand-gold transition-colors">{t('nav.home')}</Link>
          <Link to="/about" className="hover:text-brand-gold transition-colors">{t('nav.about')}</Link>
          <Link to="/products" className="hover:text-brand-gold transition-colors">{t('nav.products')}</Link>
          <Link to="/contact" className="hover:text-brand-gold transition-colors">{t('nav.contact')}</Link>
          <Link to="/admin" className="hover:text-brand-gold transition-colors">{t('nav.admin')}</Link>
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-2 text-xs tracking-widest uppercase hover:text-brand-gold transition-colors border border-brand-gold/30 px-3 py-1 rounded-sm"
          >
            <Globe size={14} />
            <span>{i18n.language === 'es' ? 'EN' : 'ES'}</span>
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-brand-gold hover:text-white transition-colors"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`
        fixed inset-0 top-20 bg-brand-charcoal/95 backdrop-blur-md transition-transform duration-300 md:hidden
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <nav className="flex flex-col items-center justify-center h-full space-y-8 uppercase text-xl tracking-[0.2em] font-serif">
          <Link to="/" className="hover:text-brand-gold transition-colors">{t('nav.home')}</Link>
          <Link to="/about" className="hover:text-brand-gold transition-colors">{t('nav.about')}</Link>
          <Link to="/products" className="hover:text-brand-gold transition-colors">{t('nav.products')}</Link>
          <Link to="/contact" className="hover:text-brand-gold transition-colors">{t('nav.contact')}</Link>
          <Link to="/admin" className="hover:text-brand-gold transition-colors">{t('nav.admin')}</Link>

          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-3 text-sm tracking-widest uppercase text-brand-gold border border-brand-gold/30 px-6 py-3 rounded-sm"
          >
            <Globe size={18} />
            <span>{i18n.language === 'es' ? 'English' : 'Español'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
