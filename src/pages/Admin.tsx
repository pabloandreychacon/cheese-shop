import { useState } from 'react';
import { Lock, Settings, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import bcrypt from 'bcryptjs';
import { getSettings } from '../utils/settings';
import { AdminSettings } from '../components/admin/AdminSettings';
import { AdminProducts } from '../components/admin/AdminProducts';

export default function Admin() {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'settings' | 'products'>('settings');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const settings = await getSettings();
      const storedHash = settings?.onlinePassword;

      if (!storedHash) {
        // Fallback if no password is set: "admin123"
        if (password === 'admin123') {
          setIsAuthenticated(true);
        } else {
          setError(t('admin.invalidPassword'));
        }
      } else {
        const isValid = await bcrypt.compare(password, storedHash);
        if (isValid) {
          setIsAuthenticated(true);
        } else {
          setError(t('admin.invalidPassword'));
        }
      }
    } catch (err) {
      setError(t('admin.authFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-brand-gold" size={32} />
            </div>
            <h1 className="text-2xl font-serif font-bold text-brand-charcoal uppercase tracking-widest">
              {t('admin.title')}
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">
                {t('admin.passwordLabel')}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-brand-gold transition-all"
                placeholder={t('admin.passwordPlaceholder')}
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold text-center uppercase tracking-tighter">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-charcoal text-white py-4 rounded-md font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
            >
              {loading ? t('admin.authenticating') : t('admin.signIn')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <h1 className="text-4xl font-serif font-bold text-brand-charcoal uppercase tracking-widest">
            {t('admin.dashboard')}
          </h1>
          
          <div className="flex bg-white p-1 rounded-lg shadow-sm border border-gray-100">
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-2 px-6 py-2 rounded-md font-bold text-xs uppercase tracking-widest transition-all ${
                activeTab === 'settings' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-400 hover:text-brand-charcoal'
              }`}
            >
              <Settings size={16} />
              <span>{t('admin.settings')}</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center space-x-2 px-6 py-2 rounded-md font-bold text-xs uppercase tracking-widest transition-all ${
                activeTab === 'products' ? 'bg-brand-gold text-white shadow-md' : 'text-gray-400 hover:text-brand-charcoal'
              }`}
            >
              <Package size={16} />
              <span>{t('admin.products')}</span>
            </button>
          </div>
        </div>

        <div className="transition-all duration-500">
          {activeTab === 'settings' ? <AdminSettings t={t} /> : <AdminProducts />}
        </div>
      </div>
    </div>
  );
}
