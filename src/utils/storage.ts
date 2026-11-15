import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Sighting } from '@/types/sighting';

export const SIGHTINGS_KEY = '@serpentlk_sightings';
export const FAVOURITES_KEY = '@serpentlk_favourites';

async function loadList<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export const loadSightings = () => loadList<Sighting>(SIGHTINGS_KEY);

export const saveSightings = (list: Sighting[]) =>
  AsyncStorage.setItem(SIGHTINGS_KEY, JSON.stringify(list));

export const loadFavourites = () => loadList<string>(FAVOURITES_KEY);

export const saveFavourites = (ids: string[]) =>
  AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(ids));
