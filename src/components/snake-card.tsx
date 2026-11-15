import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EndemicBadge } from '@/components/endemic-badge';
import { Icon } from '@/components/icon';
import { SnakeImage } from '@/components/snake-image';
import { VenomBadge } from '@/components/venom-badge';
import { colors, radius, shadow, space, type } from '@/constants/theme';
import { useAppTheme } from '@/context/app-theme';
import type { Snake } from '@/types/snake';
import { VENOM_META } from '@/utils/snakes';

type Props = {
  snake: Snake;
  favourite: boolean;
  onPress: () => void;
  onToggleFavourite: () => void;
};

export function SnakeCard({ snake, favourite, onPress, onToggleFavourite }: Props) {
  const { colors: theme } = useAppTheme();
  const local = snake.sinhalaRoman || snake.tamilRoman;
  // The heart is a sibling of the card button (not nested inside it), because on the
  // web a button cannot contain another button.
  return (
    <View style={[styles.card, shadow, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
      <Pressable
        style={({ pressed }) => [styles.main, pressed && { backgroundColor: theme.soft }]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${snake.name}`}
      >
        <View>
          <SnakeImage snake={snake} style={styles.image} />
          <View style={[styles.stripe, { backgroundColor: VENOM_META[snake.venomLevel].color }]} />
        </View>

        <View style={styles.body}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {snake.name}
          </Text>
          <Text style={[styles.scientific, { color: theme.muted }]} numberOfLines={1}>
            {snake.scientificName}
          </Text>
          {!!local && (
            <Text style={[styles.local, { color: theme.muted }]} numberOfLines={1}>
              {local}
            </Text>
          )}
          <View style={styles.badges}>
            <VenomBadge level={snake.venomLevel} />
            {snake.endemic && <EndemicBadge />}
          </View>
        </View>
      </Pressable>

      <Pressable
        onPress={onToggleFavourite}
        hitSlop={12}
        style={styles.heart}
        accessibilityRole="button"
        accessibilityLabel={favourite ? 'Remove from favourites' : 'Add to favourites'}
      >
        <Icon name={favourite ? 'heart' : 'heart-outline'} size={22} color={favourite ? colors.danger : theme.muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: space.md,
    overflow: 'hidden',
  },
  main: { flexDirection: 'row' },
  pressed: { backgroundColor: colors.moss },
  image: { width: 116, height: '100%', minHeight: 124, backgroundColor: colors.line },
  stripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  body: { flex: 1, paddingVertical: space.md, paddingLeft: space.md, paddingRight: 44, gap: 2, justifyContent: 'center' },
  name: { ...type.heading, color: colors.ink },
  scientific: { ...type.small, fontStyle: 'italic', color: colors.muted },
  local: { ...type.small, color: colors.leaf, fontWeight: '600' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: space.sm },
  heart: { position: 'absolute', top: 4, right: 4, padding: 8 },
});
