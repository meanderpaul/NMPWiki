import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const episodesPath = path.join(__dirname, 'public/data', 'episodes.json');

function normalizeKey(name) {
  return name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanGuestName(name) {
  return name
    .replace(/\b(?:Guest|Guildmaster|Part|Pt\.?)\b/gi, '')
    .replace(/[|–—:].*$/, '')
    .replace(/["'`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractGuestsFromTitle(title) {
  const match = title.match(/\bwith\s+(.+?)(?:\s+NMP|\s+#?\d|$)/i);
  if (!match?.[1]) return [];

  return match[1]
    .split(/\s+(?:and|&|with)\s+/i)
    .map(cleanGuestName)
    .filter((name) => name.length > 1 && !/^\d+$/.test(name));
}

function extractGuestsFromDescription(description = '') {
  const match = description.match(/guest[s]?[:\s]+(.+?)(?:\.|,|;|\n|$)/i);
  if (!match?.[1]) return [];

  return match[1]
    .split(/\s+(?:and|&|with)\s+/i)
    .map(cleanGuestName)
    .filter((name) => name.length > 1 && !/^\d+$/.test(name));
}

try {
  await fs.access(episodesPath);
} catch {
  console.error('Error: Cannot find public/data/episodes.json');
  process.exit(1);
}

try {
  const episodes = JSON.parse(await fs.readFile(episodesPath, 'utf8'));
  const guestMap = new Map();

  for (const episode of episodes) {
    const title = episode?.snippet?.title || '';
    const description = episode?.snippet?.description || '';

    const fromDescription = extractGuestsFromDescription(description);
    const guests = fromDescription.length > 0 ? fromDescription : extractGuestsFromTitle(title);

    for (const guest of guests) {
      const key = normalizeKey(guest);
      if (!key) continue;

      const existing = guestMap.get(key);
      if (existing) {
        existing.episodes += 1;
        // Prefer the longer / more complete display name
        if (guest.length > existing.name.length) {
          existing.name = guest;
        }
      } else {
        guestMap.set(key, { name: guest, episodes: 1 });
      }
    }
  }

  const guests = [...guestMap.values()].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  );

  if (guests.length === 0) {
    console.error('Error: No guests found to write to guests.json');
    process.exit(1);
  }

  const guestsPath = path.join(__dirname, 'public/data', 'guests.json');
  await fs.writeFile(guestsPath, JSON.stringify(guests, null, 2));
  console.log(`guests.json generated with ${guests.length} guests`);
} catch (error) {
  console.error('Error processing episodes or generating guests:', error);
  process.exit(1);
}
