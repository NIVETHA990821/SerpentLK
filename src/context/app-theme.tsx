
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = '@serpentlk_theme';

export const themeColors = {
  light: {
    background: '#F4F5F0',
    card: '#FFFFFF',
    text: '#15201A',
    muted: '#5C6A62',
    border: '#E1E6DF',
    primary: '#123528',
    primaryText: '#FFFFFF',
    soft: '#E3EEE6',
    dangerBackground: '#FDECEA',
    dangerText: '#B42318',
    white: '#FFFFFF',
  },
  dark: {
    background: '#101A16',
    card: '#1D2A24',
    text: '#F2F5F2',
    muted: '#B6C4B9',
    border: '#34483B',
    primary: '#285A3D',
    primaryText: '#FFFFFF',
    soft: '#293D30',
    dangerBackground: '#452326',
    dangerText: '#FFB4AB',
    white: '#FFFFFF',
  },
};

type ThemeContextType = {
  mode: ThemeMode;
  colors: typeof themeColors.light;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function AppThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === 'light' || saved === 'dark') {
          setMode(saved);
        }
      })
      .catch(() => {});
  }, []);

  const toggleTheme = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        colors: themeColors[mode],
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useAppTheme must be used inside AppThemeProvider'
    );
  }

  return context;
}
