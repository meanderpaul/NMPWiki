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
  console.log('Successfully found data/episodes.json');
} catch {
  console.error('Error: Cannot find data/episodes.json');
  process.exit(1);
}

// Read and parse the episodes.json file
try {
  const episodesData = await fs.readFile(episodesPath, 'utf8');
  console.log('Successfully read data/episodes.json');
  const episodes = JSON.parse(episodesData);
  console.log('Successfully parsed episodes.json');
  
  // Create a map to store guest appearances
  const guestMap = {};
  
  // Helper function to clean and normalize guest names
  const cleanGuestName = (name) => name
    .replace(/(?:Guest|Guildmaster|Part)/gi, '') // Remove unwanted terms
    .trim()
    .replace(/[^a-zA-Z\s]/g, '');

  // Iterate through episodes to count guest appearances
  episodes.forEach(episode => {
    const title = episode.snippet.title;
    console.log(`Processing episode title: ${title}`);

    // Extract guest names and split by "and", "&", or "with"
    const guestNames = title.match(/with (.+?)(?:\s*NMP|\s*\d|$)/i);
    if (guestNames && guestNames[1]) {
      const guests = guestNames[1]
        .split(/and|&|with/i)
        .map(name => cleanGuestName(name))
        .filter(name => name.length > 0); // Remove any empty names
      
      console.log(`Extracted guests from title: ${guests.join(', ')}`);
      
      guests.forEach(guest => {
        if (guestMap[guest]) {
          guestMap[guest]++;
        } else {
          guestMap[guest] = 1;
        }
      });
    }
  });
  
  console.log('Guest map:', guestMap);
  
  // Convert the guest map to an array of guest objects
  const guests = Object.keys(guestMap).map(guest => ({
    name: guest,
    episodes: guestMap[guest]
  }));
  
  console.log('Guests array:', guests);
  
  // Only write to guests.json if guests array is not empty
  if (guests.length > 0) {
    // Sort guests alphabetically by name
    guests.sort((a, b) => a.name.localeCompare(b.name));
    
    // Write the sorted guest list to data/guests.json
    const guestsPath = path.join(__dirname, 'data', 'guests.json');
    await fs.writeFile(guestsPath, JSON.stringify(guests, null, 2));
    
    console.log('guests.json has been generated and sorted!');
  } else {
    console.error('Error: No guests found to write to guests.json');
  }
} catch (error) {
  console.error('Error processing episodes or generating guests:', error);
}
