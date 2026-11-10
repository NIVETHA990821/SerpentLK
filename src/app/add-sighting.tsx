
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';

import {
    Alert,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import type { Sighting } from '@/types/sighting';

const STORAGE_KEY = '@serpentlk_sightings';

function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date <= new Date()
  );
}

export default function AddSightingScreen() {
  const [snakeName, setSnakeName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const saveSighting = async () => {
    if (saving) return;

    setError('');

    if (!snakeName.trim() || !location.trim() || !date.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isValidDate(date.trim())) {
      setError('Enter a valid date in YYYY-MM-DD format. Future dates are not allowed.');
      return;
    }

    setSaving(true);

    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);

      let existingSightings: Sighting[] = [];

      if (storedData !== null) {
        const parsedData: unknown = JSON.parse(storedData);

        if (!Array.isArray(parsedData)) {
          throw new Error('Saved sightings are not in a valid format.');
        }

        existingSightings = parsedData as Sighting[];
      }

      const newSighting: Sighting = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        snakeName: snakeName.trim(),
        location: location.trim(),
        date: date.trim(),
        notes: notes.trim(),
      };

      const updatedSightings = [newSighting, ...existingSightings];

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedSightings)
      );

      if (Platform.OS !== 'web') {
        Alert.alert('Success', 'Your sighting has been saved.');
      }

      router.replace('/sightings');
    } catch (err) {
      console.error('Failed to save sighting:', err);
      setError('Unable to save your sighting. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Add New Sighting</Text>

      <Text style={styles.subtitle}>
        Record a snake you observed from a safe distance.
        Your information will be saved locally.
      </Text>

      <View style={styles.formCard}>
        <Text style={styles.label}>Snake Name *</Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Indian Cobra or Unknown"
          placeholderTextColor="#888888"
          value={snakeName}
          onChangeText={setSnakeName}
          maxLength={100}
        />

        <Text style={styles.label}>Location *</Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Home garden"
          placeholderTextColor="#888888"
          value={location}
          onChangeText={setLocation}
          maxLength={150}
        />

        <Text style={styles.label}>Date *</Text>

        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#888888"
          value={date}
          onChangeText={setDate}
          maxLength={10}
        />

        <Text style={styles.helperText}>
          Format: YYYY-MM-DD (example: 2026-11-10)
        </Text>

        <Text style={styles.label}>Notes (Optional)</Text>

        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Describe what you observed..."
          placeholderTextColor="#888888"
          value={notes}
          onChangeText={setNotes}
          multiline
          textAlignVertical="top"
          maxLength={500}
        />

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.pressedButton,
            saving && styles.disabledButton,
          ]}
          onPress={saveSighting}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Sighting'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.cancelButton}
          onPress={() => router.replace('/sightings')}
          disabled={saving}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </View>

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Safety Reminder</Text>

        <Text style={styles.noticeText}>
          Never approach, touch or capture a snake to record
          a sighting. If you cannot identify it confidently,
          enter "Unknown" instead of guessing.
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

  heading: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: '#555555',
    lineHeight: 23,
    marginBottom: 20,
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: '#C8D6C9',
    borderRadius: 9,
    padding: 13,
    fontSize: 15,
    color: '#222222',
    backgroundColor: '#FFFFFF',
  },

  notesInput: {
    height: 110,
    paddingTop: 13,
  },

  helperText: {
    fontSize: 12,
    color: '#777777',
    marginTop: 6,
  },

  errorText: {
    fontSize: 14,
    color: '#B71C1C',
    marginTop: 15,
    lineHeight: 21,
  },

  saveButton: {
    backgroundColor: '#1B5E20',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },

  pressedButton: {
    opacity: 0.7,
  },

  disabledButton: {
    opacity: 0.5,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  cancelButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 8,
  },

  cancelButtonText: {
    color: '#666666',
    fontSize: 15,
  },

  notice: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: 12,
    padding: 18,
    marginTop: 20,
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
