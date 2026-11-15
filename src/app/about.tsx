import { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Icon, type IconName } from '@/components/icon';
import { Section } from '@/components/section';
import { colors, MAX_WIDTH, radius, shadow, space, type } from '@/constants/theme';
import { useAppTheme } from '@/context/app-theme';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useSettings } from '@/context/settings';
import { snakes } from '@/utils/snakes';
import { settingsTranslations } from '@/data/settingsTranslations';

const FEATURE_ICONS: IconName[] = ['book-outline', 'scan-outline', 'git-compare-outline', 'medkit-outline', 'location-outline', 'business-outline'];
const SOURCES = [
  'https://en.wikipedia.org/wiki/List_of_reptiles_of_Sri_Lanka',
  'https://reptile-database.reptarium.cz',
  'https://fos.cmb.ac.lk/beez/venomous-and-non-venomous-snake-species-in-sri-lanka/',
];

export default function AboutScreen() {
  const { showPhotos, setShowPhotos, downloadAllPhotos, savedPhotoCount } = useSettings();
  const { mode, colors: theme, toggleTheme } = useAppTheme();
  const { language, setLanguage, t } = useLanguage();
  const tr = settingsTranslations[language as keyof typeof settingsTranslations] ?? settingsTranslations.en;
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [progress, setProgress] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const download = async () => {
    if (busy) return;
    setBusy(true);
    setProgress(tr.starting);
    try {
      const saved = await downloadAllPhotos((done, total) => setProgress(tr.saving(done, total)));
      setProgress(saved === 0 ? tr.failed : tr.saved(saved));
    } catch {
      setProgress(tr.failed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.header, shadow]}>
        <View style={styles.logo}>
          <Icon name="leaf" size={28} color={colors.canopy} />
        </View>
        <Text style={styles.appName}>SerpentLK</Text>
        <Text style={styles.tagline}>{tr.tagline}</Text>
        <Text style={styles.version}>{tr.version}</Text>
      </View>

      <Section title={t('language')} icon="language-outline">
        <Text style={styles.settingTitle}>{t('chooseLanguage')}</Text>
        <Text style={styles.settingText}>{t('languageHint')}</Text>
        <View style={{ gap: 10, marginTop: 12 }}>
          {([
            ['ta', 'தமிழ் — Tamil'],
            ['en', 'English'],
            ['si', 'සිංහල — Sinhala'],
          ] as const).map(([code, label]) => (
            <Pressable
              key={code}
              onPress={() => { setLanguage(code); setProgress(null); }}
              accessibilityRole="radio"
              accessibilityState={{ checked: language === code }}
              style={{
                padding: 13,
                borderRadius: 12,
                borderWidth: language === code ? 2 : 1,
                borderColor: language === code ? colors.leaf : theme.border,
                backgroundColor: language === code ? theme.soft : theme.card,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: theme.text, fontWeight: '700' }}>{label}</Text>
              <Text style={{ color: theme.text }}>{language === code ? '✓' : ''}</Text>
            </Pressable>
          ))}
        </View>
      </Section>

      <Section title={t('appearance')} icon="contrast-outline">
        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>{t('darkMode')}</Text>
            <Text style={styles.settingText}>{t('darkModeHint')}</Text>
          </View>
          <Switch
            value={mode === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ true: colors.leaf, false: theme.border }}
            thumbColor={colors.white}
            accessibilityLabel={t('darkMode')}
          />
        </View>
      </Section>

      <Section title={t('speciesPhotos')} icon="image-outline">
        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>{t('showRealPhotos')}</Text>
            <Text style={styles.settingText}>{tr.photosHint}</Text>
          </View>
          <Switch
            value={showPhotos}
            onValueChange={setShowPhotos}
            trackColor={{ true: colors.leaf, false: theme.border }}
            thumbColor={colors.white}
            accessibilityLabel={t('showRealPhotos')}
          />
        </View>
        {showPhotos && (
          <>
            <Text style={styles.settingText}>{tr.photoCount(savedPhotoCount, snakes.length)}</Text>
            <Button label={tr.download} icon="download-outline" variant="secondary" loading={busy} onPress={download} />
            {progress && <Text style={styles.progress}>{progress}</Text>}
          </>
        )}
      </Section>

      <Section title={t('whatYouCanDo')} icon="sparkles-outline">
        {tr.features.map(([title, description], index) => (
          <View key={index} style={styles.feature}>
            <View style={styles.featureIcon}>
              <Icon name={FEATURE_ICONS[index]} size={19} color={colors.leaf} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{title}</Text>
              <Text style={styles.featureText}>{index === 0 ? `${snakes.length} — ${description}` : description}</Text>
            </View>
          </View>
        ))}
      </Section>

      <Section title={t('sources')} icon="library-outline">
        <Text style={styles.settingText}>{tr.sourcesIntro}</Text>
        {SOURCES.map((url, index) => (
          <Pressable key={url} style={styles.link} onPress={() => Linking.openURL(url).catch(() => {})} accessibilityRole="link">
            <Icon name="open-outline" size={15} color={colors.leaf} />
            <Text style={styles.linkText}>{tr.sourceLabels[index]}</Text>
          </Pressable>
        ))}
      </Section>

      <View style={styles.safety}>
        <View style={styles.safetyHead}>
          <Icon name="warning" size={18} color={colors.danger} />
          <Text style={styles.safetyTitle}>{t('importantSafety')}</Text>
        </View>
        <Text style={styles.safetyText}>{t('safetyInfo')}</Text>
      </View>

      <Text style={styles.footer}>{tr.footer}</Text>
    </ScrollView>
  );
}

const makeStyles = (theme: ReturnType<typeof useAppTheme>['colors']) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: space.lg, paddingBottom: 48, gap: space.lg, width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center' },
  header: { alignItems: 'center', backgroundColor: colors.canopy, borderRadius: radius.lg, padding: space.xl, gap: 4 },
  logo: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.turmeric, alignItems: 'center', justifyContent: 'center', marginBottom: space.sm },
  appName: { ...type.title, color: colors.white },
  tagline: { ...type.small, color: '#A9C7B5', textAlign: 'center' },
  version: { ...type.caption, color: colors.faint, marginTop: space.xs },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  settingTitle: { ...type.bodyStrong, color: theme.text },
  settingText: { ...type.small, color: theme.muted },
  progress: { ...type.small, color: theme.text, fontWeight: '600' },
  feature: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start', paddingVertical: 4 },
  featureIcon: { width: 36, height: 36, borderRadius: radius.sm, backgroundColor: theme.soft, alignItems: 'center', justifyContent: 'center' },
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
