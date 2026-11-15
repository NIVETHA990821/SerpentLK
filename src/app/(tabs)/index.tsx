import { router, useFocusEffect, type Href } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EndemicBadge } from '@/components/endemic-badge';
import { Icon, type IconName } from '@/components/icon';
import { SnakeImage } from '@/components/snake-image';
import { VenomBadge } from '@/components/venom-badge';
import { colors, MAX_WIDTH, radius, shadow, space, type } from '@/constants/theme';
import { useAppTheme } from '@/context/app-theme';
import type { VenomLevel } from '@/types/snake';
import { snakeOfTheDay, snakes, VENOM_META } from '@/utils/snakes';
import { loadSightings } from '@/utils/storage';

const LEVELS: VenomLevel[] = ['highly_venomous', 'mildly_venomous', 'non_venomous'];

const TOOLS: { icon: IconName; title: string; sub: string; href: Href }[] = [
  { icon: 'scan-outline', title: 'Identify', sub: '5 quick questions', href: '/identify' },
  { icon: 'git-compare-outline', title: 'Compare', sub: 'Look-alikes side by side', href: '/compare' },
  { icon: 'location-outline', title: 'Log sighting', sub: 'Saved on this phone', href: '/add-sighting' },
  { icon: 'settings-outline', title: 'Settings', sub: 'Photos & about', href: '/about' },
];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors: theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [sightingCount, setSightingCount] = useState(0);
  const featured = snakeOfTheDay();

  // Refresh the sightings count every time the Home tab is shown.
  useFocusEffect(
    useCallback(() => {
      loadSightings().then((list) => setSightingCount(list.length));
    }, [])
  );

  const stats = [
    { label: 'Species', value: snakes.length },
    { label: 'Venomous', value: snakes.filter((s) => s.venomous).length },
    { label: 'Endemic', value: snakes.filter((s) => s.endemic).length },
    { label: 'Sightings', value: sightingCount },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.hero, { paddingTop: insets.top + space.xl }]}>
        <View style={styles.inner}>
          <View style={styles.brandRow}>
            <View style={styles.logo}>
              <Icon name="leaf" size={20} color={colors.canopy} />
            </View>
            <Text style={styles.brand}>SerpentLK</Text>
            <View style={styles.offline}>
              <Icon name="cloud-offline-outline" size={13} color={colors.moss} />
              <Text style={styles.offlineText}>Works offline</Text>
            </View>
          </View>
          <Text style={styles.greeting}>{greeting()}</Text>
          <Text style={styles.headline}>Know the snakes{'\n'}of Sri Lanka</Text>

          <View style={styles.statsRow}>
            {stats.map((s) => (
              <View key={s.label} style={styles.stat}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={[styles.inner, styles.body]}>
        <Pressable
          style={({ pressed }) => [styles.emergency, shadow, pressed && styles.pressed]}
          onPress={() => router.navigate('/first-aid')}
          accessibilityRole="button"
          accessibilityLabel="Snakebite emergency. Open first aid"
        >
          <View style={styles.emergencyIcon}>
            <Icon name="medkit" size={24} color={colors.danger} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emergencyTitle}>Snakebite emergency?</Text>
            <Text style={styles.emergencyText}>First aid steps and the 1990 ambulance</Text>
          </View>
          <Icon name="chevron-forward" size={22} color={colors.white} />
        </Pressable>

        <View style={styles.grid}>
          {TOOLS.map((t) => (
            <Pressable
              key={t.title}
              style={({ pressed }) => [styles.tool, shadow, pressed && styles.pressed]}
              onPress={() => router.push(t.href)}
              accessibilityRole="button"
            >
              <View style={styles.toolIcon}>
                <Icon name={t.icon} size={22} color={theme.text} />
              </View>
              <Text style={styles.toolTitle}>{t.title}</Text>
              <Text style={styles.toolSub}>{t.sub}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.overline}>Snake of the day</Text>
        <Pressable
          style={({ pressed }) => [styles.featured, shadow, pressed && styles.pressed]}
          onPress={() => router.push({ pathname: '/snake/[id]', params: { id: featured.id } })}
          accessibilityRole="button"
          accessibilityLabel={`Snake of the day: ${featured.name}`}
        >
          <SnakeImage snake={featured} style={styles.featuredImage} />
          <View style={styles.featuredBody}>
            <Text style={styles.featuredName}>{featured.name}</Text>
            <Text style={styles.featuredSci}>{featured.scientificName}</Text>
            <View style={styles.badges}>
              <VenomBadge level={featured.venomLevel} />
              {featured.endemic && <EndemicBadge />}
            </View>
            <Text style={styles.featuredDesc} numberOfLines={3}>
              {featured.description}
            </Text>
          </View>
        </Pressable>

        <Text style={styles.overline}>Browse by danger level</Text>
        <View style={[styles.levels, shadow]}>
          {LEVELS.map((level, i) => {
            const meta = VENOM_META[level];
            const count = snakes.filter((s) => s.venomLevel === level).length;
            return (
              <Pressable
                key={level}
                style={({ pressed }) => [styles.level, i > 0 && styles.levelDivider, pressed && styles.pressed]}
                onPress={() =>
                  router.navigate({ pathname: '/snakes', params: { venom: level, t: String(Date.now()) } })
                }
                accessibilityRole="button"
              >
                <View style={[styles.levelIcon, { backgroundColor: meta.background }]}>
                  <Icon name={meta.icon} size={20} color={meta.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.levelTitle}>{meta.label}</Text>
                  <Text style={styles.levelCount}>{count} species</Text>
                </View>
                <Icon name="chevron-forward" size={20} color={theme.muted} />
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.disclaimer}>
          Educational guide only. It does not replace medical care. After any snakebite, go to the
          nearest hospital immediately. Never try to catch or kill a snake.
        </Text>
      </View>
    </ScrollView>
  );
}

const makeStyles = (theme: ReturnType<typeof useAppTheme>['colors']) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { paddingBottom: space.xxl },
  inner: { width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center' },
  pressed: { opacity: 0.85 },
  hero: {
    backgroundColor: colors.canopy,
    paddingHorizontal: space.lg,
    paddingBottom: 56,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.turmeric,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { color: colors.white, fontSize: 18, fontWeight: '800', flex: 1 },
  offline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  offlineText: { ...type.caption, color: colors.moss },
  greeting: { ...type.small, color: '#A9C7B5', marginTop: space.xl },
  headline: { ...type.display, color: colors.white, marginTop: space.xs },
  statsRow: { flexDirection: 'row', marginTop: space.xl, gap: space.sm },
  stat: {
    flex: 1,
    paddingVertical: space.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.white },
  statLabel: { ...type.caption, color: '#A9C7B5', marginTop: 2 },
  body: { paddingHorizontal: space.lg, marginTop: -36, gap: space.md },
  emergency: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colors.danger,
    borderRadius: radius.lg,
    padding: space.lg,
  },
  emergencyIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyTitle: { ...type.heading, color: colors.white },
  emergencyText: { ...type.small, color: '#FFD9D5', marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  tool: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: theme.card,
    borderRadius: radius.lg,
    padding: space.lg,
    gap: 2,
  },
  toolIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: theme.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.sm,
  },
  toolTitle: { ...type.bodyStrong, color: theme.text },
  toolSub: { ...type.caption, fontWeight: '500', color: theme.muted },
  overline: { ...type.overline, color: theme.muted, marginTop: space.md },
  featured: { backgroundColor: theme.card, borderRadius: radius.lg, overflow: 'hidden' },
  featuredImage: { width: '100%', height: 190, backgroundColor: theme.border },
  featuredBody: { padding: space.lg, gap: 4 },
  featuredName: { ...type.title, color: theme.text },
  featuredSci: { ...type.small, fontStyle: 'italic', color: theme.muted },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: space.xs },
  featuredDesc: { ...type.body, color: theme.text },
  levels: { backgroundColor: theme.card, borderRadius: radius.lg, overflow: 'hidden' },
  level: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg },
  levelDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border },
  levelIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  levelTitle: { ...type.bodyStrong, color: theme.text },
  levelCount: { ...type.small, color: theme.muted },
  disclaimer: { ...type.caption, fontWeight: '400', color: theme.muted, textAlign: 'center', marginTop: space.md, lineHeight: 18 },
});
