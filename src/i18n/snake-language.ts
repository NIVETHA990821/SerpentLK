import type { Snake, VenomLevel, ActiveTime } from '@/types/snake';
import type { AppLanguage, TranslationKey } from './LanguageProvider';
import nameFallbacks from './snake-name-fallbacks.json';

type FallbackNames = Record<string, { ta: string; si: string }>;
const fallbacks = nameFallbacks as FallbackNames;

/** A supplied local name is preferred. Otherwise use a labelled phonetic rendering,
 * never pretending a phonetic rendering is a verified local/common name. */
export function snakeNameInfo(snake: Snake, language: AppLanguage): {
  name: string;
  isPhonetic: boolean;
  /** Tamil only: no established common name exists, so this is a descriptive Tamil name. */
  isDescriptive: boolean;
} {
  if (language === 'en') return { name: snake.name, isPhonetic: false, isDescriptive: false };
  const native = language === 'ta' ? snake.tamilName?.trim() : snake.sinhalaName?.trim();
  if (native) {
    return { name: native, isPhonetic: false, isDescriptive: language === 'ta' && !!snake.tamilNameDescriptive };
  }
  const fallback = fallbacks[snake.id]?.[language];
  if (fallback) return { name: fallback, isPhonetic: true, isDescriptive: false };
  return { name: snake.name, isPhonetic: false, isDescriptive: false };
}
export function snakeDisplayName(snake: Snake, language: AppLanguage): string {
  return snakeNameInfo(snake, language).name;
}
export function snakeSearchNames(snake: Snake): string[] {
  const fallback = fallbacks[snake.id];
  return [
    snake.name, snake.scientificName,
    snake.tamilName, snake.sinhalaName,
    snake.tamilRoman, snake.sinhalaRoman,
    ...(snake.tamilOtherNames ?? []),
    fallback?.ta ?? '', fallback?.si ?? '',
  ];
}
export function venomTranslationKey(level: VenomLevel): TranslationKey {
  return level === 'highly_venomous' ? 'highlyVenomous' : level === 'mildly_venomous' ? 'mildlyVenomous' : 'nonVenomous';
}
export function activeTranslationKey(active: ActiveTime): TranslationKey {
  return active === 'nocturnal' ? 'night' : active === 'diurnal' ? 'day' : 'dayNight';
}
export function localizedHabitat(habitat: string, t: (key: TranslationKey) => string): string {
  const keys: Record<string, TranslationKey> = {
    forest: 'forest', forests: 'forest', grassland: 'grassland',
    wetland: 'wetland', urban: 'urban', agricultural: 'agricultural', scrubland: 'scrubland',
  };
  const key = keys[habitat.toLowerCase()];
  return key ? t(key) : habitat;
}
