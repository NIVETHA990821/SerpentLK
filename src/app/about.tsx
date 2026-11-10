
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const features = [
  {
    icon: '🔍',
    title: 'Explore Snakes',
    description: 'Browse and search Sri Lankan snake species.',
  },
  {
    icon: '⚖️',
    title: 'Compare Snakes',
    description: 'Compare information about two snake species.',
  },
  {
    icon: '🩹',
    title: 'First-Aid Guide',
    description: 'Read offline snakebite safety information.',
  },
  {
    icon: '📍',
    title: 'My Sightings',
    description: 'Record and view snake sightings locally.',
  },
];

export default function AboutScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>🐍</Text>
        <Text style={styles.appName}>SerpentLK</Text>
        <Text style={styles.tagline}>
          Sri Lankan Snake Identification Guide
        </Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          About SerpentLK
        </Text>

        <Text style={styles.paragraph}>
          SerpentLK is an educational mobile application
          designed to help users learn about snake species
          found in Sri Lanka.
        </Text>

        <Text style={styles.paragraph}>
          The application provides species information,
          snake comparisons, first-aid guidance and a
          personal snake sighting record system.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Application Features
        </Text>

        {features.map((feature) => (
          <View key={feature.title} style={styles.featureRow}>
            <Text style={styles.featureIcon}>
              {feature.icon}
            </Text>

            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>
                {feature.title}
              </Text>

              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Offline Functionality
        </Text>

        <Text style={styles.paragraph}>
          SerpentLK stores its snake information and
          first-aid guide inside the application.
          These features do not require an internet
          connection after the app is installed.
        </Text>

        <Text style={styles.paragraph}>
          Personal sighting records are saved locally
          using AsyncStorage. They are not automatically
          uploaded to an online database.
        </Text>
      </View>

      <View style={styles.safetyCard}>
        <Text style={styles.safetyTitle}>
          ⚠️ Important Safety Information
        </Text>

        <Text style={styles.safetyText}>
          SerpentLK is intended for educational purposes.
          It cannot reliably identify an unknown snake
          or determine whether a snakebite is harmless.
        </Text>

        <Text style={styles.safetyText}>
          Never approach, touch or capture a snake.
          Seek urgent medical care after any suspected
          snakebite. Do not delay treatment to use this app.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>
          SerpentLK
        </Text>

        <Text style={styles.footerText}>
          Educational Project
        </Text>

        <Text style={styles.footerText}>
          Made with React Native and Expo
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
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    backgroundColor: '#1B5E20',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },

  logo: {
    fontSize: 55,
    marginBottom: 10,
  },

  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  tagline: {
    fontSize: 14,
    color: '#E8F5E9',
    textAlign: 'center',
    marginTop: 8,
  },

  version: {
    fontSize: 12,
    color: '#C8E6C9',
    marginTop: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 15,
  },

  paragraph: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 23,
    marginBottom: 12,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },

  featureIcon: {
    fontSize: 26,
    marginRight: 14,
  },

  featureContent: {
    flex: 1,
  },

  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 5,
  },

  featureDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
  },

  safetyCard: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 5,
    borderLeftColor: '#C62828',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },

  safetyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B71C1C',
    marginBottom: 12,
  },

  safetyText: {
    fontSize: 14,
    color: '#7F1D1D',
    lineHeight: 23,
    marginBottom: 10,
  },

  footer: {
    alignItems: 'center',
    marginTop: 10,
  },

  footerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
  },

  footerText: {
    fontSize: 12,
    color: '#777777',
    marginTop: 6,
  },
});
