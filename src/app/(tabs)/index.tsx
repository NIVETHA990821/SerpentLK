
import { router } from 'expo-router';

import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* App Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🐍</Text>

        <Text style={styles.title}>SerpentLK</Text>

        <Text style={styles.subtitle}>
          Sri Lankan Snake Identification Guide
        </Text>
      </View>

      {/* Welcome Section */}
      <Text style={styles.welcome}>
        Welcome to SerpentLK
      </Text>

      <Text style={styles.description}>
        Explore information about snakes found in Sri Lanka,
        compare species, and learn about snake safety.
      </Text>

      {/* Explore Snakes */}
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
        onPress={() => router.push('/snakes')}
      >
        <Text style={styles.cardIcon}>🔍</Text>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            Explore Snakes
          </Text>

          <Text style={styles.cardDescription}>
            Search and discover Sri Lankan snake species.
          </Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </Pressable>

      {/* Compare Snakes */}
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
        onPress={() => router.push('/compare')}
      >
        <Text style={styles.cardIcon}>⚖️</Text>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            Compare Snakes
          </Text>

          <Text style={styles.cardDescription}>
            Compare two snakes side by side.
          </Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </Pressable>

      {/* First Aid - Future Level */}
      <View style={styles.card}>
        <Text style={styles.cardIcon}>🩹</Text>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            First-Aid Guide
          </Text>

          <Text style={styles.cardDescription}>
            Learn snakebite safety and first-aid guidance.
          </Text>

          <Text style={styles.comingSoon}>
            Coming in Level 8
          </Text>
        </View>
      </View>

      {/* My Sightings - Future Level */}
      <View style={styles.card}>
        <Text style={styles.cardIcon}>📍</Text>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            My Sightings
          </Text>

          <Text style={styles.cardDescription}>
            Save and manage your snake sighting records.
          </Text>

          <Text style={styles.comingSoon}>
            Coming in Level 9
          </Text>
        </View>
      </View>

      {/* Safety Notice */}
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>
          Safety Reminder
        </Text>

        <Text style={styles.noticeText}>
          Never approach or handle an unknown snake.
          SerpentLK is an educational guide, not a
          professional identification service.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },

  content: {
    paddingBottom: 40,
  },

  header: {
    backgroundColor: '#1B5E20',
    paddingVertical: 35,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  logo: {
    fontSize: 48,
    marginBottom: 10,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  subtitle: {
    fontSize: 15,
    color: '#E8F5E9',
    marginTop: 8,
    textAlign: 'center',
  },

  welcome: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    color: '#555555',
    lineHeight: 23,
    marginHorizontal: 20,
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 18,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: '#388E3C',
  },

  cardPressed: {
    opacity: 0.7,
  },

  cardIcon: {
    fontSize: 30,
    marginRight: 15,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 5,
  },

  cardDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
  },

  comingSoon: {
    fontSize: 12,
    color: '#888888',
    fontStyle: 'italic',
    marginTop: 8,
  },

  arrow: {
    fontSize: 30,
    color: '#388E3C',
    marginLeft: 10,
  },

  notice: {
    backgroundColor: '#E8F5E9',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },

  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },

  noticeText: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 21,
  },
});
