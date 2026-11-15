import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppThemeProvider, useAppTheme } from '@/context/app-theme';
import { FavouritesProvider } from '@/context/favourites';
import { SettingsProvider } from '@/context/settings';
import { LanguageProvider, useLanguage } from '@/i18n/LanguageProvider';

function AppNavigation() {
  const { colors } = useAppTheme();
  const { t } = useLanguage();

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
        <Stack.Screen name="snake/[id]" options={{ title: t("snakeDetails") }} />
        <Stack.Screen name="identify" options={{ title: t("identifySnake") }} />
        <Stack.Screen name="compare" options={{ title: t("compareSnakes") }} />
        <Stack.Screen name="add-sighting" options={{ title: t("addSighting") }} />
        <Stack.Screen name="about" options={{ title: t("aboutSettings") }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <LanguageProvider>
      <SettingsProvider>
        <FavouritesProvider>
          <AppNavigation />
        </FavouritesProvider>
      </SettingsProvider>
      </LanguageProvider>
    </AppThemeProvider>
  );
}
