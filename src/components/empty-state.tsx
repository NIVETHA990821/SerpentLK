import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { colors, space, type } from '@/constants/theme';
import { useAppTheme } from '@/context/app-theme';

type Props = { icon: IconName; title: string; message: string; action?: ReactNode };

export function EmptyState({ icon, title, message, action }: Props) {
  const { colors: theme } = useAppTheme();
  return (
    <View style={styles.wrap}>
      <View style={[styles.circle, { backgroundColor: theme.soft }]}>
        <Icon name={icon} size={30} color={theme.text} />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.muted }]}>{message}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: space.xl, gap: space.sm },
  circle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.moss,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.xs,
  },
  title: { ...type.heading, color: colors.ink, textAlign: 'center' },
  message: { ...type.small, color: colors.muted, textAlign: 'center', marginBottom: space.sm },
});
