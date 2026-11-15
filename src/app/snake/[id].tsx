import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/chip';
import { EndemicBadge } from '@/components/endemic-badge';
import { Icon } from '@/components/icon';
import { SnakeImage } from '@/components/snake-image';
import { VenomBadge } from '@/components/venom-badge';
import { palette } from '@/constants/palette';
import { useAppTheme } from '@/context/app-theme';
import { useFavourites } from '@/context/favourites';
import { colors, radius, shadow } from '@/constants/theme';
import { PHOTO_CREDITS } from '@/data/credits';
import { useSettings } from '@/context/settings';
import { ACTIVE_LABEL, getSnake, localNames } from '@/utils/snakes';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors: theme } = useAppTheme();
  return (
    <View style={[styles.section, { backgroundColor: theme.card }]}>
      <Text style={[styles.sectionTitle, { color: theme.muted }]}>{title}</Text>
      {children}
    </View>
  );
}

export default function SnakeDetailScreen() {
  const { colors: theme } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isFavourite, toggleFavourite } = useFavourites();
  const snake = getSnake(id);
  const { photoFor } = useSettings();
  const [source, setSource] = useState<'photo' | 'illustration'>('illustration');

  if (!snake) {
    return (
      <View style={[styles.missing, { backgroundColor: theme.background }]}>
        <Text style={[styles.missingText, { color: theme.muted }]}>Snake not found</Text>
      </View>
    );
  }

  const favourite = isFavourite(snake.id);
  const lookAlikes = snake.lookAlikes.map(getSnake).filter((s) => s !== undefined);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: snake.name }} />

      <View>
        <SnakeImage snake={snake} style={styles.hero} onSourceChange={setSource} />
        {source === 'photo' ? (
          <Pressable
            style={styles.credit}
            onPress={() => {
              const url = PHOTO_CREDITS[snake.id]?.source ?? photoFor(snake)?.pageUrl;
              if (url) Linking.openURL(url);
            }}
            accessibilityRole="link"
          >
            <Icon name="camera-outline" size={12} color={colors.white} />
            <Text style={styles.creditText} numberOfLines={1}>
              {PHOTO_CREDITS[snake.id]
                ? `© ${PHOTO_CREDITS[snake.id].author} · ${PHOTO_CREDITS[snake.id].license}`
                : 'Photo: Wikipedia / Wikimedia Commons'}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.credit}>
            <Icon name="brush-outline" size={12} color={colors.white} />
            <Text style={styles.creditText}>Illustration</Text>
          </View>
        )}
      </View>

      <View style={styles.titleBlock}>
        <Text style={[styles.name, { color: theme.text }]}>{snake.name}</Text>
        {localNames(snake) !== '' && <Text style={[styles.local, { color: theme.muted }]}>{localNames(snake)}</Text>}
        <Text style={[styles.scientific, { color: theme.muted }]}>
          {snake.scientificName} · {snake.family}
        </Text>

        <View style={styles.badges}>
          <VenomBadge level={snake.venomLevel} large />
          {snake.endemic && <EndemicBadge size="lg" />}
        </View>
      </View>

      {snake.venomous && (
        <View style={[styles.warning, { backgroundColor: theme.dangerBackground, borderColor: theme.dangerText }]} accessibilityRole="alert">
          <View style={styles.row}>
            <Icon name="warning" size={18} color={colors.danger} />
            <Text style={[styles.warningTitle, { color: theme.dangerText }]}>Do not handle this snake</Text>
          </View>
          <Text style={[styles.warningText, { color: theme.text }]}>
            Keep away and seek hospital care after any bite.
          </Text>
          <Pressable
            style={styles.warningButton}
            onPress={() => router.navigate('/first-aid')}
            accessibilityRole="button"
          >
            <Text style={styles.warningButtonText}>See first aid steps</Text>
          </Pressable>
        </View>
      )}

      <Text style={[styles.description, { color: theme.text }]}>{snake.description}</Text>

      <View style={styles.statsRow}>
        <View style={[styles.stat, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statValue, { color: theme.text }]}>{snake.avgLengthCm} cm</Text>
          <Text style={[styles.statLabel, { color: theme.muted }]}>Average length</Text>
        </View>
        <View style={[styles.stat, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statValue, { color: theme.text }]}>{snake.maxLengthCm} cm</Text>
          <Text style={[styles.statLabel, { color: theme.muted }]}>Maximum length</Text>
        </View>
        <View style={[styles.stat, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statValueSmall, { color: theme.text }]}>{ACTIVE_LABEL[snake.activeTime]}</Text>
          <Text style={[styles.statLabel, { color: theme.muted }]}>Active</Text>
        </View>
      </View>

      <Section title="How to identify it">
        <Text style={[styles.body, { color: theme.text }]}>{snake.pattern}</Text>
        {snake.keyFeatures.map((f) => (
          <Text key={f} style={[styles.bullet, { color: theme.text }]}>
            • {f}
          </Text>
        ))}
        <Text style={[styles.meta, { color: theme.muted }]}>Colours: {snake.colours.join(', ')}</Text>
      </Section>

      <Section title="Habitat and distribution">
        <View style={styles.chipWrap}>
          {snake.habitats.map((h) => (
            <View key={h} style={[styles.tag, { backgroundColor: theme.soft }]}>
              <Text style={[styles.tagText, { color: theme.text }]}>{h}</Text>
            </View>
          ))}
        </View>
        <Text style={[styles.meta, { color: theme.muted }]}>Provinces: {snake.provinces.join(', ')}</Text>
      </Section>

      <Section title="Behaviour">
        <Text style={[styles.body, { color: theme.text }]}>{snake.behaviour}</Text>
      </Section>

      {snake.venomous && (
        <Section title="Venom and bite symptoms">
          <Text style={[styles.body, { color: theme.text }]}>Venom type: {snake.venomType}</Text>
          {snake.biteSymptoms.map((s) => (
            <Text key={s} style={[styles.bullet, { color: theme.text }]}>
              • {s}
            </Text>
          ))}
        </Section>
      )}

      {lookAlikes.length > 0 && (
        <Section title="Look-alikes">
          <Text style={[styles.body, { color: theme.text }]}>Often confused with these species:</Text>
          <View style={styles.chipWrap}>
            {lookAlikes.map((l) => (
              <Chip
                key={l.id}
                label={l.name}
                onPress={() => router.push({ pathname: '/snake/[id]', params: { id: l.id } })}
              />
            ))}
          </View>
          <Pressable
            style={[styles.secondaryButton, { borderColor: theme.border }]}
            onPress={() =>
              router.push({
                pathname: '/compare',
                params: { leftId: snake.id, rightId: lookAlikes[0].id },
              })
            }
            accessibilityRole="button"
          >
            <View style={styles.row}>
              <Icon name="git-compare-outline" size={18} color={theme.text} />
              <Text style={[styles.secondaryText, { color: theme.text }]}>Compare with {lookAlikes[0].name}</Text>
            </View>
          </Pressable>
        </Section>
      )}

      <View style={styles.actions}>
        <Pressable
          style={[styles.action, { backgroundColor: theme.card, borderColor: theme.border }, favourite && { backgroundColor: theme.dangerBackground, borderColor: theme.dangerText }]}
          onPress={() => toggleFavourite(snake.id)}
          accessibilityRole="button"
        >
          <View style={styles.row}>
            <Icon name={favourite ? 'heart' : 'heart-outline'} size={19} color={favourite ? colors.danger : colors.canopy} />
            <Text style={[styles.actionText, { color: theme.text }, favourite && { color: theme.dangerText }]}>
              {favourite ? 'Saved to favourites' : 'Add to favourites'}
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.primaryAction}
          onPress={() => router.push({ pathname: '/add-sighting', params: { snakeId: snake.id } })}
          accessibilityRole="button"
        >
          <View style={styles.row}>
            <Icon name="location" size={19} color={colors.white} />
            <Text style={styles.primaryActionText}>Log a sighting</Text>
          </View>
        </Pressable>
      </View>

      <Text style={[styles.disclaimer, { color: theme.muted }]}>
        Appearance alone cannot reliably identify a snake. Never approach or handle one.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  content: { paddingBottom: 40 },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missingText: { fontSize: 18, color: palette.muted },
  hero: { width: '100%', aspectRatio: 800 / 520, backgroundColor: palette.border },
  credit: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.overlay,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  creditText: { fontSize: 11, color: colors.white, fontWeight: '600', maxWidth: 260 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  titleBlock: { padding: 16, gap: 6 },
  name: { fontSize: 28, fontWeight: '800', color: palette.text, letterSpacing: -0.4 },
  local: { fontSize: 15, color: palette.primaryLight, fontWeight: '600' },
  scientific: { fontSize: 14, fontStyle: 'italic', color: palette.muted },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  endemic: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: palette.primaryLight,
    backgroundColor: '#EAF3EC',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  endemicText: { color: palette.primary, fontWeight: '700', fontSize: 15 },
  warning: {
    marginHorizontal: 16,
    backgroundColor: palette.highlyBg,
    borderWidth: 1,
    borderColor: palette.highly,
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  warningTitle: { color: palette.highly, fontSize: 17, fontWeight: '800' },
  warningText: { color: palette.text, fontSize: 15 },
  warningButton: {
    marginTop: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.highly,
    borderRadius: 10,
  },
  warningButtonText: { color: palette.white, fontWeight: '700', fontSize: 15 },
  description: { fontSize: 16, lineHeight: 24, color: palette.text, padding: 16 },
  statsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16 },
  stat: {
    flex: 1,
    backgroundColor: palette.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { fontSize: 18, fontWeight: '800', color: palette.primary },
  statValueSmall: { fontSize: 13, fontWeight: '800', color: palette.primary, textAlign: 'center' },
  statLabel: { fontSize: 12, color: palette.muted, marginTop: 2 },
  section: {
    ...shadow,
    backgroundColor: palette.card,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: radius.lg,
    padding: 16,
    gap: 8,
  },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: palette.muted, letterSpacing: 1, textTransform: 'uppercase' },
  body: { fontSize: 16, lineHeight: 24, color: palette.text },
  bullet: { fontSize: 16, lineHeight: 24, color: palette.text, paddingLeft: 4 },
  meta: { fontSize: 14, color: palette.muted, lineHeight: 20 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: '#EAF3EC',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: { color: palette.primary, fontWeight: '600', fontSize: 14 },
  secondaryButton: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.primaryLight,
    borderRadius: 12,
    marginTop: 4,
  },
  secondaryText: { color: palette.primary, fontWeight: '700', fontSize: 15 },
  actions: { paddingHorizontal: 16, marginTop: 18, gap: 10 },
  action: {
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.primaryLight,
    borderRadius: 12,
    backgroundColor: palette.card,
  },
  actionActive: { backgroundColor: '#FDECEA', borderColor: palette.highly },
  actionText: { color: palette.primary, fontWeight: '700', fontSize: 16 },
  actionTextActive: { color: palette.highly },
  primaryAction: {
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.primary,
    borderRadius: 12,
  },
  primaryActionText: { color: palette.white, fontWeight: '700', fontSize: 16 },
  disclaimer: { fontSize: 12, color: palette.muted, textAlign: 'center', padding: 16, lineHeight: 18 },
});
