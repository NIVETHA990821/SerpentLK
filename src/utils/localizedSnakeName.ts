import type { Snake } from '@/types/snake';
import type { AppLanguage } from '@/i18n/LanguageProvider';

/** Use the existing species dataset names without changing snake IDs. */
export function localizedSnakeName(snake: Snake | undefined, language: AppLanguage): string {
  if (!snake) return '';
  if (language === 'ta') return snake.tamilName?.trim() || snake.name;
  if (language === 'si') return snake.sinhalaName?.trim() || snake.name;
  return snake.name;
}
