import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const episodesPath = path.join(__dirname, 'public/data', 'episodes.json');

const JUNK_PATTERNS = [
  /\b(facebook|instagram|website|please|consider|minute|cancel|appearance|checking|spoiler|introduction|inclusion|significance|secrets|folktales|lucky|impression|speak of|refers to|deadpool)\b/i,
  /\b(to discuss|to talk|to speak|heading over|last minute|wearing|academic papers)\b/i,
];

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

function looksLikePersonName(name) {
  if (!name || name.length < 3 || name.length > 60) return false;
  if (/^\d+$/.test(name)) return false;
  if (JUNK_PATTERNS.some((re) => re.test(name))) return false;
  if (/[!?/]/.test(name)) return false;

  const words = name.split(/\s+/).filter(Boolean);
  if (words.length < 1 || words.length > 5) return false;
  if (words.length === 1 && words[0].toLowerCase() === 'host') return false;

  // Prefer names that start with a capital letter (allow lowercase after cleaning edge cases)
  const capitalized = words.filter((w) => /^[\p{Lu}(]/u.test(w)).length;
  if (capitalized === 0) return false;

  return true;
}

function extractGuestsFromTitle(title) {
  const match = title.match(/\bwith\s+(.+?)(?:\s+NMP|\s+#?\d|$)/i);
  if (!match?.[1]) return [];

  return match[1]
    .split(/\s+(?:and|&|with)\s+/i)
    .map(cleanGuestName)
    .filter(looksLikePersonName);
}

function extractGuestsFromDescription(description = '') {
  // Strict "Guest:" / "Guests:" line style only
  const match = description.match(/(?:^|\n)\s*guests?\s*:\s*(.+?)(?:\.|,|;|\n|$)/i);
  if (!match?.[1]) return [];

  return match[1]
    .split(/\s+(?:and|&|with)\s+/i)
    .map(cleanGuestName)
    .filter(looksLikePersonName);
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

    const fromTitle = extractGuestsFromTitle(title);
    const fromDescription = extractGuestsFromDescription(description);
    // Prefer title guests when present; otherwise fall back to strict description tags
    const guests = fromTitle.length > 0 ? fromTitle : fromDescription;

    for (const guest of guests) {
      const key = normalizeKey(guest);
      if (!key) continue;

      const existing = guestMap.get(key);
      if (existing) {
        existing.episodes += 1;
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
