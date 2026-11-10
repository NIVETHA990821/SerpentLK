
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import firstAid from '@/data/firstAid.json';

export default function FirstAidScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Page Heading */}
      <Text style={styles.heading}>
        {firstAid.title}
      </Text>

      <Text style={styles.subtitle}>
        Important safety information for snakebite emergencies.
      </Text>

      {/* Emergency Message */}
      <View style={styles.emergencyBox}>
        <Text style={styles.emergencyTitle}>
          ⚠️ Medical Emergency
        </Text>

        <Text style={styles.emergencyText}>
          {firstAid.emergencyMessage}
        </Text>
      </View>

      {/* First-Aid Steps */}
      <Text style={styles.sectionTitle}>
        What You Should Do
      </Text>

      {firstAid.steps.map((step, index) => (
        <View key={step.id} style={styles.stepCard}>
          <View style={styles.numberCircle}>
            <Text style={styles.numberText}>
              {index + 1}
            </Text>
          </View>

          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>
              {step.title}
            </Text>

            <Text style={styles.stepDescription}>
              {step.description}
            </Text>
          </View>
        </View>
      ))}

      {/* Actions to Avoid */}
      <Text style={styles.sectionTitle}>
        What You Should NOT Do
      </Text>

      {firstAid.donts.map((item) => (
        <View key={item.id} style={styles.dontCard}>
          <Text style={styles.dontIcon}>✕</Text>

          <View style={styles.stepContent}>
            <Text style={styles.dontTitle}>
              {item.title}
            </Text>

            <Text style={styles.stepDescription}>
              {item.description}
            </Text>
          </View>
        </View>
      ))}

      {/* Additional Reminder */}
      <View style={styles.reminderBox}>
        <Text style={styles.reminderTitle}>
          Remember
        </Text>

        <Text style={styles.reminderText}>
          Even if there is no pain or swelling, a suspected
          snakebite needs urgent medical assessment.
          Do not rely on the app to identify the snake
          or decide whether treatment is necessary.
        </Text>
      </View>

      {/* Disclaimer */}
      <Text style={styles.disclaimer}>
        {firstAid.disclaimer}
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
    fontSize: 27,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: '#555555',
    lineHeight: 22,
    marginBottom: 20,
  },

  emergencyBox: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 5,
    borderLeftColor: '#C62828',
    padding: 18,
    borderRadius: 12,
    marginBottom: 25,
  },

  emergencyTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#B71C1C',
    marginBottom: 10,
  },

  emergencyText: {
    fontSize: 15,
    color: '#7F1D1D',
    lineHeight: 23,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 15,
    marginTop: 10,
  },

  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#388E3C',
  },

  numberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1B5E20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  numberText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  stepContent: {
    flex: 1,
  },

  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 7,
  },

  stepDescription: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 22,
  },

  dontCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#C62828',
  },

  dontIcon: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#C62828',
    marginRight: 14,
  },

  dontTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B71C1C',
    marginBottom: 7,
  },

  reminderBox: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: 12,
    padding: 18,
    marginTop: 20,
  },

  reminderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },

  reminderText: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 23,
  },

  disclaimer: {
    fontSize: 12,
    color: '#777777',
    textAlign: 'center',
    marginTop: 25,
    lineHeight: 19,
  },
});
