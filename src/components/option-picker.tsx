import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { palette } from '@/constants/palette';
import { themeColors, useAppTheme } from '@/context/app-theme';

export type Option = { key: string; label: string; sub?: string };

type Props = {
  label: string;
  placeholder: string;
  options: Option[];
  value: string | null; // selected option key
  onChange: (key: string | null) => void;
  extraOption?: Option; // e.g. "Unknown snake"
  error?: string;
};

// A small searchable picker: type to filter, tap to choose, tap "Change" to pick again.
export function OptionPicker({
  label,
  placeholder,
  options,
  value,
  onChange,
  extraOption,
  error,
}: Props) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [query, setQuery] = useState('');
  const all = useMemo(
    () => (extraOption ? [extraOption, ...options] : options),
    [options, extraOption]
  );
  const selected = all.find((o) => o.key === value);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? all.filter((o) => `${o.label} ${o.sub ?? ''}`.toLowerCase().includes(q))
      : all;
    return list.slice(0, 6);
  }, [all, query]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>

      {selected ? (
        <View style={styles.selected}>
          <View style={{ flex: 1 }}>
            <Text style={styles.selectedLabel}>{selected.label}</Text>
            {selected.sub ? <Text style={styles.sub}>{selected.sub}</Text> : null}
          </View>
          <Pressable
            onPress={() => {
              onChange(null);
              setQuery('');
            }}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={`Change ${label}`}
          >
            <Text style={styles.change}>Change</Text>
          </Pressable>
        </View>
      ) : (
        <View style={[styles.box, !!error && styles.boxError]}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            accessibilityLabel={label}
          />
          {matches.map((o) => (
            <Pressable
              key={o.key}
              style={styles.option}
              onPress={() => onChange(o.key)}
              accessibilityRole="button"
            >
              <Text style={styles.optionLabel}>{o.label}</Text>
              {o.sub ? <Text style={styles.sub}>{o.sub}</Text> : null}
            </Pressable>
          ))}
          {matches.length === 0 && <Text style={styles.none}>No matches</Text>}
        </View>
      )}

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const makeStyles = (c: typeof themeColors.light) => StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontSize: 15, fontWeight: '700', color: c.primary },
  box: {
    backgroundColor: c.card,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  boxError: { borderColor: palette.highly },
  input: { minHeight: 48, paddingHorizontal: 14, fontSize: 16, color: c.text },
  option: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: c.border,
  },
  optionLabel: { fontSize: 16, color: c.text },
  sub: { fontSize: 12, color: c.muted, fontStyle: 'italic' },
  none: { padding: 14, color: c.muted },
  selected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.soft,
    borderWidth: 1,
    borderColor: c.primary,
    borderRadius: 12,
    padding: 12,
    minHeight: 52,
  },
  selectedLabel: { fontSize: 16, fontWeight: '700', color: c.primary },
  change: { color: c.primary, fontWeight: '700', fontSize: 15 },
  error: { color: palette.highly, fontSize: 14 },
});
