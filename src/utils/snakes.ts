import snakesJson from '@/data/snakes.json';
import districtsJson from '@/data/districts.json';
import { palette } from '@/constants/palette';
import type { District, Snake, VenomLevel } from '@/types/snake';

export const snakes = snakesJson as unknown as Snake[];
export const districts = districtsJson as District[];

export const getSnake = (id?: string) => snakes.find((s) => s.id === id);

export type VenomMeta = {
  label: string;
  short: string;
  icon: 'skull' | 'alert-circle' | 'shield-checkmark';
  color: string;
  background: string;
  rank: number;
};

// Every badge shows an icon AND a text label, so colour is never the only signal.
export const VENOM_META: Record<VenomLevel, VenomMeta> = {
  highly_venomous: {
    label: 'Highly venomous',
    short: 'Highly',
    icon: 'skull',
    color: palette.highly,
    background: palette.highlyBg,
    rank: 0,
  },
  mildly_venomous: {
    label: 'Mildly venomous',
    short: 'Mildly',
    icon: 'alert-circle',
    color: palette.mildly,
    background: palette.mildlyBg,
    rank: 1,
  },
  non_venomous: {
    label: 'Non-venomous',
    short: 'Non-venomous',
    icon: 'shield-checkmark',
    color: palette.non,
    background: palette.nonBg,
    rank: 2,
  },
};

export const ACTIVE_LABEL = {
  nocturnal: 'Night (nocturnal)',
  diurnal: 'Day (diurnal)',
  both: 'Day and night',
} as const;

export const ALL_HABITATS = Array.from(
  new Set(snakes.flatMap((s) => s.habitats))
).sort();

// Case-insensitive search across English, Sinhala, Tamil and scientific names.
export function searchSnakes(list: Snake[], query: string): Snake[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;

  return list.filter((s) =>
    [
      s.name,
      s.sinhalaName,
      s.sinhalaRoman,
      s.tamilName,
      s.tamilRoman,
      ...(s.tamilOtherNames ?? []),
      s.scientificName,
    ].some((n) => n.toLowerCase().includes(q))
  );
}

export type Filters = {
  venom: VenomLevel | 'all';
  habitat: string | 'all';
  endemicOnly: boolean;
  favouritesOnly: boolean;
};

export const DEFAULT_FILTERS: Filters = {
  venom: 'all',
  habitat: 'all',
  endemicOnly: false,
  favouritesOnly: false,
};

// AND across filter types; one habitat is chosen at a time.
export function applyFilters(
  list: Snake[],
  f: Filters,
  favourites: string[]
): Snake[] {
  return list.filter(
    (s) =>
      (f.venom === 'all' || s.venomLevel === f.venom) &&
      (f.habitat === 'all' || s.habitats.includes(f.habitat)) &&
      (!f.endemicOnly || s.endemic) &&
      (!f.favouritesOnly || favourites.includes(s.id))
  );
}

export type SortMode = 'az' | 'danger';

export function sortSnakes(list: Snake[], mode: SortMode): Snake[] {
  const copy = [...list];
  if (mode === 'danger') {
    return copy.sort(
      (a, b) =>
        VENOM_META[a.venomLevel].rank - VENOM_META[b.venomLevel].rank ||
        a.name.localeCompare(b.name)
    );
  }
  return copy.sort((a, b) => a.name.localeCompare(b.name));
}

// "Snake of the day": the same species all day, a new one each day.
export function snakeOfTheDay(): Snake {
  const now = new Date();
  const dayNumber = Math.floor(
    new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() /
      86400000
  );
  return snakes[dayNumber % snakes.length];
}

export function localNames(s: Snake): string {
  const si = s.sinhalaName ? `${s.sinhalaName} (${s.sinhalaRoman})` : '';
  const ta = s.tamilName ? `${s.tamilName} (${s.tamilRoman})` : '';
  return [si, ta].filter(Boolean).join('  •  ');
}
