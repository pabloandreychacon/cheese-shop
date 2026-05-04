import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Clock
} from 'lucide-react';
import { getSettings } from '../utils/settings';
import type { BusinessSettings } from '../utils/settings';
import CheeseLogo from './CheeseLogo';

export default function Footer() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSettings();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-brand-charcoal text-white pt-16 pb-8 border-t border-brand-gold/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Bio */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <CheeseLogo className="w-12 h-12" />
              <span className="text-2xl font-serif text-brand-gold uppercase tracking-tighter">
                {settings?.name || 'Quesera Kali'}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-gold transition-colors text-white">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-gold transition-colors text-white">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-gold transition-colors text-white">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-gold transition-colors text-white">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 tracking-wide">{t('footer.quickLinks')}</h3>
            <ul className="space-y-4 text-sm uppercase tracking-widest font-bold">
              <li><Link to="/" className="text-gray-400 hover:text-brand-gold transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-brand-gold transition-colors">{t('nav.products')}</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-brand-gold transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-brand-gold transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold mb-6 tracking-wide">{t('footer.contactInfo')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin size={20} className="text-brand-gold flex-shrink-0" />
                <span className="text-sm">{settings?.address || 'San Rafael De Heredia'}</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone size={20} className="text-brand-gold flex-shrink-0" />
                <span className="text-sm">{settings?.phone || '99999999'}</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail size={20} className="text-brand-gold flex-shrink-0" />
                <span className="text-sm truncate">{settings?.email || 'pabloandreychacon@gmail.com'}</span>
              </li>
            </ul>
          </div>

          {/* Horario */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold mb-6 tracking-wide">{t('footer.hours.title')}</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-gray-400">
                <Clock size={20} className="text-brand-gold flex-shrink-0 mt-0.5" />
                <div className="text-sm space-y-2">
                  <p>{t('footer.hours.weekdays')}</p>
                  <p>{t('footer.hours.sunday')}</p>
                  <p className="text-xs italic text-gray-500 mt-2">{t('footer.hours.holidays')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* qr code */}
        <div className="pt-8 border-t border-brand-gold/10 text-center flex justify-center">
          <img src="https://api.qrserver.com/v1/create-qr-code/?color=000000&amp;bgcolor=FFFFFF&amp;data=https%3A%2F%2Fqueserakali.netlify.app%2F&amp;qzone=1&amp;margin=0&amp;size=100x100&amp;ecc=L" alt="qr code" />
        </div>

        {/* Rights Section */}
        <div className="pt-8 border-t border-brand-gold/10 text-center text-xs text-gray-500 tracking-widest uppercase">
          {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}
