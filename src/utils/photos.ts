import { Image } from 'expo-image';

import { WIKI_TITLES } from '@/data/photos';
import type { Snake } from '@/types/snake';

export type Photo = { url: string; pageUrl: string };

const API =
  'https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2' +
  '&prop=pageimages&piprop=thumbnail&pithumbsize=900&redirects=1&origin=*&titles=';

// Looks up a free-licence lead photo for the species. Returns null when offline,
// when Wikipedia has no suitable photo, or on any error, so callers can fall
// back to the bundled illustration.
export async function fetchPhoto(snake: Snake): Promise<Photo | null> {
  const titles = [WIKI_TITLES[snake.id], snake.scientificName].filter(
    (t): t is string => !!t && !t.endsWith('sp.')
  );

  for (const title of titles) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(API + encodeURIComponent(title), { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) continue;
      const json = (await res.json()) as {
        query?: { pages?: { title: string; missing?: boolean; thumbnail?: { source: string } }[] };
      };
      const page = json.query?.pages?.[0];
      if (page && !page.missing && page.thumbnail?.source) {
        return {
          url: page.thumbnail.source,
          pageUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
        };
      }
    } catch {
      // Offline or timed out: try the next title, then give up quietly.
    }
  }
  return null;
}

// Downloads the photo into expo-image's disk cache so it shows without internet.
export function cachePhoto(url: string) {
  return Image.prefetch(url, 'disk');
}
