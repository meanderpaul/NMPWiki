import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, '..');
const episodesPath = path.join(root, 'public/data', 'episodes.json');
const literaturePath = path.join(root, 'public/data', 'literature.json');

const URL_RE = /https?:\/\/[^\s<>"')\]]+/gi;
const BOOK_LINE_RE =
  /(?:^|\n)\s*(?:book|books|reading|read|title|manuscript|paper|article)\s*[:\-–—]\s*(.+)/gi;
const AUTHOR_LINE_RE =
  /(?:^|\n)\s*(?:author|authors|writer|writers|by)\s*[:\-–—]\s*(.+)/gi;
const KEY_POINT_RE =
  /(?:^|\n)\s*(?:[-*•]|\d+[.)])\s+(.{12,160})/g;

function cleanDescription(description = '') {
  const separatorIndex = description.search(/-{4,}/);
  if (separatorIndex !== -1) {
    return description.substring(0, separatorIndex).trim();
  }
  return description.trim();
}

function uniqueStrings(values) {
  const seen = new Set();
  const result = [];
  for (const value of values) {
    const cleaned = String(value || '')
      .replace(/\s+/g, ' ')
      .replace(/[.,;:]+$/, '')
      .trim();
    if (!cleaned || cleaned.length < 3) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(cleaned);
  }
  return result;
}

function extractMatches(text, regex) {
  const matches = [];
  for (const match of text.matchAll(regex)) {
    if (match[1]) matches.push(match[1]);
  }
  return matches;
}

function summarize(text) {
  if (!text) return 'No summary available';
  const firstParagraph = text.split(/\n\s*\n/)[0] || text;
  const sentence = firstParagraph.split(/(?<=[.!?])\s+/)[0] || firstParagraph;
  return sentence.length > 280 ? `${sentence.slice(0, 277).trim()}…` : sentence.trim();
}

function extractFromEpisode(episode) {
  const snippet = episode?.snippet || {};
  const title = snippet.title || 'Unknown Title';
  const videoId =
    episode?.contentDetails?.videoId ||
    snippet?.resourceId?.videoId ||
    episode?.id ||
    '';
  const publishedAt = snippet.publishedAt || null;
  const rawDescription = snippet.description || '';
  const description = cleanDescription(rawDescription);

  const books = uniqueStrings(extractMatches(rawDescription, BOOK_LINE_RE));
  const authors = uniqueStrings(extractMatches(rawDescription, AUTHOR_LINE_RE));
  const additionalResources = uniqueStrings(rawDescription.match(URL_RE) || []);
  const keyPoints = uniqueStrings(extractMatches(description, KEY_POINT_RE)).slice(0, 8);

  const hasContent =
    books.length > 0 ||
    authors.length > 0 ||
    additionalResources.length > 0 ||
    keyPoints.length > 0;

  if (!hasContent && description.length < 40) {
    return null;
  }

  return {
    videoId,
    videoTitle: title,
    publishedAt,
    summary: summarize(description),
    keyPoints,
    books,
    authors,
    additionalResources,
  };
}

async function main() {
  let episodes;
  try {
    episodes = JSON.parse(await fs.readFile(episodesPath, 'utf8'));
  } catch (error) {
    console.error('Cannot read public/data/episodes.json:', error.message);
    process.exit(1);
  }

  if (!Array.isArray(episodes)) {
    console.error('public/data/episodes.json must be an array');
    process.exit(1);
  }

  const literature = episodes
    .map(extractFromEpisode)
    .filter(Boolean)
    .sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')));

  await fs.mkdir(path.dirname(literaturePath), { recursive: true });
  await fs.writeFile(literaturePath, JSON.stringify(literature, null, 2));
  console.log(`Wrote ${literature.length} literature entries to public/data/literature.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
