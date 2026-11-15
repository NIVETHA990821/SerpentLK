import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/chip';
import { useAppTheme } from '@/context/app-theme';
import { SnakeImage } from '@/components/snake-image';
import type { Snake } from '@/types/snake';
import { ACTIVE_LABEL, getSnake, snakes, VENOM_META } from '@/utils/snakes';

// Commonly confused pairs (a harmless snake against a dangerous look-alike).
const PRESETS = [
  { label: "Russell's Viper vs Sand Boa", left: 'russells-viper', right: 'common-sand-boa' },
  { label: 'Common Krait vs Wolf Snake', left: 'common-krait', right: 'wolf-snake' },
  { label: 'Cobra vs Rat Snake', left: 'indian-cobra', right: 'rat-snake' },
  { label: 'Saw-scaled vs Hump-nosed Viper', left: 'saw-scaled-viper', right: 'hump-nosed-viper' },
  { label: 'Sea Snake vs Wart Snake', left: 'hook-nosed-sea-snake', right: 'wart-snake' },
  { label: 'Sri Lanka Krait vs Barred Wolf Snake', left: 'ceylon-krait', right: 'barred-wolf-snake' },
  { label: 'Green vs Brown Vine Snake', left: 'green-vine-snake', right: 'brown-vine-snake' },
];

type Row = { label: string; left: string; right: string };

function buildRows(a: Snake, b: Snake): Row[] {
  return [
    { label: 'Danger level', left: VENOM_META[a.venomLevel].label, right: VENOM_META[b.venomLevel].label },
    { label: 'Venom type', left: a.venomType, right: b.venomType },
    { label: 'Pattern', left: a.pattern, right: b.pattern },
    { label: 'Key features', left: `• ${a.keyFeatures.join('\n• ')}`, right: `• ${b.keyFeatures.join('\n• ')}` },
    { label: 'Length (avg / max)', left: `${a.avgLengthCm} / ${a.maxLengthCm} cm`, right: `${b.avgLengthCm} / ${b.maxLengthCm} cm` },
    { label: 'Active', left: ACTIVE_LABEL[a.activeTime], right: ACTIVE_LABEL[b.activeTime] },
    { label: 'Habitat', left: a.habitats.join(', '), right: b.habitats.join(', ') },
    { label: 'Endemic', left: a.endemic ? 'Yes' : 'No', right: b.endemic ? 'Yes' : 'No' },
  ];
}

export default function CompareScreen() {
  const { colors: theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const params = useLocalSearchParams<{ leftId?: string; rightId?: string }>();

  const [leftId, setLeftId] = useState(
    getSnake(params.leftId)?.id ?? PRESETS[0].left
  );
  const [rightId, setRightId] = useState(
    getSnake(params.rightId)?.id ?? PRESETS[0].right
  );

  const left = getSnake(leftId);
  const right = getSnake(rightId);

  const picker = (label: string, selected: string, onSelect: (id: string) => void) => (
    <View style={styles.pickerBlock}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {snakes.map((s) => (
          <Chip key={s.id} label={s.name} active={selected === s.id} onPress={() => onSelect(s.id)} />
        ))}
      </ScrollView>
    </View>
  );

  const rows = left && right && left.id !== right.id ? buildRows(left, right) : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Tell similar snakes apart</Text>

      <Text style={styles.pickerLabel}>Common look-alike pairs</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {PRESETS.map((p) => (
          <Chip
            key={p.label}
            label={p.label}
            active={leftId === p.left && rightId === p.right}
            onPress={() => {
              setLeftId(p.left);
              setRightId(p.right);
            }}
          />
        ))}
      </ScrollView>

      {picker('First snake', leftId, setLeftId)}
      {picker('Second snake', rightId, setRightId)}

      {!left || !right || left.id === right.id ? (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>Please choose two different snakes.</Text>
        </View>
      ) : (
        <View style={styles.table}>
          <View style={styles.headRow}>
            {[left, right].map((s) => (
              <View key={s.id} style={styles.headCell}>
                <SnakeImage snake={s} style={styles.thumb} />
                <Text style={styles.headName}>{s.name}</Text>
              </View>
            ))}
          </View>

          {rows.map((row) => {
            const different = row.left !== row.right;
            return (
              <View key={row.label} style={[styles.row, different && styles.rowDifferent]}>
                <Text style={styles.rowLabel}>
                  {row.label}
                  {different ? '  ·  different' : '  ·  same'}
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

      <Text style={styles.disclaimer}>
        Highlighted rows show the differences. Never approach or handle an unknown snake.
        Appearance alone cannot reliably identify a snake.
      </Text>
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
  table: {
    marginTop: 12,
    backgroundColor: theme.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: 'hidden',
  },
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
