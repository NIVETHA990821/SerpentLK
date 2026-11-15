
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Chip } from '@/components/chip';
import { VenomBadge } from '@/components/venom-badge';
import { useAppTheme, themeColors } from '@/context/app-theme';
import { palette } from '@/constants/palette';
import { SnakeImage } from '@/components/snake-image';

import type { Sighting } from '@/types/sighting';
import { displayObservationTime, displaySavedAt } from '@/utils/sighting-time';
import type { VenomLevel } from '@/types/snake';

import {
    loadSightings,
    saveSightings,
} from '@/utils/storage';

import {
    getSnake,
    VENOM_META,
} from '@/utils/snakes';

// ---------------------------------
// TYPES
// ---------------------------------

type LevelFilter =
  | VenomLevel
  | 'all'
  | 'unknown';

type ViewMode = 'all' | 'grouped';

type SightingGroup = {
  key: string;
  snakeName: string;
  snakeId?: string;
  district: string;
  location: string;
  records: Sighting[];
  firstSeen: string;
  lastSeen: string;
};

// FIX: FlatList accepts both item types.
type ListItem = Sighting | SightingGroup;

// ---------------------------------
// HELPER FUNCTIONS
// ---------------------------------

function normalize(value?: string): string {
  return (value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function groupSightings(
  records: Sighting[]
): SightingGroup[] {
  const groups = new Map<string, SightingGroup>();

  for (const record of records) {
    const speciesKey = record.snakeId
      ? `id:${record.snakeId}`
      : `name:${normalize(record.snakeName)}:${normalize(record.localName)}`;

    const districtKey = normalize(record.district);
    const locationKey = normalize(record.location);

    // Missing location records stay separate.
    const key = locationKey
      ? JSON.stringify([
          speciesKey,
          districtKey,
          locationKey,
        ])
      : `unlocated:${record.id}`;

    const existing = groups.get(key);

    if (existing) {
      existing.records.push(record);

      if (record.date < existing.firstSeen) {
        existing.firstSeen = record.date;
      }

      if (record.date > existing.lastSeen) {
        existing.lastSeen = record.date;
      }
    } else {
      groups.set(key, {
        key,
        snakeName: record.snakeName,
        snakeId: record.snakeId,
        district: record.district ?? '',
        location: record.location ?? '',
        records: [record],
        firstSeen: record.date,
        lastSeen: record.date,
      });
    }
  }

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      records: [...group.records].sort((a, b) =>
        b.date.localeCompare(a.date)
      ),
    }))
    .sort(
      (a, b) =>
        b.lastSeen.localeCompare(a.lastSeen) ||
        a.snakeName.localeCompare(b.snakeName)
    );
}

function matchesFilter(
  item: Sighting,
  filter: LevelFilter
): boolean {
  if (filter === 'all') {
    return true;
  }

  const snake = getSnake(item.snakeId);

  if (filter === 'unknown') {
    return !snake;
  }

  return snake?.venomLevel === filter;
}

// Type guards for FlatList.
function isSighting(
  item: ListItem
): item is Sighting {
  return 'id' in item;
}

// ---------------------------------
// MAIN SCREEN
// ---------------------------------

