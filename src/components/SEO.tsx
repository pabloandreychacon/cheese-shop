import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
}

export default function SEO({ title, description, keywords, image }: SEOProps) {
  useEffect(() => {
    const baseUrl = 'https://queserakali.netlify.app';

    if (title) {
      document.title = `${title} | Quesera Kali`;
    }

    const setMeta = (name: string, content: string) => {
      const selector = `meta[name="${name}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const setProperty = (property: string, content: string) => {
      const selector = `meta[property="${property}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const seoTitle = title ? `${title} | Quesera Kali` : 'Quesera Kali | Artesanos del Sabor';
    document.title = seoTitle;

    if (description) {
      setMeta('description', description);
      setProperty('og:description', description);
      setProperty('twitter:description', description);
    }

    if (keywords) {
      setMeta('keywords', keywords);
    }

    if (title) {
      setProperty('og:title', seoTitle);
      setProperty('twitter:title', seoTitle);
    }

    if (image) {
      setProperty('og:image', `${baseUrl}${image}`);
      setProperty('twitter:image', `${baseUrl}${image}`);
    }

    setProperty('og:url', window.location.href);
  }, [title, description, keywords, image]);

  return null;
}
