import creditsJson from '@/data/photoCredits.json';

export type PhotoCredit = {
  file: string;
  source: string;
  author: string;
  license: string;
  licenseUrl: string;
};

// Filled in by scripts/fetch-photos.mjs for every species that has a bundled photo.
export const PHOTO_CREDITS = creditsJson as Record<string, PhotoCredit>;
