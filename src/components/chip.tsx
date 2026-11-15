import { Pressable, StyleSheet, Text } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { colors, radius } from '@/constants/theme';
import { useAppTheme } from '@/context/app-theme';

type Props = {
  label: string;
  active?: boolean;
  icon?: IconName;
  onPress: () => void;
};

export function Chip({ label, active = false, icon, onPress }: Props) {
  const { colors: theme } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.chip, { backgroundColor: theme.card, borderColor: theme.border }, active && { backgroundColor: theme.primary, borderColor: theme.primary }, pressed && !active && { backgroundColor: theme.soft }]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      {icon && <Icon name={icon} size={15} color={active ? theme.primaryText : theme.text} />}
      <Text style={[styles.text, { color: theme.text }, active && { color: theme.primaryText }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  pressed: { backgroundColor: colors.moss },
  active: { backgroundColor: colors.canopy, borderColor: colors.canopy },
  text: { fontSize: 14, fontWeight: '600', color: colors.ink, textTransform: 'capitalize' },
  activeText: { color: colors.white },
});
