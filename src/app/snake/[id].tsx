
import { useLocalSearchParams } from 'expo-router';

import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import snakes from '@/data/snakes.json';

export default function SnakeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const snake = snakes.find((item) => item.id === id);

  if (!snake) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Snake not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.heading}>{snake.name}</Text>

      <Text style={styles.scientificName}>
        {snake.scientificName}
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Venom Status</Text>

        <Text style={styles.value}>
          {snake.venomous ? 'Venomous' : 'Non-venomous'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Description</Text>

        <Text style={styles.value}>
          {snake.description}
        </Text>
      </View>

      <Text style={styles.disclaimer}>
        Do not approach or handle snakes. This guide is for
        educational purposes and cannot confirm a snake's
        identity from appearance alone.
      </Text>
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
  scientificName: {
    fontSize: 17,
    fontStyle: 'italic',
    color: '#666666',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },
  value: {
    fontSize: 15,
    color: '#444444',
    lineHeight: 24,
  },
  disclaimer: {
    fontSize: 13,
    color: '#666666',
    marginTop: 16,
    lineHeight: 20,
  },
});
