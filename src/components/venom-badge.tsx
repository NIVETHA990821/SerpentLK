import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { radius } from '@/constants/theme';
import { useAppTheme } from '@/context/app-theme';
import { useLanguage } from '@/i18n/LanguageProvider';
import { venomTranslationKey } from '@/i18n/snake-language';
import type { VenomLevel } from '@/types/snake';
import { VENOM_META } from '@/utils/snakes';

type Props = { level: VenomLevel; large?: boolean };

// Icon + words + colour, so danger level never depends on colour alone.
export function VenomBadge({ level, large = false }: Props) {
  const meta = VENOM_META[level];
  const { mode, colors: theme } = useAppTheme();
  const { t } = useLanguage();
  const translatedLabel = t(venomTranslationKey(level));
  const badgeBackground = mode === 'dark' ? theme.soft : meta.background;
  const badgeText = mode === 'dark' ? theme.text : meta.color;
  return (
    <View
      style={[styles.badge, { backgroundColor: badgeBackground }, large && styles.large]}
      accessibilityLabel={translatedLabel}
    >
      <Icon name={meta.icon} size={large ? 16 : 13} color={badgeText} />
      <Text style={[styles.text, { color: badgeText }, large && styles.largeText]}>{translatedLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  text: { fontSize: 12, fontWeight: '700' },
  large: { paddingHorizontal: 12, paddingVertical: 6, gap: 6 },
  largeText: { fontSize: 14 },
});
