import aboutImg from '../assets/cheese/©_UVE___MKT_-_Quesos_Don_Beto_-_IMG_9589.avif';

export default function About() {
  return (
    <div className="py-24 px-4 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="text-5xl font-serif mb-8 leading-tight">Nuestra Tradición Quesera</h1>
            <div className="prose prose-lg text-gray-600 leading-relaxed space-y-6">
              <p>
                Quesos Don Beto nace de la pasión por lo auténtico. Localizados en el corazón de la región quesera, 
                hemos mantenido vivas las recetas que nuestros abuelos nos heredaron, perfeccionándolas con el paso de los años.
              </p>
              <p>
                Cada queso que sale de nuestra cava es el resultado de un proceso meticuloso donde la calidad de la leche 
                y el tiempo de maduración son nuestros mejores aliados. No buscamos la producción masiva, sino la perfección artesanal.
              </p>
              <p className="italic font-serif text-brand-gold text-2xl">
                "El secreto está en el respeto a la tierra y a los tiempos de la naturaleza."
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative p-4 border border-brand-gold/20">
              <img 
                src={aboutImg} 
                alt="Don Beto Tradition" 
                className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 bg-brand-gold text-white p-4 text-xs tracking-widest font-bold uppercase">
                Desde 1984
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
