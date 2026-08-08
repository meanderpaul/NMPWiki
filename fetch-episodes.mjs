import fs from 'fs/promises';
import { config } from 'dotenv';

config();

async function fetchEpisodes() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error('Missing YOUTUBE_API_KEY. Set it in .env or the environment.');
    process.exit(1);
  }

  const playlistId = 'PLhyCI_UmTvojuAANuiG6sG1XgRTZNZ4Pj';
  const playlistItemsUrl = 'https://www.googleapis.com/youtube/v3/playlistItems';
  let nextPageToken = '';
  let allVideos = [];

  do {
    const playlistItemsParams = new URLSearchParams({
      part: 'snippet,contentDetails',
      playlistId,
      maxResults: '50',
      key: apiKey,
      ...(nextPageToken ? { pageToken: nextPageToken } : {}),
    });

    const response = await fetch(`${playlistItemsUrl}?${playlistItemsParams}`);
    const data = await response.json();

    if (!response.ok) {
      const message = data?.error?.message || JSON.stringify(data);
      console.error(`YouTube API error (${response.status}): ${message}`);
      process.exit(1);
    }

    const validItems = data.items ? data.items.filter((item) => item.snippet) : [];
    allVideos = allVideos.concat(validItems);
    console.log(`Fetched ${validItems.length} items (total ${allVideos.length})`);
    nextPageToken = data.nextPageToken || '';
  } while (nextPageToken);

  if (allVideos.length === 0) {
    console.error('No valid episodes found.');
    process.exit(1);
  }

  await fs.mkdir('public/data', { recursive: true });
  await fs.writeFile('public/data/episodes.json', JSON.stringify(allVideos, null, 2));
  console.log(`Episodes data saved to public/data/episodes.json (${allVideos.length} items)`);
}

fetchEpisodes().catch((error) => {
  console.error('Error fetching episodes:', error);
  process.exit(1);
});
