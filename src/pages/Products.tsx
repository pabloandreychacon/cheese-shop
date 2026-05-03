import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { getSettings, getCurrencySymbol } from '../utils/settings';
import { splitBilingualText } from '../utils/bilingual';
import { Package } from 'lucide-react';

interface Product {
  Id: number;
  Name: string;
  Description: string;
  Price: number;
  ImageUrl: string;
  Active: boolean;
  IsOffer: boolean;
}

export default function Products() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currencySymbol, setCurrencySymbol] = useState('$');

  useEffect(() => {
    loadProducts();
    loadCurrencySymbol();
  }, []);

  const loadCurrencySymbol = async () => {
    const settings = await getSettings();
    setCurrencySymbol(getCurrencySymbol(settings?.currencyCode));
  };

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('Products')
      .select('*')
      .eq('IdBusiness', 11)
      .eq('Active', true)
      .order('Id');

    if (!error && data) setProducts(data);
    setLoading(false);
  };

  const lang = i18n.language;

  return (
    <div className="py-24 px-4 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Selección Especial</span>
          <h1 className="text-5xl md:text-6xl font-serif mb-6">{t('nav.products')}</h1>
          <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Cargando productos...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No hay productos disponibles.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => {
              const names = splitBilingualText(product.Name);
              const descs = splitBilingualText(product.Description);
              const displayName = lang === 'en' && names.en ? names.en : names.es;
              const displayDesc = lang === 'en' && descs.en ? descs.en : descs.es;

              return (
                <div key={product.Id} className="group cursor-pointer">
                  <div className="aspect-square bg-white mb-6 overflow-hidden relative shadow-sm border border-gray-100">
                    {product.ImageUrl ? (
                      <img
                        src={product.ImageUrl}
                        alt={displayName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <Package size={48} className="text-gray-200" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-brand-charcoal/0 group-hover:bg-brand-charcoal/10 transition-all duration-500"></div>
                    {product.IsOffer && (
                      <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold uppercase tracking-wider px-2 py-1 rounded">
                        Oferta
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-serif mb-2 text-brand-charcoal group-hover:text-brand-gold transition-colors uppercase tracking-wider">
                    {displayName}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2 italic">{displayDesc}</p>
                  <p className="text-brand-gold font-bold tracking-widest">
                    {currencySymbol}{product.Price.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
