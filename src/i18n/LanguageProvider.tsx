import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import en from './en.json';
import ta from './ta.json';
import si from './si.json';

export type AppLanguage = 'en' | 'ta' | 'si';
export type TranslationKey = keyof typeof en;
const translations: Record<AppLanguage, Record<TranslationKey, string>> = { en, ta, si };
const KEY = '@serpentlk_language';
type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
};
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Tamil is the default for first-time users. Existing saved choices take priority.
  const [language, updateLanguage] = useState<AppLanguage>('ta');
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(KEY).then(saved => {
      if (active && (saved === 'en' || saved === 'ta' || saved === 'si')) updateLanguage(saved);
    }).catch(() => {});
    return () => { active = false; };
  }, []);
  const setLanguage = (next: AppLanguage) => {
    updateLanguage(next);
    AsyncStorage.setItem(KEY, next).catch(() => {});
  };
  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    t: (key) => translations[language][key] ?? en[key],
  }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage must be used inside LanguageProvider');
  return value;
}
