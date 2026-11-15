import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { colors, radius, type } from '@/constants/theme';
import { useAppTheme } from '@/context/app-theme';

export function EndemicBadge({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const lg = size === 'lg';
  const { mode, colors: theme } = useAppTheme();
  return (
    <View style={[styles.badge, { backgroundColor: mode === 'dark' ? theme.soft : colors.turmericBg }, lg && styles.lg]} accessibilityLabel="Found only in Sri Lanka">
      <Icon name="leaf" size={lg ? 15 : 12} color={colors.caution} />
      <Text style={[styles.text, { color: mode === 'dark' ? '#FFD88A' : '#7A5408' }, lg && styles.lgText]}>{lg ? 'Only in Sri Lanka' : 'Endemic'}</Text>
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
    backgroundColor: colors.turmericBg,
  },
  lg: { paddingHorizontal: 12, paddingVertical: 6 },
  text: { ...type.caption, color: '#7A5408' },
  lgText: { fontSize: 14, lineHeight: 18 },
});
