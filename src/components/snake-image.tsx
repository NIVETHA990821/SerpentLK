import { Image, type ImageStyle } from 'expo-image';
import { useEffect, useState } from 'react';
import type { StyleProp } from 'react-native';

import { useSettings } from '@/context/settings';
import { PHOTO_CREDITS } from '@/data/credits';
import { SNAKE_IMAGES } from '@/data/images';
import type { Snake } from '@/types/snake';

type Props = {
  snake: Snake;
  style?: StyleProp<ImageStyle>;
  // Show the bundled illustration even when photos are on (e.g. tiny thumbnails).
  illustrationOnly?: boolean;
  fit?: 'cover' | 'contain';
  onSourceChange?: (kind: 'photo' | 'illustration') => void;
};

// Shows the species photo when one is available, otherwise the bundled
// illustration. The illustration doubles as the placeholder while the photo
// loads, and as the fallback if it fails, so there is never a blank box.
export function SnakeImage({ snake, style, illustrationOnly, fit = 'cover', onSourceChange }: Props) {
  const { photoFor, requestPhoto } = useSettings();
  const [failed, setFailed] = useState(false);
  // A bundled photo (from scripts/fetch-photos.mjs) works offline, so no download is needed.
  const bundledPhoto = !!PHOTO_CREDITS[snake.id];
  const illustration = SNAKE_IMAGES[snake.id] ?? SNAKE_IMAGES[snake.image];
  const photo = bundledPhoto || illustrationOnly || failed ? undefined : photoFor(snake);

  useEffect(() => {
    if (!illustrationOnly && !bundledPhoto) requestPhoto(snake);
  }, [snake, illustrationOnly, bundledPhoto, requestPhoto]);

  useEffect(() => {
    onSourceChange?.(photo || bundledPhoto ? 'photo' : 'illustration');
  }, [photo, bundledPhoto, onSourceChange]);

  return (
    <Image
      source={photo ? { uri: photo.url } : illustration}
      placeholder={photo ? illustration : undefined}
      placeholderContentFit={fit}
      contentFit={fit}
      cachePolicy="disk"
      transition={250}
      onError={() => setFailed(true)}
      style={style}
      accessibilityLabel={`${photo || bundledPhoto ? 'Photo' : 'Illustration'} of ${snake.name}`}
    />
  );
}
