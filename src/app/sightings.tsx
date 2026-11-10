
import { useCallback, useState } from 'react';

import { useFocusEffect } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { Sighting } from '@/types/sighting';

const STORAGE_KEY = '@serpentlk_sightings';

export default function SightingsScreen() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSightings = async () => {
    setLoading(true);
    setError('');

    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);

      if (storedData) {
        const parsedData = JSON.parse(storedData);

        if (Array.isArray(parsedData)) {
          setSightings(parsedData);
        } else {
          setSightings([]);
          setError('Saved sightings have an invalid format.');
        }
      } else {
        setSightings([]);
      }
    } catch (err) {
      console.error('Failed to load sightings:', err);
      setSightings([]);
      setError('Unable to load saved sightings.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSightings();
    }, [])
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.heading}>My Sightings</Text>

      <Text style={styles.subtitle}>
        View your locally saved snake sighting records.
      </Text>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#1B5E20" />

          <Text style={styles.message}>
            Loading sightings...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : sightings.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>📍</Text>

          <Text style={styles.emptyTitle}>
            No Sightings Yet
          </Text>

          <Text style={styles.emptyMessage}>
            You have not saved any snake sightings.
          </Text>

          <Text style={styles.comingSoon}>
            The Add Sighting feature will be available
            in Level 10.
          </Text>
        </View>
      ) : (
        <View>
          <Text style={styles.resultCount}>
            {sightings.length} saved sightings
          </Text>

          {sightings.map((sighting) => (
            <View key={sighting.id} style={styles.card}>
              <Text style={styles.snakeName}>
                {sighting.snakeName}
              </Text>

              <Text style={styles.detail}>
                📍 {sighting.location}
              </Text>

              <Text style={styles.detail}>
                📅 {sighting.date}
              </Text>

              {sighting.notes ? (
                <Text style={styles.notes}>
                  {sighting.notes}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      )}

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>
          Safety Reminder
        </Text>

        <Text style={styles.noticeText}>
          Observe snakes only from a safe distance.
          Never approach, touch, or capture a snake
          to record a sighting.
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
    flexGrow: 1,
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
    lineHeight: 22,
    marginBottom: 25,
  },

  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  message: {
    fontSize: 15,
    color: '#555555',
    marginTop: 12,
  },

  errorText: {
    fontSize: 15,
    color: '#B71C1C',
    textAlign: 'center',
  },

  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },

  emptyIcon: {
    fontSize: 45,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 10,
  },

  emptyMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },

  comingSoon: {
    fontSize: 13,
    color: '#888888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 15,
  },

  resultCount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 15,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#388E3C',
  },

  snakeName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 10,
  },

  detail: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 7,
  },

  notes: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 21,
    marginTop: 8,
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
