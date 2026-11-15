import type { Snake } from '@/types/snake';
import { snakes } from '@/utils/snakes';

// Answers a person can give without getting close to the snake.
export type Place = 'water' | 'tree' | 'home' | 'field' | 'forest';
export type Colour = 'green' | 'brown' | 'dark' | 'grey';
export type Pattern = 'bands' | 'spots' | 'stripes' | 'plain';
export type Time = 'day' | 'night';
export type Size = 'small' | 'medium' | 'large';

export type Answers = {
  place?: Place;
  colour?: Colour;
  pattern?: Pattern;
  time?: Time;
  size?: Size;
};

const TREE_DWELLERS = new Set([
  'green-vine-snake',
  'cat-snake',
  'flying-snake',
  'green-pit-viper',
  'bronzeback-tree-snake',
  'brown-vine-snake',
  'ornate-flying-snake',
  'forstens-cat-snake',
]);

// Main visible pattern for each species, judged from the descriptions.
const PATTERNS: Record<string, Pattern[]> = {
  'russells-viper': ['spots'],
  'indian-cobra': ['plain', 'bands'],
  'common-krait': ['bands'],
  'ceylon-krait': ['bands'],
  'saw-scaled-viper': ['spots'],
  'hump-nosed-viper': ['spots'],
  'green-pit-viper': ['bands', 'spots'],
  'green-vine-snake': ['plain'],
  'cat-snake': ['bands'],
  'flying-snake': ['bands', 'spots'],
  'dog-faced-water-snake': ['spots', 'bands'],
  'green-keelback': ['plain'],
  'indian-python': ['spots'],
  'rat-snake': ['plain'],
  'wolf-snake': ['bands'],
  'common-sand-boa': ['spots'],
  'checkered-keelback': ['spots'],
  'trinket-snake': ['stripes'],
  'bronzeback-tree-snake': ['stripes'],
  shieldtail: ['plain'],
  'blind-snake': ['plain'],
  'kukri-snake': ['bands'],
  'lowland-hump-nosed-viper': ['spots'],
  'highland-hump-nosed-viper': ['spots'],
  'hook-nosed-sea-snake': ['bands'],
  'slender-coral-snake': ['plain', 'bands'],
  'brown-vine-snake': ['spots', 'plain'],
  'ornate-flying-snake': ['bands', 'spots'],
  'forstens-cat-snake': ['bands', 'spots'],
  'ceylon-pipe-snake': ['spots'],
  'wart-snake': ['bands', 'plain'],
  'barred-wolf-snake': ['bands'],
  'buff-striped-keelback': ['stripes'],
  'olive-keelback': ['plain'],
};

const COLOUR_GROUPS: Record<Colour, string[]> = {
  green: ['green', 'olive'],
  brown: ['brown', 'tan', 'sandy', 'bronze', 'cream', 'olive', 'yellow'],
  dark: ['black'],
  grey: ['grey'],
};

function matchesPlace(s: Snake, place: Place) {
  switch (place) {
    case 'water':
      return s.habitats.includes('wetlands') || s.habitats.includes('sea and estuaries');
    case 'tree':
      return TREE_DWELLERS.has(s.id);
    case 'home':
      return s.habitats.includes('gardens and villages');
    case 'field':
      return s.habitats.some((h) => ['paddy fields', 'grassland', 'scrub', 'sandy areas'].includes(h));
    case 'forest':
      return s.habitats.some((h) => ['forest', 'rainforest'].includes(h));
  }
}

function matchesSize(s: Snake, size: Size) {
  if (size === 'small') return s.avgLengthCm <= 60;
  if (size === 'large') return s.maxLengthCm >= 150;
  return s.avgLengthCm > 40 && s.avgLengthCm <= 150;
}

// Weighted so the most reliable clues (colour, pattern) count most.
const WEIGHTS = { place: 1, colour: 3, pattern: 3, time: 1, size: 2 };

export type Match = { snake: Snake; score: number };

export function rankSnakes(a: Answers): Match[] {
  const possible =
    (a.place ? WEIGHTS.place : 0) +
    (a.colour ? WEIGHTS.colour : 0) +
    (a.pattern ? WEIGHTS.pattern : 0) +
    (a.time ? WEIGHTS.time : 0) +
    (a.size ? WEIGHTS.size : 0);

  return snakes
    .map((s) => {
      let got = 0;
      if (a.place && matchesPlace(s, a.place)) got += WEIGHTS.place;
      if (a.colour && s.colours.some((c) => COLOUR_GROUPS[a.colour!].includes(c))) got += WEIGHTS.colour;
      if (a.pattern && PATTERNS[s.id]?.includes(a.pattern)) got += WEIGHTS.pattern;
      if (a.time && (s.activeTime === 'both' || (a.time === 'day') === (s.activeTime === 'diurnal')))
        got += WEIGHTS.time;
      if (a.size && matchesSize(s, a.size)) got += WEIGHTS.size;
      return { snake: s, score: possible ? got / possible : 0 };
    })
    .sort((x, y) => y.score - x.score || x.snake.name.localeCompare(y.snake.name));
}
