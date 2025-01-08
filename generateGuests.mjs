import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper variables to get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the episodes.json file
const episodesPath = path.join(__dirname, 'data', 'episodes.json');

// List of common stop words or phrases to filter out
const stopWords = [
  'Guest', 'Guildmaster', 'Part', 'Episode', 'Ep', 
  'Return of the Ham', 'Pt', 'NMP', 'Return of the', 'Part'
];

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
  const cleanGuestName = (name) => {
    stopWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      name = name.replace(regex, '');
    });
    return name.trim().replace(/[-\d]/g, '').replace(/[^a-zA-Z\s]/g, '');
  };

  // Iterate through episodes to count guest appearances
  episodes.forEach(episode => {
    const title = episode.snippet.title;
    console.log(`Processing episode title: ${title}`);

    // Extract guest names and split by "and", "&", or "with"
    const guestNames = title.match(/with (.+?)(?:\s*NMP|\s*$)/i);
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

  // Create JSON data for guests
  const guestsArray = Object.keys(guestMap).map(guest => ({
    name: guest,
    episodes: guestMap[guest]
  }));

  // Write guests.json
  const guestsJsonPath = path.join(__dirname, 'data', 'guests.json');
  await fs.writeFile(guestsJsonPath, JSON.stringify(guestsArray, null, 2));
  console.log('guests.json has been generated!');

  // Create a map of guests grouped by the first letter
  const groupedGuests = {};
  Object.keys(guestMap).forEach(guest => {
    const firstLetter = guest[0].toUpperCase();
    if (!groupedGuests[firstLetter]) {
      groupedGuests[firstLetter] = [];
    }
    groupedGuests[firstLetter].push({ name: guest, episodes: guestMap[guest] });
  });

  console.log('Grouped guests:', groupedGuests);

  // Create HTML table
  let tableHTML = '<table><tbody>';
  const letters = Object.keys(groupedGuests).sort();
  letters.forEach(letter => {
    const guests = groupedGuests[letter];
    tableHTML += `<tr><td colspan="4"><strong>${letter}</strong></td></tr>`;
    for (let i = 0; i < guests.length; i += 4) {
      tableHTML += '<tr>';
      for (let j = 0; j < 4; j++) {
        const guest = guests[i + j];
        if (guest) {
          tableHTML += `<td>${guest.name} - ${guest.episodes} episode(s)</td>`;
        } else {
          tableHTML += '<td></td>';
        }
      }
      tableHTML += '</tr>';
    }
  });
  tableHTML += '</tbody></table>';

  // Write the HTML table to a file in the root directory
  const guestsTablePath = path.join(__dirname, 'guests.html');
  await fs.writeFile(guestsTablePath, tableHTML);

  console.log('guests.html has been generated with the table!');
} catch (error) {
  console.error('Error processing episodes or generating guests:', error);
}
