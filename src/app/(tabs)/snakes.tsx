import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Chip } from '@/components/chip';
import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { Button } from '@/components/button';
import { colors, MAX_WIDTH, radius, shadow } from '@/constants/theme';
import { SnakeCard } from '@/components/snake-card';
import { palette } from '@/constants/palette';
import { useAppTheme } from '@/context/app-theme';
import { useFavourites } from '@/context/favourites';
import type { VenomLevel } from '@/types/snake';
import {
  ALL_HABITATS,
  applyFilters,
  DEFAULT_FILTERS,
  searchSnakes,
  snakes,
  sortSnakes,
  VENOM_META,
  type Filters,
  type SortMode,
} from '@/utils/snakes';

const VENOM_OPTIONS: (VenomLevel | 'all')[] = [
  'all',
  'highly_venomous',
  'mildly_venomous',
  'non_venomous',
];

export default function SnakeListScreen() {
  const { colors: theme } = useAppTheme();
  const params = useLocalSearchParams<{ venom?: string; t?: string }>();
  const { favourites, isFavourite, toggleFavourite } = useFavourites();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortMode>('az');

  // Home category cards open this tab with a venom level already chosen.
  // Adjusting state while rendering (when the params change) avoids an extra effect.
  const paramKey = `${params.venom ?? ''}|${params.t ?? ''}`;
  const [appliedKey, setAppliedKey] = useState('|');
  if (paramKey !== appliedKey) {
    setAppliedKey(paramKey);
    if (params.venom && params.venom in VENOM_META) {
      setFilters({ ...DEFAULT_FILTERS, venom: params.venom as VenomLevel });
      setSearch('');
    }
  }

  const results = useMemo(
    () => sortSnakes(applyFilters(searchSnakes(snakes, search), filters, favourites), sort),
    [search, filters, favourites, sort]
  );

  const hasActiveFilters =
    search.trim() !== '' ||
    filters.venom !== 'all' ||
    filters.habitat !== 'all' ||
    filters.endemicOnly ||
    filters.favouritesOnly;

  const clearAll = () => {
    setSearch('');
    setFilters(DEFAULT_FILTERS);
  };

  const header = (
    <View style={styles.header}>
      <View style={[styles.searchBox, shadow, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Icon name="search" size={18} color={theme.muted} />
        <TextInput
        style={[styles.search, { color: theme.text }]}
        placeholder="Search by English, Sinhala, Tamil or Latin name"
        placeholderTextColor={theme.muted}
        value={search}
        onChangeText={setSearch}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        accessibilityLabel="Search snakes"
      />
      </View>

      <Text style={[styles.filterLabel, { color: theme.muted }]}>Danger level</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {VENOM_OPTIONS.map((v) => (
          <Chip
            key={v}
            label={v === 'all' ? 'All' : VENOM_META[v].label}
            active={filters.venom === v}
            onPress={() => setFilters({ ...filters, venom: v })}
          />
        ))}
      </ScrollView>

      <Text style={[styles.filterLabel, { color: theme.muted }]}>Habitat</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        <Chip
          label="Any"
          active={filters.habitat === 'all'}
          onPress={() => setFilters({ ...filters, habitat: 'all' })}
        />
        {ALL_HABITATS.map((h) => (
          <Chip
            key={h}
            label={h}
            active={filters.habitat === h}
            onPress={() => setFilters({ ...filters, habitat: h })}
          />
        ))}
      </ScrollView>

      <View style={styles.toggleRow}>
        <Chip
          label="Endemic only"
          icon="leaf"
          active={filters.endemicOnly}
          onPress={() => setFilters({ ...filters, endemicOnly: !filters.endemicOnly })}
        />
        <Chip
          label="Favourites"
          icon="heart"
          active={filters.favouritesOnly}
          onPress={() => setFilters({ ...filters, favouritesOnly: !filters.favouritesOnly })}
        />
        <Chip
          label={sort === 'az' ? 'A–Z' : 'Most dangerous first'}
          icon="swap-vertical"
          onPress={() => setSort(sort === 'az' ? 'danger' : 'az')}
        />
      </View>

      <Text style={[styles.count, { color: theme.muted }]}>
        {results.length} of {snakes.length} species
      </Text>
    </View>
  );

  return (
    <FlatList
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      data={results}
      keyExtractor={(item) => item.id}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={header}
      renderItem={({ item }) => (
        <SnakeCard
          snake={item}
          favourite={isFavourite(item.id)}
          onPress={() => router.push({ pathname: '/snake/[id]', params: { id: item.id } })}
          onToggleFavourite={() => toggleFavourite(item.id)}
        />
      )}
      ListEmptyComponent={
        <EmptyState
          icon="search-outline"
          title="No snakes found"
          message="Try another name or remove a filter."
          action={hasActiveFilters ? <Button label="Clear filters" icon="close" onPress={clearAll} /> : undefined}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  content: { padding: 16, paddingBottom: 32, width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center' },
  header: { marginBottom: 8 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: 14,
  },
  search: { flex: 1, minHeight: 50, fontSize: 16, color: palette.text },
  filterLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: palette.muted, marginTop: 16, marginBottom: 8 },
  chipRow: { gap: 8, paddingRight: 8 },
  toggleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  count: { fontSize: 14, fontWeight: '700', color: palette.muted, marginTop: 14, marginBottom: 4 },
  empty: { alignItems: 'center', padding: 32, gap: 6 },
  emptyIcon: { fontSize: 36 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: palette.primary },
  emptyText: { fontSize: 14, color: palette.muted, textAlign: 'center' },
  clearButton: {
    marginTop: 12,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: palette.primary,
    borderRadius: 22,
  },
  clearText: { color: palette.white, fontWeight: '700', fontSize: 15 },
});
