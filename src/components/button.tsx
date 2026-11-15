import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { colors, radius } from '@/constants/theme';
import { useAppTheme } from '@/context/app-theme';

type Variant = 'primary' | 'secondary' | 'danger' | 'quiet';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

const VARIANTS: Record<Variant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.canopy, fg: colors.white, border: colors.canopy },
  secondary: { bg: colors.card, fg: colors.canopy, border: colors.line },
  danger: { bg: colors.danger, fg: colors.white, border: colors.danger },
  quiet: { bg: colors.moss, fg: colors.canopy, border: colors.moss },
};

export function Button({ label, onPress, variant = 'primary', icon, loading, disabled, style, accessibilityLabel }: Props) {
  const { colors: theme } = useAppTheme();
  const v = variant === 'secondary'
    ? { bg: theme.card, fg: theme.text, border: theme.border }
    : variant === 'quiet'
      ? { bg: theme.soft, fg: theme.text, border: theme.soft }
      : variant === 'primary'
        ? { bg: theme.primary, fg: theme.primaryText, border: theme.primary }
        : VARIANTS.danger;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: v.bg, borderColor: v.border },
        (pressed || disabled) && styles.dim,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        icon && <Icon name={icon} size={19} color={v.fg} />
      )}
      <Text style={[styles.label, { color: v.fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  dim: { opacity: 0.7 },
  label: { fontSize: 16, fontWeight: '700' },
});
