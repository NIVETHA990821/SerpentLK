
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import snakes from '@/data/snakes.json';

export default function SnakeListScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.heading}>Explore Snakes</Text>

      <Text style={styles.subtitle}>
        Discover snakes found in Sri Lanka.
      </Text>

      {snakes.map((snake) => (
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
});
