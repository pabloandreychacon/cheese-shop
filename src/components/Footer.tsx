import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getSettings, BusinessSettings } from '../utils/settings';

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
    <footer className="bg-brand-charcoal text-white py-12 border-t border-brand-gold/10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-serif text-brand-gold mb-6 uppercase tracking-widest">
          {settings?.name || 'Don Beto'}
        </h2>
        <div className="mb-8 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-12 text-sm text-gray-400 uppercase tracking-wider font-semibold">
          <p>Tradición Láctea</p>
          <p>Artesanal desde el origen</p>
          <p>Sabor Inolvidable</p>
        </div>
        <div className="text-xs text-gray-500 tracking-widest uppercase">
          {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}
