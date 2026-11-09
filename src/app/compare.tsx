
import { useState } from 'react';

import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import snakes from '@/data/snakes.json';

export default function CompareScreen() {
  const [firstId, setFirstId] = useState<string>(snakes[0]?.id ?? '');
  const [secondId, setSecondId] = useState<string>(snakes[1]?.id ?? '');

  const firstSnake = snakes.find((snake) => snake.id === firstId);
  const secondSnake = snakes.find((snake) => snake.id === secondId);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.heading}>Compare Snakes</Text>

      <Text style={styles.subtitle}>
        Select two different snakes to compare their information.
      </Text>

      <Text style={styles.label}>Select First Snake</Text>

      <View style={styles.options}>
        {snakes.map((snake) => (
          <Pressable
            key={snake.id}
            style={[
              styles.option,
              firstId === snake.id && styles.selectedOption,
            ]}
            onPress={() => setFirstId(snake.id)}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.optionText,
                firstId === snake.id && styles.selectedText,
              ]}
            >
              {snake.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Select Second Snake</Text>

      <View style={styles.options}>
        {snakes.map((snake) => (
          <Pressable
            key={snake.id}
            style={[
              styles.option,
              secondId === snake.id && styles.selectedOption,
            ]}
            onPress={() => setSecondId(snake.id)}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.optionText,
                secondId === snake.id && styles.selectedText,
              ]}
            >
              {snake.name}
            </Text>
          </Pressable>
        ))}
      </View>

      {firstId === secondId ? (
        <View style={styles.warningBox}>
          <Text style={styles.warning}>
            Please select two different snakes.
          </Text>
        </View>
      ) : firstSnake && secondSnake ? (
        <View>
          <Text style={styles.comparisonHeading}>
            Comparison Results
          </Text>

          <View style={styles.comparison}>
            <View style={styles.column}>
              <Text style={styles.snakeName}>
                {firstSnake.name}
              </Text>

              <Text style={styles.scientific}>
                {firstSnake.scientificName}
              </Text>

              <Text style={styles.fieldLabel}>
                Venom Status
              </Text>

              <Text style={styles.value}>
                {firstSnake.venomous
                  ? 'Venomous'
                  : 'Non-venomous'}
              </Text>

              <Text style={styles.fieldLabel}>
                Description
              </Text>

              <Text style={styles.description}>
                {firstSnake.description}
              </Text>
            </View>

            <View style={styles.column}>
              <Text style={styles.snakeName}>
                {secondSnake.name}
              </Text>

              <Text style={styles.scientific}>
                {secondSnake.scientificName}
              </Text>

              <Text style={styles.fieldLabel}>
                Venom Status
              </Text>

              <Text style={styles.value}>
                {secondSnake.venomous
                  ? 'Venomous'
                  : 'Non-venomous'}
              </Text>

              <Text style={styles.fieldLabel}>
                Description
              </Text>

              <Text style={styles.description}>
                {secondSnake.description}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <Text style={styles.warning}>
          Snake information is unavailable.
        </Text>
      )}

      <Text style={styles.disclaimer}>
        This comparison is for educational purposes only.
        Never approach or handle an unknown snake.
        Appearance alone cannot reliably identify a snake.
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

  subtitle: {
    fontSize: 15,
    color: '#555555',
    marginBottom: 20,
    lineHeight: 22,
  },

  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginTop: 15,
    marginBottom: 12,
  },

  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  option: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#388E3C',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  selectedOption: {
    backgroundColor: '#1B5E20',
  },

  optionText: {
    color: '#1B5E20',
    fontSize: 13,
    fontWeight: '600',
  },

  selectedText: {
    color: '#FFFFFF',
  },

  warningBox: {
    backgroundColor: '#FFEBEE',
    padding: 18,
    borderRadius: 12,
    marginTop: 25,
  },

  warning: {
    color: '#B71C1C',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },

  comparisonHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginTop: 28,
    marginBottom: 15,
  },

  comparison: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'stretch',
  },

  column: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderTopWidth: 4,
    borderTopColor: '#388E3C',
  },

  snakeName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },

  scientific: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#666666',
    marginBottom: 15,
  },

  fieldLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555555',
    marginTop: 10,
    marginBottom: 5,
  },

  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },

  description: {
    fontSize: 13,
    color: '#444444',
    lineHeight: 20,
  },

  disclaimer: {
    marginTop: 25,
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 19,
  },
});
