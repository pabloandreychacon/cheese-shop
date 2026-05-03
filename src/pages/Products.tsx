import { useTranslation } from 'react-i18next';
import cotijaImg from '../assets/cheese/parmigiano-reggiano.avif';
import frescoImg from '../assets/cheese/8cbd8c_18ab17c214be4e88b1bca8d935030a86~mv2.avif';
import oaxacaImg from '../assets/cheese/8cbd8c_6c82fc2b61b54dd5b803f638be5cd58b~mv2.avif';
import cremaImg from '../assets/cheese/natilla.avif';

const PRODUCTS = [
  { id: 1, name: 'Queso Cotija', description: 'Madurado por 6 meses, salado y firme.', price: '$120.00', image: cotijaImg },
  { id: 2, name: 'Queso Fresco', description: 'Suave, cremoso y recién hecho.', price: '$85.00', image: frescoImg },
  { id: 3, name: 'Queso Oaxaca', description: 'El clásico quesillo para fundir.', price: '$95.00', image: oaxacaImg },
  { id: 4, name: 'Crema Rancho', description: 'Espesa y con el sabor del campo.', price: '$45.00', image: cremaImg },
];

export default function Products() {
  const { t } = useTranslation();

  return (
    <div className="py-24 px-4 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Selección Especial</span>
          <h1 className="text-5xl md:text-6xl font-serif mb-6">{t('nav.products')}</h1>
          <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="aspect-square bg-white mb-6 overflow-hidden relative shadow-sm border border-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-brand-charcoal/0 group-hover:bg-brand-charcoal/10 transition-all duration-500"></div>
              </div>
              <h3 className="text-xl font-serif mb-2 text-brand-charcoal group-hover:text-brand-gold transition-colors uppercase tracking-wider">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2 italic">{product.description}</p>
              <p className="text-brand-gold font-bold tracking-widest">{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
