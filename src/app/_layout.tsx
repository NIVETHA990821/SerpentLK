import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppThemeProvider, useAppTheme } from '@/context/app-theme';
import { FavouritesProvider } from '@/context/favourites';
import { SettingsProvider } from '@/context/settings';

function AppNavigation() {
  const { colors } = useAppTheme();

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.primaryText,
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="snake/[id]" options={{ title: 'Snake Details' }} />
        <Stack.Screen name="identify" options={{ title: 'Identify a Snake' }} />
        <Stack.Screen name="compare" options={{ title: 'Compare Snakes' }} />
        <Stack.Screen name="add-sighting" options={{ title: 'Add Sighting' }} />
        <Stack.Screen name="about" options={{ title: 'About & Settings' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <SettingsProvider>
        <FavouritesProvider>
          <AppNavigation />
        </FavouritesProvider>
      </SettingsProvider>
    </AppThemeProvider>
  );
}
