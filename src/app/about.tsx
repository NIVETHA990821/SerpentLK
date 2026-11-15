import { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Icon, type IconName } from '@/components/icon';
import { Section } from '@/components/section';
import { colors, MAX_WIDTH, radius, shadow, space, type } from '@/constants/theme';
import { useAppTheme } from '@/context/app-theme';
import { useSettings } from '@/context/settings';
import { snakes } from '@/utils/snakes';

const FEATURES: { icon: IconName; title: string; text: string }[] = [
  { icon: 'book-outline', title: 'Species guide', text: `${snakes.length} Sri Lankan snakes in English, Sinhala and Tamil.` },
  { icon: 'scan-outline', title: 'Identify helper', text: 'Five safe questions narrow down the likely species.' },
  { icon: 'git-compare-outline', title: 'Compare', text: 'Tell dangerous snakes from their harmless look-alikes.' },
  { icon: 'medkit-outline', title: 'First aid', text: 'Step-by-step snakebite guidance that works offline.' },
  { icon: 'location-outline', title: 'Sightings log', text: 'Private records with photos, saved only on this phone.' },
  { icon: 'business-outline', title: 'Hospitals', text: 'Major hospitals by district, in the First Aid tab.' },
];

const SOURCES = [
  { label: 'List of reptiles of Sri Lanka (Wikipedia)', url: 'https://en.wikipedia.org/wiki/List_of_reptiles_of_Sri_Lanka' },
  { label: 'The Reptile Database', url: 'https://reptile-database.reptarium.cz' },
  { label: 'Snakes of Sri Lanka, University of Colombo (BEEZ)', url: 'https://fos.cmb.ac.lk/beez/venomous-and-non-venomous-snake-species-in-sri-lanka/' },
];

export default function AboutScreen() {
  const { showPhotos, setShowPhotos, downloadAllPhotos, savedPhotoCount } = useSettings();
  const { mode, colors: theme, toggleTheme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [progress, setProgress] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    setProgress('Starting…');
    const saved = await downloadAllPhotos((done, total) => setProgress(`Saving photos ${done} of ${total}…`));
    setProgress(
      saved === 0
        ? 'No photos could be saved. Check your internet connection and try again.'
        : `${saved} photos saved for offline use.`
    );
    setBusy(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.header, shadow]}>
        <View style={styles.logo}>
          <Icon name="leaf" size={28} color={colors.canopy} />
        </View>
        <Text style={styles.appName}>SerpentLK</Text>
        <Text style={styles.tagline}>Sri Lankan snake identification and first-aid guide</Text>
        <Text style={styles.version}>Version 1.1.0</Text>
      </View>

      <Section title="Appearance" icon="contrast-outline">
        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Dark mode</Text>
            <Text style={styles.settingText}>Also available from the First Aid tab.</Text>
          </View>
          <Switch
            value={mode === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ true: colors.leaf, false: theme.border }}
            thumbColor={colors.white}
            accessibilityLabel="Dark mode"
          />
        </View>
      </Section>

      <Section title="Species photos" icon="image-outline">
        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Show real photos</Text>
            <Text style={styles.settingText}>
              Free-licence photos from Wikipedia. Illustrations are shown when you are offline.
            </Text>
          </View>
          <Switch
            value={showPhotos}
            onValueChange={setShowPhotos}
            trackColor={{ true: colors.leaf, false: theme.border }}
            thumbColor={colors.white}
            accessibilityLabel="Show real photos"
          />
        </View>
        {showPhotos && (
          <>
            <Text style={styles.settingText}>
              {savedPhotoCount} of {snakes.length} species photos found so far.
            </Text>
            <Button
              label="Download all photos for offline use"
              icon="download-outline"
              variant="secondary"
              loading={busy}
              onPress={download}
            />
            {progress && <Text style={styles.progress}>{progress}</Text>}
          </>
        )}
      </Section>

      <Section title="What you can do" icon="sparkles-outline">
        {FEATURES.map((f) => (
          <View key={f.title} style={styles.feature}>
            <View style={styles.featureIcon}>
              <Icon name={f.icon} size={19} color={colors.leaf} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          </View>
        ))}
      </Section>

      <Section title="Sources" icon="library-outline">
        <Text style={styles.settingText}>
          Species facts were checked against published Sri Lankan checklists and field guides.
        </Text>
        {SOURCES.map((s) => (
          <Pressable key={s.url} style={styles.link} onPress={() => Linking.openURL(s.url)} accessibilityRole="link">
            <Icon name="open-outline" size={15} color={colors.leaf} />
            <Text style={styles.linkText}>{s.label}</Text>
          </Pressable>
        ))}
      </Section>

      <View style={styles.safety}>
        <View style={styles.safetyHead}>
          <Icon name="warning" size={18} color={colors.danger} />
          <Text style={styles.safetyTitle}>Important safety information</Text>
        </View>
        <Text style={styles.safetyText}>
          SerpentLK is for education. It cannot reliably identify an unknown snake or tell whether a
          bite is harmless. Never approach, touch or capture a snake. After any suspected bite, go
          to hospital straight away and call 1990 for a free ambulance.
        </Text>
      </View>

      <Text style={styles.footer}>Made with React Native and Expo · Educational project</Text>
    </ScrollView>
  );
}

const makeStyles = (theme: ReturnType<typeof useAppTheme>['colors']) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: space.lg, paddingBottom: 48, gap: space.lg, width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center' },
  header: { alignItems: 'center', backgroundColor: colors.canopy, borderRadius: radius.lg, padding: space.xl, gap: 4 },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.turmeric,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.sm,
  },
  appName: { ...type.title, color: colors.white },
  tagline: { ...type.small, color: '#A9C7B5', textAlign: 'center' },
  version: { ...type.caption, color: colors.faint, marginTop: space.xs },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  settingTitle: { ...type.bodyStrong, color: theme.text },
  settingText: { ...type.small, color: theme.muted },
  progress: { ...type.small, color: theme.text, fontWeight: '600' },
  feature: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start', paddingVertical: 4 },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: theme.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: { ...type.bodyStrong, color: theme.text },
  featureText: { ...type.small, color: theme.muted },
  link: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: 6 },
  linkText: { ...type.small, color: theme.text, fontWeight: '600', flex: 1 },
  safety: { backgroundColor: theme.dangerBackground, borderRadius: radius.lg, padding: space.lg, gap: space.sm },
  safetyHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  safetyTitle: { ...type.heading, color: theme.dangerText },
  safetyText: { ...type.small, color: theme.text },
  footer: { ...type.caption, fontWeight: '400', color: theme.muted, textAlign: 'center' },
});
