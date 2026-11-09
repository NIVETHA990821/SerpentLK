
import { useState } from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import snakes from '@/data/snakes.json';

type FilterType = 'all' | 'venomous' | 'nonvenomous';

export default function SnakeListScreen() {
  // Store the text entered in the search bar
  const [search, setSearch] = useState('');

  // Store the selected filter
  const [filter, setFilter] = useState<FilterType>('all');

  // Search and filter the local snake dataset
  const filteredSnakes = snakes.filter((snake) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      snake.name.toLowerCase().includes(searchText) ||
      snake.scientificName.toLowerCase().includes(searchText);

    const matchesFilter =
      filter === 'all' ||
      (filter === 'venomous' && snake.venomous) ||
      (filter === 'nonvenomous' && !snake.venomous);

    return matchesSearch && matchesFilter;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Explore Snakes</Text>

      <Text style={styles.subtitle}>
        Discover snakes found in Sri Lanka.
      </Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by snake name..."
        placeholderTextColor="#777777"
        value={search}
        onChangeText={setSearch}
        autoCorrect={false}
        accessibilityLabel="Search snakes"
      />

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <Pressable
          style={[
            styles.filterButton,
            filter === 'all' && styles.activeFilter,
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'all' && styles.activeFilterText,
            ]}
          >
            All
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            filter === 'venomous' && styles.activeFilter,
          ]}
          onPress={() => setFilter('venomous')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'venomous' && styles.activeFilterText,
            ]}
          >
            Venomous
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            filter === 'nonvenomous' && styles.activeFilter,
          ]}
          onPress={() => setFilter('nonvenomous')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'nonvenomous' && styles.activeFilterText,
            ]}
          >
            Non-venomous
          </Text>
        </Pressable>
      </View>

      {/* Results Count */}
      <Text style={styles.resultCount}>
        {filteredSnakes.length} snakes found
      </Text>

      {/* Snake List */}
      {filteredSnakes.map((snake) => (
        <View key={snake.id} style={styles.card}>
          <Text style={styles.name}>{snake.name}</Text>

          <Text style={styles.scientificName}>
            {snake.scientificName}
          </Text>

          <Text style={styles.description}>
            {snake.description}
          </Text>

          <Text style={styles.venomStatus}>
            {snake.venomous ? 'Venomous' : 'Non-venomous'}
          </Text>
        </View>
      ))}

      {/* No Results Message */}
      {filteredSnakes.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            No snakes found
          </Text>

          <Text style={styles.emptyMessage}>
            Try another search or filter.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#555555',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#222222',
    marginBottom: 18,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#388E3C',
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: '#1B5E20',
  },
  filterText: {
    color: '#1B5E20',
    fontSize: 13,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  resultCount: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 15,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#388E3C',
  },
  name: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  scientificName: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666666',
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: '#555555',
    marginTop: 8,
  },
  venomStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginTop: 10,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
});
