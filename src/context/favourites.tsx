import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { loadFavourites, saveFavourites } from '@/utils/storage';

type FavouritesValue = {
  favourites: string[];
  isFavourite: (id: string) => boolean;
  toggleFavourite: (id: string) => void;
};

const FavouritesContext = createContext<FavouritesValue>({
  favourites: [],
  isFavourite: () => false,
  toggleFavourite: () => {},
});

// Loads favourites once at start-up and saves after every change,
// so every screen shows the same hearts.
export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<string[]>([]);

  useEffect(() => {
    loadFavourites().then(setFavourites);
  }, []);

  const toggleFavourite = useCallback((id: string) => {
    setFavourites((current) => {
      const next = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id];
      saveFavourites(next).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      favourites,
      isFavourite: (id: string) => favourites.includes(id),
      toggleFavourite,
    }),
    [favourites, toggleFavourite]
  );

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

export const useFavourites = () => useContext(FavouritesContext);
