'use client';
// Contexto de idioma - Language Context
// Proporciona el idioma actual y función para cambiarlo a toda la app
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Language } from './translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Detecta el idioma del navegador: es -> español, cualquier otro -> inglés
function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'es';
  const browserLang = navigator.language?.slice(0, 2).toLowerCase();
  return browserLang === 'es' ? 'es' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Estado inicial: español por defecto, traducciones vacías hasta cargar
  const [lang, setLangState] = useState<Language>('es');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // Carga las traducciones y detecta idioma al montar
  useEffect(() => {
    const saved = localStorage.getItem('chatmbl-lang') as Language | null;
    const detected = saved || detectBrowserLanguage();
    setLangState(detected);
    document.documentElement.lang = detected;
    import('./translations').then((mod) => {
      setTranslations(mod.translations[detected]);
    });
  }, []);

  // Cambia idioma y persiste la preferencia
  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('chatmbl-lang', newLang);
    import('./translations').then((mod) => {
      setTranslations(mod.translations[newLang]);
    });
    document.documentElement.lang = newLang;
  }, []);

  // Obtiene una traducción por clave, devuelve la clave si no existe
  const t = useCallback((key: string): string => {
    return translations[key] || key;
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage debe usarse dentro de LanguageProvider');
  return context;
}
