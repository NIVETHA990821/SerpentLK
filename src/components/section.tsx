import { useMemo, type ReactNode } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { colors, radius, space, type } from '@/constants/theme';
import { useAppTheme } from '@/context/app-theme';

type Props = { title: string; icon?: IconName; children: ReactNode; style?: ViewStyle };

export function Section({ title, icon, children, style }: Props) {
  const { colors: theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={[styles.section, style]}>
      <View style={styles.head}>
        {icon && <Icon name={icon} size={18} color={colors.leaf} />}
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

export function Bullet({ children }: { children: ReactNode }) {
  const { colors: theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={styles.bullet}>
      <View style={styles.dot} />
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

const makeStyles = (theme: ReturnType<typeof useAppTheme>['colors']) => StyleSheet.create({
  section: {
    backgroundColor: theme.card,
    borderRadius: radius.lg,
    padding: space.lg,
    gap: space.sm,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginBottom: 2 },
  title: { ...type.heading, color: theme.text },
  bullet: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.leaf, marginTop: 9 },
  bulletText: { ...type.body, color: theme.text, flex: 1 },
});
