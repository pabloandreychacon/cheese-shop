import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <div className="py-24 px-4 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Ponte en Contacto</span>
          <h1 className="text-5xl md:text-6xl font-serif mb-6">{t('nav.contact')}</h1>
          <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-brand-gold/10 text-brand-gold">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-xl mb-2">Ubicación</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Kilómetro 45 Carretera Federal,<br />
                    Región de los Quesos, México.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-brand-gold/10 text-brand-gold">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-xl mb-2">Teléfono</h3>
                  <p className="text-gray-500">+52 (555) 123-4567</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-brand-gold/10 text-brand-gold">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-xl mb-2">Correo</h3>
                  <p className="text-gray-500">contacto@quesosdonbeto.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-10 shadow-sm border border-gray-100">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-brand-charcoal">Nombre Completo</label>
                  <input 
                    type="text" 
                    className="w-full border-b border-gray-200 py-3 focus:border-brand-gold outline-none transition-colors"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-brand-charcoal">Correo Electrónico</label>
                  <input 
                    type="email" 
                    className="w-full border-b border-gray-200 py-3 focus:border-brand-gold outline-none transition-colors"
                    placeholder="juan@ejemplo.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-brand-charcoal">Mensaje</label>
                <textarea 
                  rows={4}
                  className="w-full border-b border-gray-200 py-3 focus:border-brand-gold outline-none transition-colors resize-none"
                  placeholder="¿En qué podemos ayudarte?"
                ></textarea>
              </div>
              <button type="submit" className="btn-primary w-full md:w-auto flex items-center justify-center space-x-2">
                <span>Enviar Mensaje</span>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
