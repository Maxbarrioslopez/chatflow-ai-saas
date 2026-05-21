'use client';
// Selector de idioma - Language Switcher
// Botón para alternar entre español e inglés
import { useLanguage } from '@/lib/i18n';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
        text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
      title={lang === 'es' ? 'Switch to English' : 'Cambiar a español'}
      aria-label={lang === 'es' ? 'Switch to English' : 'Cambiar a español'}
    >
      <Globe className="h-3.5 w-3.5" />
      <span>{lang === 'es' ? 'EN' : 'ES'}</span>
    </button>
  );
}
