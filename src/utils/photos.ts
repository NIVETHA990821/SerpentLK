
import { Image } from 'expo-image';

import { WIKI_TITLES } from '@/data/photos';
import type { Snake } from '@/types/snake';

export type Photo = {
  url: string;
  pageUrl: string;
};

const API =
  'https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2' +
  '&prop=pageimages&piprop=thumbnail&pithumbsize=900&redirects=1&titles=';

export async function fetchPhoto(
  snake: Snake
): Promise<Photo | null> {
  const titles = [
    WIKI_TITLES[snake.id],
    snake.scientificName,
  ].filter(
    (title): title is string =>
      !!title && !title.endsWith('sp.')
  );

  for (const title of titles) {
    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(),
      15000
    );

    try {
      const url = API + encodeURIComponent(title);

      console.log('Fetching photo:', snake.name, title);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(
          'Wikipedia request failed:',
          snake.name,
          response.status
        );
        continue;
      }

      const json = (await response.json()) as {
        query?: {
          pages?: {
            title: string;
            missing?: boolean;
            thumbnail?: {
              source: string;
            };
          }[];
        };
      };

      const page = json.query?.pages?.[0];

      if (
        page &&
        !page.missing &&
        page.thumbnail?.source
      ) {
        return {
          url: page.thumbnail.source,
          pageUrl:
            'https://en.wikipedia.org/wiki/' +
            encodeURIComponent(
              page.title.replace(/ /g, '_')
            ),
        };
      }

      console.warn('No photo found:', snake.name);
    } catch (error) {
      console.warn(
        'Photo lookup error:',
        snake.name,
        error
      );
    } finally {
      clearTimeout(timer);
    }
  }

  return null;
}

export async function cachePhoto(
  url: string
): Promise<boolean> {
  try {
    const success = await Image.prefetch(url, 'disk');

    if (!success) {
      console.warn('Photo cache failed:', url);
    }

    return success;
  } catch (error) {
    console.warn('Photo cache error:', url, error);
    return false;
  }
}
