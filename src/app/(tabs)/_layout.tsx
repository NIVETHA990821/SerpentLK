import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { useAppTheme } from '@/context/app-theme';

// Ionicons are bundled with the app as a font, so the tab bar works offline.
const icon = (name: IconName, active: IconName) =>
  function TabIcon({ focused, color }: { focused: boolean; color: ColorValue }) {
    return <Icon name={focused ? active : name} size={23} color={color as string} />;
  };

export default function TabLayout() {
  const { colors, mode } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.primaryText,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        tabBarActiveTintColor: mode === 'light' ? colors.primary : colors.text,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', headerShown: false, tabBarIcon: icon('home-outline', 'home') }}
      />
      <Tabs.Screen
        name="snakes"
        options={{ title: 'Species', headerTitle: 'Snakes of Sri Lanka', tabBarIcon: icon('book-outline', 'book') }}
      />
      <Tabs.Screen
        name="sightings"
        options={{ title: 'Sightings', headerTitle: 'My Sightings', tabBarIcon: icon('location-outline', 'location') }}
      />
      <Tabs.Screen
        name="first-aid"
        options={{
          title: 'First Aid',
          headerTitle: 'Snakebite Emergency First Aid',
          tabBarIcon: icon('medkit-outline', 'medkit'),
        }}
      />
    </Tabs>
  );
}
