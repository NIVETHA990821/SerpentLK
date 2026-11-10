
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="snakes"
        options={{ title: 'Explore Snakes' }}
      />

      <Stack.Screen
        name="snake/[id]"
        options={{ title: 'Snake Details' }}
      />

      <Stack.Screen
        name="compare"
        options={{ title: 'Compare Snakes' }}
      />

      <Stack.Screen
        name="first-aid"
        options={{ title: 'Snakebite First Aid' }}
      />

      <Stack.Screen
        name="sightings"
        options={{ title: 'My Sightings' }}
      />

      <Stack.Screen
        name="add-sighting"
        options={{ title: 'Add Sighting' }}
      />

      <Stack.Screen
        name="about"
        options={{ title: 'About SerpentLK' }}
      />
    </Stack>
  );
}
