import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/chip';
import { useAppTheme } from '@/context/app-theme';
import { SnakeImage } from '@/components/snake-image';
import { useLanguage } from '@/i18n/LanguageProvider';
import { compareTranslations, type CompareLanguage } from '@/data/compareTranslations';
import { localizedSnakeName } from '@/utils/localizedSnakeName';
import { compareSnakeDetails } from '@/data/compareSnakeDetails';
import type { Snake } from '@/types/snake';
import { ACTIVE_LABEL, getSnake, snakes, VENOM_META } from '@/utils/snakes';

const PRESETS = [
  { left: 'russells-viper', right: 'common-sand-boa' },
  { left: 'common-krait', right: 'wolf-snake' },
  { left: 'indian-cobra', right: 'rat-snake' },
  { left: 'saw-scaled-viper', right: 'hump-nosed-viper' },
  { left: 'hook-nosed-sea-snake', right: 'wart-snake' },
  { left: 'ceylon-krait', right: 'barred-wolf-snake' },
  { left: 'green-vine-snake', right: 'brown-vine-snake' },
];

type Row = { id: number; label: string; left: string; right: string };

function buildRows(a: Snake, b: Snake, tr: (typeof compareTranslations)[CompareLanguage], language: CompareLanguage): Row[] {
  const left = compareSnakeDetails(a, language);
  const right = compareSnakeDetails(b, language);
  return [
    { id: 0, label: tr.labels[0], left: language === 'en' ? VENOM_META[a.venomLevel].label : left.danger, right: language === 'en' ? VENOM_META[b.venomLevel].label : right.danger },
    { id: 1, label: tr.labels[1], left: left.venomType, right: right.venomType },
    { id: 2, label: tr.labels[2], left: left.pattern, right: right.pattern },
    { id: 3, label: tr.labels[3], left: `• ${left.keyFeatures.join('\n• ')}`, right: `• ${right.keyFeatures.join('\n• ')}` },
    { id: 4, label: tr.labels[4], left: `${a.avgLengthCm} / ${a.maxLengthCm} cm`, right: `${b.avgLengthCm} / ${b.maxLengthCm} cm` },
    { id: 5, label: tr.labels[5], left: language === 'en' ? ACTIVE_LABEL[a.activeTime] : left.active, right: language === 'en' ? ACTIVE_LABEL[b.activeTime] : right.active },
    { id: 6, label: tr.labels[6], left: left.habitats.join(', '), right: right.habitats.join(', ') },
    { id: 7, label: tr.labels[7], left: a.endemic ? tr.yes : tr.no, right: b.endemic ? tr.yes : tr.no },
  ];
}

export default function CompareScreen() {
  const { colors: theme } = useAppTheme();
  const { language } = useLanguage();
  const tr = compareTranslations[language as CompareLanguage] ?? compareTranslations.en;
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const params = useLocalSearchParams<{ leftId?: string; rightId?: string }>();

  const [leftId, setLeftId] = useState(getSnake(params.leftId)?.id ?? PRESETS[0].left);
  const [rightId, setRightId] = useState(getSnake(params.rightId)?.id ?? PRESETS[0].right);

  const left = getSnake(leftId);
  const right = getSnake(rightId);

  const picker = (label: string, selected: string, onSelect: (id: string) => void) => (
    <View style={styles.pickerBlock}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {snakes.map((s) => (
          <Chip key={s.id} label={localizedSnakeName(s, language)} active={selected === s.id} onPress={() => onSelect(s.id)} />
        ))}
      </ScrollView>
    </View>
  );

  const rows = left && right && left.id !== right.id ? buildRows(left, right, tr, language as CompareLanguage) : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>{tr.heading}</Text>
      <Text style={styles.pickerLabel}>{tr.presets}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {PRESETS.map((p, i) => (
          <Chip
            key={`${p.left}-${p.right}`}
            label={`${localizedSnakeName(getSnake(p.left), language)} ${language === 'ta' ? 'மற்றும்' : language === 'si' ? 'සහ' : 'vs'} ${localizedSnakeName(getSnake(p.right), language)}`}
            active={leftId === p.left && rightId === p.right}
            onPress={() => { setLeftId(p.left); setRightId(p.right); }}
          />
        ))}
      </ScrollView>

      {picker(tr.first, leftId, setLeftId)}
      {picker(tr.second, rightId, setRightId)}

      {!left || !right || left.id === right.id ? (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>{tr.choose}</Text>
        </View>
      ) : (
        <View style={styles.table}>
          <View style={styles.headRow}>
            {[left, right].map((s) => (
              <View key={s.id} style={styles.headCell}>
                <SnakeImage snake={s} style={styles.thumb} />
                <Text style={styles.headName}>{localizedSnakeName(s, language)}</Text>
              </View>
            ))}
          </View>
          {rows.map((row) => {
            const different = row.left !== row.right;
            return (
              <View key={row.id} style={[styles.row, different && styles.rowDifferent]}>
                <Text style={styles.rowLabel}>
                  {row.label}{different ? `  ·  ${tr.different}` : `  ·  ${tr.same}`}
                </Text>
                <View style={styles.cells}>
                  <Text style={styles.cell}>{row.left}</Text>
                  <Text style={styles.cell}>{row.right}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
      <Text style={styles.disclaimer}>{tr.disclaimer}</Text>
    </ScrollView>
  );
}

const makeStyles = (theme: ReturnType<typeof useAppTheme>['colors']) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: 16, paddingBottom: 40, gap: 8 },
  heading: { fontSize: 22, fontWeight: '800', color: theme.text, marginBottom: 4 },
  pickerBlock: { marginTop: 6 },
  pickerLabel: { fontSize: 13, fontWeight: '700', color: theme.muted, marginBottom: 6, marginTop: 6 },
  chipRow: { gap: 8, paddingRight: 8 },
  notice: { backgroundColor: theme.soft, borderRadius: 12, padding: 16, marginTop: 12 },
  noticeText: { fontSize: 15, color: theme.text, textAlign: 'center' },
  table: { marginTop: 12, backgroundColor: theme.card, borderRadius: 14, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' },
  headRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.border },
  headCell: { flex: 1, padding: 10, alignItems: 'center', gap: 6 },
  thumb: { width: '100%', aspectRatio: 800 / 520, borderRadius: 8, backgroundColor: theme.border },
  headName: { fontSize: 15, fontWeight: '800', color: theme.text, textAlign: 'center' },
  row: { padding: 12, borderBottomWidth: 1, borderBottomColor: theme.border },
  rowDifferent: { backgroundColor: theme.soft },
  rowLabel: { fontSize: 12, fontWeight: '800', color: theme.muted, marginBottom: 6 },
  cells: { flexDirection: 'row', gap: 12 },
  cell: { flex: 1, fontSize: 14, lineHeight: 20, color: theme.text },
  disclaimer: { fontSize: 12, color: theme.muted, textAlign: 'center', lineHeight: 18, marginTop: 12 },
});
