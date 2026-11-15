import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import type { Snake } from '@/types/snake';
import { cachePhoto, fetchPhoto, type Photo } from '@/utils/photos';
import { snakes } from '@/utils/snakes';

const SETTINGS_KEY = '@serpentlk_settings';
const PHOTOS_KEY = '@serpentlk_photo_index';

type Settings = { showPhotos: boolean };

type SettingsValue = Settings & {
  setShowPhotos: (on: boolean) => void;
  photoFor: (snake: Snake) => Photo | undefined;
  requestPhoto: (snake: Snake) => void;
  downloadAllPhotos: (onProgress?: (done: number, total: number) => void) => Promise<number>;
  savedPhotoCount: number;
};

const SettingsContext = createContext<SettingsValue | null>(null);

// Holds the "show real photos" choice and the index of photos found so far.
// The index is saved so a photo found once is never looked up again.
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({ showPhotos: true });
  const [photos, setPhotos] = useState<Record<string, Photo>>({});
  const requested = useRef(new Set<string>());

  useEffect(() => {
    AsyncStorage.multiGet([SETTINGS_KEY, PHOTOS_KEY])
      .then(([[, s], [, p]]) => {
        if (s) setSettings((cur) => ({ ...cur, ...(JSON.parse(s) as Partial<Settings>) }));
        if (p) setPhotos(JSON.parse(p) as Record<string, Photo>);
      })
      .catch(() => {});
  }, []);

  const setShowPhotos = useCallback((on: boolean) => {
    setSettings((cur) => {
      const next = { ...cur, showPhotos: on };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const remember = useCallback((id: string, photo: Photo) => {
    setPhotos((cur) => {
      const next = { ...cur, [id]: photo };
      AsyncStorage.setItem(PHOTOS_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const requestPhoto = useCallback(
    (snake: Snake) => {
      if (!settings.showPhotos || photos[snake.id] || requested.current.has(snake.id)) return;
      requested.current.add(snake.id);
      fetchPhoto(snake).then((photo) => {
        if (photo) remember(snake.id, photo);
        else requested.current.delete(snake.id); // allow a retry later, e.g. once online
      });
    },
    [settings.showPhotos, photos, remember]
  );

  const downloadAllPhotos = useCallback(
    async (onProgress?: (done: number, total: number) => void) => {
      let saved = 0;
      for (let i = 0; i < snakes.length; i++) {
        const snake = snakes[i];
        const photo = photos[snake.id] ?? (await fetchPhoto(snake));
        if (photo) {
          remember(snake.id, photo);
          if (await cachePhoto(photo.url).catch(() => false)) saved++;
        }
        onProgress?.(i + 1, snakes.length);
      }
      return saved;
    },
    [photos, remember]
  );

  const value = useMemo<SettingsValue>(
    () => ({
      ...settings,
      setShowPhotos,
      photoFor: (snake) => (settings.showPhotos ? photos[snake.id] : undefined),
      requestPhoto,
      downloadAllPhotos,
      savedPhotoCount: Object.keys(photos).length,
    }),
    [settings, photos, setShowPhotos, requestPhoto, downloadAllPhotos]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
