import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper variables to get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the episodes.json file
const episodesPath = path.join(__dirname, 'data', 'episodes.json');

// Ensure the file exists
try {
  await fs.access(episodesPath);
} catch {
  console.error('Error: Cannot find data/episodes.json');
  process.exit(1);
}

// Read and parse the episodes.json file
const episodesData = await fs.readFile(episodesPath, 'utf8');
const episodes = JSON.parse(episodesData);

// Create a map to store guest appearances
const guestMap = {};

// Iterate through episodes to count guest appearances
episodes.forEach(episode => {
  if (episode.guests) { // Check if the episode has guests
    episode.guests.forEach(guest => {
      if (guestMap[guest]) {
        guestMap[guest]++;
      } else {
        guestMap[guest] = 1;
      }
    });
  }
});

// Convert the guest map to an array of guest objects
const guests = Object.keys(guestMap).map(guest => ({
  name: guest,
  episodes: guestMap[guest]
}));

// Sort guests alphabetically by name
guests.sort((a, b) => a.name.localeCompare(b.name));

// Write the sorted guest list to data/guests.json
const guestsPath = path.join(__dirname, 'data', 'guests.json');
await fs.writeFile(guestsPath, JSON.stringify(guests, null, 2));

console.log('guests.json has been generated and sorted!');