export default function SightingsScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [sightings, setSightings] = useState<
    Sighting[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [filter, setFilter] =
    useState<LevelFilter>('all');

  const [viewMode, setViewMode] =
    useState<ViewMode>('all');

  const [expandedGroups, setExpandedGroups] =
    useState<string[]>([]);

  // Reload saved sightings when screen opens.
  useFocusEffect(
    useCallback(() => {
      let active = true;

      setLoading(true);

      loadSightings()
        .then((records) => {
          if (active) {
            setSightings(records);
          }
        })
        .catch((error) => {
          console.error(
            'Unable to load sightings:',
            error
          );
        })
        .finally(() => {
          if (active) {
            setLoading(false);
          }
        });

      return () => {
        active = false;
      };
    }, [])
  );

  // Sort newest records first.
  const sorted = useMemo(
    () =>
      [...sightings].sort((a, b) =>
        b.date.localeCompare(a.date)
      ),
    [sightings]
  );

  // All groups for summary statistics.
  const allGroups = useMemo(
    () => groupSightings(sorted),
    [sorted]
  );

  // Filter individual records.
  const visible = useMemo(
    () =>
      sorted.filter((item) =>
        matchesFilter(item, filter)
      ),
    [sorted, filter]
  );

  // Group only the filtered records.
  const visibleGroups = useMemo(
    () => groupSightings(visible),
    [visible]
  );

  const repeatedGroups = allGroups.filter(
    (group) => group.records.length >= 2
  );

  const venomousCount = sightings.filter(
    (item) => getSnake(item.snakeId)?.venomous
  ).length;

  // FIX: Give FlatList one consistent array type.
  const listData = useMemo<ListItem[]>(
    () =>
      viewMode === 'all'
        ? visible
        : visibleGroups,
    [viewMode, visible, visibleGroups]
  );

  // ---------------------------------
  // ACTIONS
  // ---------------------------------

  const toggleGroup = (key: string) => {
    setExpandedGroups((previous) =>
      previous.includes(key)
        ? previous.filter((item) => item !== key)
        : [...previous, key]
    );
  };

  const editSighting = (item: Sighting) => {
    router.push({
      pathname: '/add-sighting',
      params: {
        mode: 'edit',
        id: item.id,
      },
    });
  };

  const recordAgain = (item: Sighting) => {
    router.push({
      pathname: '/add-sighting',
      params: {
        mode: 'repeat',
        id: item.id,
      },
    });
  };

  const remove = async (id: string) => {
    try {
      const current = await loadSightings();

      const next = current.filter(
        (item) => item.id !== id
      );

      await saveSightings(next);

      setSightings(next);
    } catch (error) {
      console.error(
        'Unable to delete sighting:',
        error
      );

      if (Platform.OS === 'web') {
        window.alert(
          'Unable to delete this sighting.'
        );
      } else {
        Alert.alert(
          'Error',
          'Unable to delete this sighting.'
        );
      }
    }
  };

  const confirmDelete = (item: Sighting) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        `Delete your ${item.snakeName} sighting?`
      );

      if (confirmed) {
        void remove(item.id);
      }

      return;
    }

    Alert.alert(
      'Delete Sighting',
      `Delete your ${item.snakeName} sighting?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void remove(item.id);
          },
        },
      ]
    );
  };

  // ---------------------------------
  // INDIVIDUAL SIGHTING CARD
  // ---------------------------------

  const renderSighting = (item: Sighting) => {
    const snake = getSnake(item.snakeId);

    return (
      <View key={item.id} style={styles.card}>
        <View style={styles.main}>
          {item.photoUri ? (
            <Image
              source={{ uri: item.photoUri }}
              style={styles.thumb}
              resizeMode="cover"
            />
          ) : snake ? (
            <SnakeImage snake={snake} style={styles.thumb} />
          ) : (
            <View
              style={[
                styles.thumb,
                styles.unknownThumb,
              ]}
            >
              <Text style={styles.unknownIcon}>
                ❓
              </Text>
            </View>
          )}

          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>
              {item.snakeName}
            </Text>

            {!snake && (
              <Text style={styles.cardMeta}>❓ Unidentified — species not confirmed</Text>
            )}
            {!snake && !!item.localName && (
              <Text style={styles.cardMeta}>Local name: {item.localName}</Text>
            )}
            {!snake && !!item.description && (
              <Text style={styles.cardNotes}>Description: {item.description}</Text>
            )}

            {snake && (
              <VenomBadge
                level={snake.venomLevel}
              />
            )}

            <Text style={styles.cardMeta}>
              📅 {item.date}
            </Text>

            <Text style={styles.cardMeta}>
              🕒 Observed: {displayObservationTime(item.observedTime)}
            </Text>
            <Text style={styles.cardMeta}>
              💾 Saved: {displaySavedAt(item.savedAt)}
            </Text>

            {!!item.district && (
              <Text style={styles.cardMeta}>
                📍 {item.district}
              </Text>
            )}

            {!!item.location && (
              <Text style={styles.cardMeta}>
                {item.location}
              </Text>
            )}

            {!!item.notes && (
              <Text style={styles.cardNotes}>
                {item.notes}
              </Text>
            )}

            {!!item.photoUri && (
              <Text style={styles.photoLabel}>
                📷 Imported Picture
              </Text>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={[
              styles.action,
              styles.editButton,
            ]}
            onPress={() => editSighting(item)}
            accessibilityRole="button"
          >
            <Text style={styles.editText}>
              ✏️ Edit
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.action,
              styles.repeatButton,
            ]}
            onPress={() => recordAgain(item)}
            accessibilityRole="button"
          >
            <Text style={styles.repeatText}>
              🔁 Record Again
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.action,
              styles.deleteButton,
            ]}
            onPress={() => confirmDelete(item)}
            accessibilityRole="button"
          >
            <Text style={styles.deleteText}>
              🗑️ Delete
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  // ---------------------------------
  // GROUPED SIGHTING CARD
  // ---------------------------------

  const renderGroup = (group: SightingGroup) => {
    const expanded = expandedGroups.includes(
      group.key
    );

    const repeated = group.records.length >= 2;

    const snake = getSnake(group.snakeId);

    const medicallySignificant =
      snake?.venomLevel === 'highly_venomous';

    return (
      <View
        key={group.key}
        style={styles.groupCard}
      >
        <Pressable
          onPress={() => toggleGroup(group.key)}
          style={styles.groupHeader}
          accessibilityRole="button"
          accessibilityState={{ expanded }}
        >
          <View style={styles.groupHeadingRow}>
            <Text style={styles.groupName}>
              🐍 {group.snakeName}
            </Text>

            <Text style={styles.expandIcon}>
              {expanded ? '▲' : '▼'}
            </Text>
          </View>

          <Text style={styles.groupLocation}>
            📍 {group.location ||
              'Location not specified'}
            {group.district
              ? `, ${group.district}`
              : ''}
          </Text>

          {snake && (
            <View style={styles.badgeRow}>
              <VenomBadge
                level={snake.venomLevel}
              />
            </View>
          )}

          <View style={styles.groupStats}>
            <View style={styles.groupStat}>
              <Text style={styles.groupStatValue}>
                {group.records.length}
              </Text>

              <Text style={styles.groupStatLabel}>
                Observations
              </Text>
            </View>

            <View style={styles.groupStat}>
              <Text
                style={styles.groupStatValueSmall}
              >
                {group.lastSeen}
              </Text>

              <Text style={styles.groupStatLabel}>
                Last Recorded
              </Text>
            </View>
          </View>

          {repeated && (
            <View style={styles.repeatNotice}>
              <Text
                style={styles.repeatNoticeTitle}
              >
                ⚠️ Repeated Sighting Notice
              </Text>

              <Text
                style={styles.repeatNoticeText}
              >
                This species has been recorded
                {` ${group.records.length} times `}
                at this location. Stay alert
                and keep a safe distance from snakes.
              </Text>
            </View>
          )}

          {medicallySignificant && (
            <View style={styles.dangerNotice}>
              <Text style={styles.dangerText}>
                ⚠️ Medically significant venomous
                species. Do not approach, touch,
                or attempt to capture the snake.
              </Text>
            </View>
          )}

          {!snake && (
            <View style={styles.dangerNotice}>
              <Text style={styles.dangerText}>
                ⚠️ Species not confirmed.
                Do not assume the snake is harmless.
              </Text>
            </View>
          )}

          <Text style={styles.expandLabel}>
            {expanded
              ? 'Hide Observation History'
              : 'View Observation History'}
          </Text>
        </Pressable>

        {expanded && (
          <View style={styles.history}>
            <Text style={styles.historyTitle}>
              📅 Observation History
            </Text>

            <Text style={styles.historyMeta}>
              First recorded: {group.firstSeen}
            </Text>

            <Text style={styles.historyMeta}>
              Last recorded: {group.lastSeen}
            </Text>

            <Text style={styles.historyNote}>
              Each record is a separate observation.
              Repeated sightings do not prove
              it was the same individual snake.
            </Text>

            {group.records.map((item) =>
              renderSighting(item)
            )}
          </View>
        )}
      </View>
    );
  };

  // ---------------------------------
  // LOADING SCREEN
  // ---------------------------------

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.muted}>
          Loading sightings...
        </Text>
      </View>
    );
  }

  // ---------------------------------
  // MAIN UI
  // ---------------------------------

  return (
    <View style={styles.container}>
      <FlatList<ListItem>
        data={listData}
        keyExtractor={(item) =>
          isSighting(item)
            ? item.id
            : item.key
        }
        renderItem={({ item }) =>
          isSighting(item)
            ? renderSighting(item)
            : renderGroup(item)
        }
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.heading}>
              📍 My Snake Sightings
            </Text>

            <Text style={styles.muted}>
              Track observations and review
              repeated sightings by location.
            </Text>

            <View style={styles.summary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {sightings.length}
                </Text>

                <Text style={styles.summaryLabel}>
                  Total Sightings
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {repeatedGroups.length}
                </Text>

                <Text style={styles.summaryLabel}>
                  Repeated Locations
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <Text
                  style={[
                    styles.summaryValue,
                    { color: colors.dangerText },
                  ]}
                >
                  {venomousCount}
                </Text>

                <Text style={styles.summaryLabel}>
                  Venomous Records
                </Text>
              </View>
            </View>

            <View style={styles.viewSwitcher}>
              <Pressable
                style={[
                  styles.viewButton,
                  viewMode === 'all' &&
                    styles.activeViewButton,
                ]}
                onPress={() =>
                  setViewMode('all')
                }
              >
                <Text
                  style={[
                    styles.viewText,
                    viewMode === 'all' &&
                      styles.activeViewText,
                  ]}
                >
                  All Sightings
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.viewButton,
                  viewMode === 'grouped' &&
                    styles.activeViewButton,
                ]}
                onPress={() =>
                  setViewMode('grouped')
                }
              >
                <Text
                  style={[
                    styles.viewText,
                    viewMode === 'grouped' &&
                      styles.activeViewText,
                  ]}
                >
                  Grouped Locations
                </Text>
              </Pressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              <Chip
                label="All"
                active={filter === 'all'}
                onPress={() =>
                  setFilter('all')
                }
              />

              {(
                [
                  'highly_venomous',
                  'mildly_venomous',
                  'non_venomous',
                ] as VenomLevel[]
              ).map((level) => (
                <Chip
                  key={level}
                  label={VENOM_META[level].label}
                  active={filter === level}
                  onPress={() =>
                    setFilter(level)
                  }
                />
              ))}

              <Chip
                label="Unknown"
                active={filter === 'unknown'}
                onPress={() =>
                  setFilter('unknown')
                }
              />
            </ScrollView>

            {viewMode === 'grouped' && (
              <Text
                style={styles.groupExplanation}
              >
                Grouped by species, district,
                and matching location text.
                Locations without a description
                remain separate.
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>
              📍
            </Text>

            <Text style={styles.emptyTitle}>
              {sightings.length === 0
                ? 'No Sightings Yet'
                : 'No Sightings Match This Filter'}
            </Text>

            <Text style={styles.muted}>
              {sightings.length === 0
                ? 'Tap + to record your first sighting.'
                : 'Choose another filter.'}
            </Text>
          </View>
        }
        ListFooterComponent={
          <Text style={styles.footer}>
            Sighting patterns are based only
            on records saved in this app.
            They do not show live snake locations
            or predict risk.
          </Text>
        }
      />

      <Pressable
        style={styles.fab}
        onPress={() =>
          router.push('/add-sighting')
        }
        accessibilityRole="button"
        accessibilityLabel="Add sighting"
      >
        <Text style={styles.fabText}>
          +
        </Text>
      </Pressable>
    </View>
  );
}

// ---------------------------------
// STYLES
// ---------------------------------

const makeStyles = (c: typeof themeColors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },

  content: {
    padding: 16,
    paddingBottom: 100,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: c.background,
  },

  heading: {
    fontSize: 23,
    fontWeight: '800',
    color: c.primary,
  },

  muted: {
    color: c.muted,
    fontSize: 14,
    lineHeight: 21,
  },

  header: {
    gap: 14,
    marginBottom: 18,
  },

  summary: {
    flexDirection: 'row',
    gap: 8,
  },

  summaryItem: {
    flex: 1,
    backgroundColor: c.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
    padding: 10,
    alignItems: 'center',
  },

  summaryValue: {
    fontSize: 25,
    fontWeight: '800',
    color: c.primary,
  },

  summaryLabel: {
    fontSize: 11,
    color: c.muted,
    textAlign: 'center',
    marginTop: 5,
  },

  viewSwitcher: {
    flexDirection: 'row',
    gap: 8,
  },

  viewButton: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: c.card,
    borderWidth: 1,
    borderColor: c.border,
    alignItems: 'center',
  },

  activeViewButton: {
    backgroundColor: c.primary,
    borderColor: c.primary,
  },

  viewText: {
    fontSize: 13,
    fontWeight: '700',
    color: c.primary,
    textAlign: 'center',
  },

  activeViewText: {
    color: c.white,
  },

  chipRow: {
    gap: 8,
    paddingRight: 8,
  },

  groupExplanation: {
    fontSize: 12,
    color: c.muted,
    lineHeight: 19,
  },

  card: {
    backgroundColor: c.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: c.border,
    marginBottom: 12,
    overflow: 'hidden',
  },

  main: {
    flexDirection: 'row',
  },

  thumb: {
    width: 95,
    minHeight: 115,
    backgroundColor: c.border,
  },

  unknownThumb: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  unknownIcon: {
    fontSize: 30,
  },

  cardBody: {
    flex: 1,
    padding: 12,
    gap: 5,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: c.primary,
  },

  cardMeta: {
    fontSize: 13,
    color: c.muted,
  },

  cardNotes: {
    fontSize: 14,
    color: c.text,
    lineHeight: 21,
  },

  photoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: c.primary,
  },

  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: c.border,
  },

  action: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 9,
    alignItems: 'center',
  },

  editButton: {
    backgroundColor: c.background === themeColors.dark.background ? '#20394D' : '#E3F2FD',
  },

  editText: {
    color: c.background === themeColors.dark.background ? '#9FD3FF' : '#1565C0',
    fontWeight: '700',
  },

  repeatButton: {
    backgroundColor: c.background === themeColors.dark.background ? '#244332' : '#E8F5E9',
  },

  repeatText: {
    color: c.background === themeColors.dark.background ? '#A8E6B4' : '#1B5E20',
    fontWeight: '700',
  },

  deleteButton: {
    backgroundColor: c.dangerBackground,
  },

  deleteText: {
    color: c.dangerText,
    fontWeight: '700',
  },

  groupCard: {
    backgroundColor: c.card,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: c.border,
    marginBottom: 15,
    overflow: 'hidden',
  },

  groupHeader: {
    padding: 16,
    gap: 12,
  },

  groupHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },

  groupName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: c.primary,
  },

  expandIcon: {
    color: c.primary,
    fontSize: 14,
  },

  groupLocation: {
    color: c.muted,
    fontSize: 14,
    lineHeight: 21,
  },

  badgeRow: {
    alignSelf: 'flex-start',
  },

  groupStats: {
    flexDirection: 'row',
    gap: 10,
  },

  groupStat: {
    flex: 1,
    backgroundColor: c.background,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },

  groupStatValue: {
    color: c.primary,
    fontSize: 24,
    fontWeight: '800',
  },

  groupStatValueSmall: {
    color: c.primary,
    fontSize: 14,
    fontWeight: '800',
  },

  groupStatLabel: {
    color: c.muted,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },

  repeatNotice: {
    backgroundColor: c.background === themeColors.dark.background ? '#4A371A' : '#FFF3CD',
    borderColor: '#E8B84A',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    gap: 6,
  },

  repeatNoticeTitle: {
    color: c.background === themeColors.dark.background ? '#FFE4A0' : '#754A00',
    fontWeight: '800',
    fontSize: 14,
  },

  repeatNoticeText: {
    color: c.background === themeColors.dark.background ? '#FFE4A0' : '#754A00',
    fontSize: 13,
    lineHeight: 20,
  },

  dangerNotice: {
    backgroundColor: c.dangerBackground,
    borderRadius: 10,
    padding: 12,
  },

  dangerText: {
    color: c.dangerText,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
  },

  expandLabel: {
    textAlign: 'center',
    color: c.primary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 3,
  },

  history: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: c.border,
    backgroundColor: c.background,
  },

  historyTitle: {
    color: c.primary,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },

  historyMeta: {
    color: c.muted,
    fontSize: 13,
    marginBottom: 5,
  },

  historyNote: {
    color: c.muted,
    fontSize: 12,
    lineHeight: 19,
    marginVertical: 12,
  },

  empty: {
    alignItems: 'center',
    padding: 36,
    gap: 8,
  },

  emptyIcon: {
    fontSize: 38,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: c.primary,
    textAlign: 'center',
  },

  footer: {
    color: c.muted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 18,
    marginBottom: 10,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: c.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },

  fabText: {
    color: c.white,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '300',
  },
});
