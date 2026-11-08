
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🐍 SerpentLK</Text>
        <Text style={styles.subtitle}>
          Sri Lankan Snake Identification Guide
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Explore Snakes</Text>
        <Text style={styles.description}>
          Discover snakes found in Sri Lanka.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Compare Snakes</Text>
        <Text style={styles.description}>
          Learn how similar-looking snakes differ.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>First-Aid Guide</Text>
        <Text style={styles.description}>
          Learn important snakebite safety information.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>My Sightings</Text>
        <Text style={styles.description}>
          Keep a record of snakes you have observed.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    padding: 20,
  },
  header: {
    backgroundColor: '#1B5E20',
    padding: 30,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 15,
    color: '#E8F5E9',
    marginTop: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#388E3C',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  description: {
    fontSize: 14,
    color: '#555555',
    marginTop: 8,
  },
});
