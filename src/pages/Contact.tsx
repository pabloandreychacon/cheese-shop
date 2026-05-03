import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { getSettings } from '../utils/settings';
import type { BusinessSettings } from '../utils/settings';
import { emailService } from '../lib/emailjs';

export default function Contact() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSettings();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    setStatus('sending');
    try {
      await emailService.sendEmail({
        to_email: settings.email,
        from_name: formData.name,
        from_email: formData.email,
        subject: `Nuevo mensaje de ${formData.name} - Cheese Shop`,
        message: formData.message
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="py-24 px-4 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
            {t('contact.badge')}
          </span>
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
                  <h3 className="font-serif text-xl mb-2">{t('contact.location')}</h3>
                  <p className="text-gray-500 leading-relaxed">
                    {settings?.address || 'Kilómetro 45 Carretera Federal, Región de los Quesos, México.'}
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
                  <h3 className="font-serif text-xl mb-2">{t('contact.phone')}</h3>
                  <p className="text-gray-500">{settings?.phone || '+52 (555) 123-4567'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-brand-gold/10 text-brand-gold">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-xl mb-2">{t('contact.email')}</h3>
                  <p className="text-gray-500">{settings?.email || 'contacto@quesosdonbeto.com'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-10 shadow-sm border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-brand-charcoal">
                    {t('contact.form.name')}
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-gray-200 py-3 focus:border-brand-gold outline-none transition-colors"
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-brand-charcoal">
                    {t('contact.form.email')}
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-gray-200 py-3 focus:border-brand-gold outline-none transition-colors"
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-brand-charcoal">
                  {t('contact.form.message')}
                </label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border-b border-gray-200 py-3 focus:border-brand-gold outline-none transition-colors resize-none"
                  placeholder={t('contact.form.messagePlaceholder')}
                ></textarea>
              </div>

              {status === 'success' && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-sm animate-fade-in">
                  <CheckCircle2 size={20} />
                  <span className="text-sm font-semibold">{t('contact.form.success')}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-sm animate-fade-in">
                  <AlertCircle size={20} />
                  <span className="text-sm font-semibold">{t('contact.form.error')}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === 'sending'}
                className="btn-primary w-full md:w-auto flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{status === 'sending' ? t('contact.form.sending') : t('contact.form.submit')}</span>
                <Send size={16} className={status === 'sending' ? 'animate-pulse' : ''} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
