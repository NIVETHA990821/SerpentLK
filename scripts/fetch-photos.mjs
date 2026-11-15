#!/usr/bin/env node
// Downloads a real, free-licence photo for every species from Wikipedia /
// Wikimedia Commons and bundles it into the app so it works fully offline.
//
//   node scripts/fetch-photos.mjs          download missing photos
//   node scripts/fetch-photos.mjs --force  re-download every photo
//
// To swap a photo you don't like, put a Commons file name in
// scripts/photo-overrides.json, e.g. { "wart-snake": "File:Acrochordus granulatus.jpg" }
// and run with --force.
//
// Needs Node 18+ (built-in fetch) and an internet connection.

import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const PHOTO_DIR = path.join(ROOT, 'assets/snakes/photos');
const FORCE = process.argv.includes('--force');
const UA = 'SerpentLK/1.1 (educational student project; photo bundling script)';
const WIDTH = 900;

const read = async (p) => fs.readFile(path.join(ROOT, p), 'utf8');
const snakes = JSON.parse(await read('src/data/snakes.json'));
const titles = Object.fromEntries(
  [...(await read('src/data/photos.ts')).matchAll(/'?([\w-]+)'?:\s*'([^']+)'/g)].map((m) => [m[1], m[2]])
);
let overrides = {};
try {
  overrides = JSON.parse(await read('scripts/photo-overrides.json'));
} catch {}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(host, params) {
  const url = `https://${host}/w/api.php?` + new URLSearchParams({ format: 'json', formatversion: '2', ...params });
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.ok) return res.json();
    await sleep(1500 * attempt);
  }
  throw new Error(`Request failed: ${url}`);
}

// Lead image of the English Wikipedia article (free licences only).
async function leadImage(title) {
  const j = await api('en.wikipedia.org', {
    action: 'query', prop: 'pageimages', piprop: 'name', pilicense: 'free', redirects: '1', titles: title,
  });
  const page = j.query?.pages?.[0];
  return page && !page.missing && page.pageimage ? `File:${page.pageimage}` : null;
}

// Fallback: first photo on Wikimedia Commons for the scientific name.
async function commonsSearch(query) {
  const j = await api('commons.wikimedia.org', {
    action: 'query', list: 'search', srsearch: `"${query}" filetype:bitmap`, srnamespace: '6', srlimit: '5',
  });
  return j.query?.search?.find((r) => /\.(jpe?g|png)$/i.test(r.title))?.title ?? null;
}

const strip = (html = '') => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

async function fileInfo(file) {
  const j = await api('commons.wikimedia.org', {
    action: 'query', prop: 'imageinfo', iiprop: 'url|mime|extmetadata', iiurlwidth: String(WIDTH), titles: file,
  });
  const info = j.query?.pages?.[0]?.imageinfo?.[0];
  if (!info) return null;
  const meta = info.extmetadata ?? {};
  return {
    url: info.thumburl ?? info.url,
    mime: info.thumbmime ?? info.mime,
    source: info.descriptionurl,
    author: strip(meta.Artist?.value) || 'Unknown author',
    license: strip(meta.LicenseShortName?.value) || 'See source',
    licenseUrl: meta.LicenseUrl?.value ?? '',
  };
}

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png' };
const existing = async (id) => {
  for (const ext of Object.values(EXT)) {
    try {
      await fs.access(path.join(PHOTO_DIR, `${id}.${ext}`));
      return ext;
    } catch {}
  }
  return null;
};

await fs.mkdir(PHOTO_DIR, { recursive: true });
let credits = {};
try {
  credits = JSON.parse(await read('src/data/photoCredits.json'));
} catch {}

const missing = [];
for (const snake of snakes) {
  const label = `${snake.name}`.padEnd(30);
  if (!FORCE && (await existing(snake.id)) && credits[snake.id]) {
    console.log(`✓ ${label} already downloaded`);
    continue;
  }
  try {
    const candidates = [overrides[snake.id], titles[snake.id] && (await leadImage(titles[snake.id]))];
    if (!candidates.some(Boolean)) candidates.push(await leadImage(snake.scientificName));
    if (!candidates.some(Boolean)) candidates.push(await commonsSearch(snake.scientificName));
    const file = candidates.find(Boolean);
    const info = file && (await fileInfo(file));
    const ext = info && EXT[info.mime];
    if (!info || !ext) throw new Error('no usable photo found');

    const res = await fetch(info.url, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`download failed (${res.status})`);
    for (const e of Object.values(EXT)) await fs.rm(path.join(PHOTO_DIR, `${snake.id}.${e}`), { force: true });
    await fs.writeFile(path.join(PHOTO_DIR, `${snake.id}.${ext}`), Buffer.from(await res.arrayBuffer()));

    const { url, mime, ...credit } = info;
    credits[snake.id] = { ...credit, file, ext };
    console.log(`✓ ${label} ${file}`);
  } catch (err) {
    missing.push(snake.name);
    console.log(`✗ ${label} ${err.message} (illustration kept)`);
  }
  await sleep(300); // be polite to Wikimedia's servers
}

// Regenerate the image map: bundled photo when we have one, else the illustration.
const lines = [];
for (const s of snakes) {
  const ext = credits[s.id] && (await existing(s.id));
  const rel = ext ? `photos/${s.id}.${ext}` : `${s.image}.jpg`;
  lines.push(`  '${s.id}': require('../../assets/snakes/${rel}'),`);
}
await fs.writeFile(
  path.join(ROOT, 'src/data/images.ts'),
  `// GENERATED by scripts/fetch-photos.mjs. Re-run the script instead of editing by hand.
// Real photos live in assets/snakes/photos; species without one use the illustration.
// require() of a bundled image returns a numeric asset id.
export const SNAKE_IMAGES: Record<string, number> = {
${lines.join('\n')}
};
`
);
await fs.writeFile(path.join(ROOT, 'src/data/photoCredits.json'), JSON.stringify(credits, null, 2) + '\n');

const md = ['# Photo credits', '', 'Species photos come from Wikimedia Commons under free licences.', ''];
for (const s of snakes) {
  const c = credits[s.id];
  if (c) md.push(`- **${s.name}** (*${s.scientificName}*): ${c.author}, ${c.license}. [Source](${c.source})`);
}
await fs.writeFile(path.join(ROOT, 'PHOTO_CREDITS.md'), md.join('\n') + '\n');

console.log(`\n${snakes.length - missing.length} of ${snakes.length} species now have a bundled photo.`);
if (missing.length) console.log(`Still illustrations: ${missing.join(', ')}`);
