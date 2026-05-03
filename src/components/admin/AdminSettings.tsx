import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';
import bcrypt from 'bcryptjs';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { getSettings, type BusinessSettings } from '../../utils/settings';

interface AdminSettingsProps {
  t: any;
}

export function AdminSettings({ t: _t }: AdminSettingsProps) {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const data = await getSettings();
    setSettings(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setMessage('');

    try {
      const updateData: any = {
        BusinessName: settings.name,
        Email: settings.email,
        Phone: settings.phone,
        Address: settings.address
      };

      if (newPassword) {
        if (newPassword !== confirmPassword) {
          setMessage(t('admin.settingsSection.passwordMismatch'));
          setSaving(false);
          return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        updateData.OnlinePassword = hashedPassword;
      }

      const { error } = await supabase
        .from('Settings')
        .update(updateData)
        .eq('Id', 11);

      if (error) {
        setMessage(t('admin.settingsSection.saveError'));
      } else {
        setMessage(t('admin.settingsSection.saveSuccess'));
        setNewPassword('');
        setConfirmPassword('');
        await loadSettings();
      }
    } catch (err) {
      setMessage(t('admin.settingsSection.connectionError'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">{t('admin.settingsSection.loading')}</div>;

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
          {t('admin.settingsSection.businessName')}
        </label>
        <input
          type="text"
          value={settings?.name || ''}
          onChange={(e) => setSettings(s => s ? { ...s, name: e.target.value } : null)}
          className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
            {t('admin.settingsSection.contactEmail')}
          </label>
          <input
            type="email"
            value={settings?.email || ''}
            onChange={(e) => setSettings(s => s ? { ...s, email: e.target.value } : null)}
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
            {t('admin.settingsSection.phone')}
          </label>
          <input
            type="text"
            value={settings?.phone || ''}
            onChange={(e) => setSettings(s => s ? { ...s, phone: e.target.value } : null)}
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
          {t('admin.settingsSection.address')}
        </label>
        <input
          type="text"
          value={settings?.address || ''}
          onChange={(e) => setSettings(s => s ? { ...s, address: e.target.value } : null)}
          className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="border-t border-gray-100 pt-8 mt-8">
        <h3 className="text-lg font-serif font-bold text-brand-charcoal uppercase tracking-widest mb-6">
          {t('admin.settingsSection.changePassword')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              {t('admin.settingsSection.newPassword')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-gold outline-none"
                placeholder={t('admin.settingsSection.newPasswordPlaceholder')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-gold"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              {t('admin.settingsSection.confirmPassword')}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-gold outline-none"
              placeholder={t('admin.settingsSection.confirmPasswordPlaceholder')}
            />
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-md text-sm font-medium ${message.includes('éxito') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full flex items-center justify-center space-x-2 bg-brand-charcoal text-white py-4 rounded-md font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
      >
        <Save size={20} />
        <span>{saving ? t('admin.settingsSection.saving') : t('admin.settingsSection.save')}</span>
      </button>
    </form>
  );
}
