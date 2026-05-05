import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package, X, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { getSettings, getCurrencySymbol } from '../../utils/settings';
import { splitBilingualText, joinBilingualText } from '../../utils/bilingual';

interface Product {
  Id: number;
  Name: string;
  Description: string;
  Price: number;
  ImageUrl: string;
  Active: boolean;
  IsOffer: boolean;
}

export function AdminProducts() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [formData, setFormData] = useState({
    NameEs: '',
    NameEn: '',
    DescriptionEs: '',
    DescriptionEn: '',
    Price: '',
    ImageUrl: '',
    Active: true,
    IsOffer: false
  });

  useEffect(() => {
    loadProducts();
    loadCurrencySymbol();
  }, []);

  const loadCurrencySymbol = async () => {
    const settings = await getSettings();
    setCurrencySymbol(getCurrencySymbol(settings?.currencyCode));
  };

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Products')
      .select('*')
      .eq('IdBusiness', 11)
      .order('Id', { ascending: false });

    if (!error && data) setProducts(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      Name: joinBilingualText(formData.NameEs, formData.NameEn),
      Description: joinBilingualText(formData.DescriptionEs, formData.DescriptionEn),
      Price: parseFloat(formData.Price),
      ImageUrl: formData.ImageUrl,
      Active: formData.Active,
      IsOffer: formData.IsOffer,
      IdBusiness: 11
    };

    if (editingProduct) {
      await supabase.from('Products').update(productData).eq('Id', editingProduct.Id);
    } else {
      await supabase.from('Products').insert(productData);
    }

    resetForm();
    loadProducts();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert(t('admin.product.imageSizeError'));
      return;
    }

    setUploadingImage(true);
    try {
      // Delete old image from bucket before uploading new one
      if (formData.ImageUrl) {
        await deleteImageFromBucket(formData.ImageUrl);
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `11/products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('postore')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('postore')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, ImageUrl: publicUrlData.publicUrl }));
      setImagePreview(publicUrlData.publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(t('admin.product.imageUploadError'));
    } finally {
      setUploadingImage(false);
    }
  };

  const deleteImageFromBucket = async (imageUrl: string) => {
    if (!imageUrl) return;
    try {
      // URL format: https://xxx.supabase.co/storage/v1/object/public/postore/path/to/file
      const urlParts = imageUrl.split('/');
      const bucketIndex = urlParts.findIndex(part => part === 'postore');
      if (bucketIndex === -1 || bucketIndex + 1 >= urlParts.length) {
        console.warn('Invalid image URL format, cannot extract filePath');
        return;
      }
      const filePath = urlParts.slice(bucketIndex + 1).join('/');
      const { error } = await supabase.storage.from('postore').remove([filePath]);
      if (error) console.warn('Error deleting image from bucket:', error);
      else console.log('Image deleted from bucket:', filePath);
    } catch (error) {
      console.warn('Error deleting image from bucket:', error);
    }
  };

  const removeImage = async () => {
    if (formData.ImageUrl) {
      await deleteImageFromBucket(formData.ImageUrl);
    }
    setFormData(prev => ({ ...prev, ImageUrl: '' }));
    setImagePreview('');
  };

  const handleEdit = (product: Product) => {
    const names = splitBilingualText(product.Name);
    const descs = splitBilingualText(product.Description);
    setEditingProduct(product);
    setImagePreview(product.ImageUrl);
    setFormData({
      NameEs: names.es,
      NameEn: names.en,
      DescriptionEs: descs.es,
      DescriptionEn: descs.en,
      Price: product.Price.toString(),
      ImageUrl: product.ImageUrl,
      Active: product.Active,
      IsOffer: product.IsOffer || false
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm(t('admin.product.deleteConfirm'))) {
      const product = products.find(p => p.Id === id);
      if (product?.ImageUrl) {
        await deleteImageFromBucket(product.ImageUrl);
      }
      await supabase.from('Products').delete().eq('Id', id);
      loadProducts();
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setImagePreview('');
    setFormData({
      NameEs: '',
      NameEn: '',
      DescriptionEs: '',
      DescriptionEn: '',
      Price: '',
      ImageUrl: '',
      Active: true,
      IsOffer: false
    });
  };

  if (loading) return <div className="text-center py-10">{t('admin.product.loading')}</div>;

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm space-y-6">
        <h3 className="text-xl font-serif font-bold text-brand-charcoal uppercase tracking-wider">
          {editingProduct ? t('admin.product.editProduct') : t('admin.product.addNew')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('admin.product.nameEs')}</label>
            <input
              type="text"
              required
              value={formData.NameEs}
              onChange={e => setFormData({ ...formData, NameEs: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('admin.product.nameEn')}</label>
            <input
              type="text"
              value={formData.NameEn}
              onChange={e => setFormData({ ...formData, NameEn: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('admin.product.descriptionEs')}</label>
            <textarea
              value={formData.DescriptionEs}
              onChange={e => setFormData({ ...formData, DescriptionEs: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded outline-none focus:ring-2 focus:ring-brand-gold h-24"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('admin.product.descriptionEn')}</label>
            <textarea
              value={formData.DescriptionEn}
              onChange={e => setFormData({ ...formData, DescriptionEn: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded outline-none focus:ring-2 focus:ring-brand-gold h-24"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('admin.product.price')}</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.Price}
            onChange={e => setFormData({ ...formData, Price: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded outline-none focus:ring-2 focus:ring-brand-gold"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('admin.product.imageLabel')}</label>
          {imagePreview || formData.ImageUrl ? (
            <div className="flex items-start space-x-4">
              <img
                src={imagePreview || formData.ImageUrl}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
              />
              <button
                type="button"
                onClick={removeImage}
                className="flex items-center space-x-1 text-red-500 hover:text-red-700 text-xs font-bold uppercase mt-2"
              >
                <X size={14} />
                <span>{t('admin.product.removeImage')}</span>
              </button>
            </div>
          ) : (
            <label className={`relative flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-brand-gold hover:bg-amber-50/30 transition-all ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
              <Upload className="text-gray-300 mb-2" size={32} />
              <p className="text-sm text-gray-400 font-medium">
                {uploadingImage ? t('admin.product.uploading') : t('admin.product.imageUploadHint')}
              </p>
              <p className="text-xs text-gray-300 mt-1">{t('admin.product.imageFormats')}</p>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
          )}
        </div>

        {/* Active & IsOffer */}
        <div className="flex items-center space-x-8 pt-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${formData.Active ? 'bg-brand-gold border-brand-gold' : 'border-gray-300'}`}>
              {formData.Active && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>}
            </div>
            <input type="checkbox" checked={formData.Active} onChange={e => setFormData({ ...formData, Active: e.target.checked })} className="sr-only" />
            <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">{t('admin.product.active')}</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${formData.IsOffer ? 'bg-amber-500 border-amber-500' : 'border-gray-300'}`}>
              {formData.IsOffer && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>}
            </div>
            <input type="checkbox" checked={formData.IsOffer} onChange={e => setFormData({ ...formData, IsOffer: e.target.checked })} className="sr-only" />
            <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">{t('admin.product.isOffer')}</span>
          </label>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="bg-brand-gold text-white px-8 py-3 rounded font-bold uppercase tracking-widest hover:bg-brand-charcoal transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>{editingProduct ? t('admin.product.update') : t('admin.product.create')}</span>
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-500 hover:text-red-500 uppercase text-xs font-bold tracking-widest"
            >
              {t('admin.product.cancel')}
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Desktop table */}
        <table className="w-full text-left hidden md:table">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{t('admin.product.tableProduct')}</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{t('admin.product.tablePrice')}</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{t('admin.product.tableStatus')}</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">{t('admin.product.tableActions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(product => {
              const names = splitBilingualText(product.Name);
              return (
                <tr key={product.Id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      {product.ImageUrl ? (
                        <img src={product.ImageUrl} className="w-12 h-12 object-cover rounded shadow-sm flex-shrink-0" alt="" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                          <Package size={20} className="text-gray-300" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-brand-charcoal">{names.es}</div>
                        <div className="text-xs text-gray-400 italic">{names.en}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-brand-gold">
                    {currencySymbol}{product.Price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${product.Active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {product.Active ? t('admin.product.statusActive') : t('admin.product.statusInactive')}
                      </span>
                      {product.IsOffer && (
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-700">
                          {t('admin.product.offer')}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEdit(product)} className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(product.Id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-gray-100">
          {products.map(product => {
            const names = splitBilingualText(product.Name);
            return (
              <div key={product.Id} className="p-4 flex flex-col space-y-3">
                <div className="flex items-start space-x-4">
                  {product.ImageUrl ? (
                    <img src={product.ImageUrl} className="w-16 h-16 object-cover rounded shadow-sm flex-shrink-0" alt="" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      <Package size={20} className="text-gray-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-brand-charcoal truncate">{names.es}</div>
                    <div className="text-xs text-gray-400 italic truncate">{names.en}</div>
                    <div className="font-mono font-bold text-brand-gold mt-1">{currencySymbol}{product.Price.toFixed(2)}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${product.Active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {product.Active ? t('admin.product.statusActive') : t('admin.product.statusInactive')}
                      </span>
                      {product.IsOffer && (
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-700">
                          {t('admin.product.offer')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => handleEdit(product)} className="flex-1 flex items-center justify-center space-x-2 py-2 bg-blue-50 text-blue-600 rounded font-bold text-sm uppercase tracking-wider hover:bg-blue-100 transition-colors">
                    <Edit2 size={16} />
                    <span>{t('admin.product.edit')}</span>
                  </button>
                  <button onClick={() => handleDelete(product.Id)} className="flex-1 flex items-center justify-center space-x-2 py-2 bg-red-50 text-red-600 rounded font-bold text-sm uppercase tracking-wider hover:bg-red-100 transition-colors">
                    <Trash2 size={16} />
                    <span>{t('admin.product.delete')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
