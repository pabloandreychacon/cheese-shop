export const joinBilingualText = (es: string, en: string): string => {
  if (!en) return es;
  return `${es} | ${en}`;
};

export const splitBilingualText = (text: string): { es: string; en: string } => {
  if (!text) return { es: '', en: '' };
  if (!text.includes(' | ')) return { es: text, en: '' };
  
  const [es, en] = text.split(' | ');
  return { es: es.trim(), en: en.trim() };
};

export const parseBilingualText = (text: string, lang: 'es' | 'en'): string => {
  const parts = splitBilingualText(text);
  return lang === 'en' && parts.en ? parts.en : parts.es;
};
