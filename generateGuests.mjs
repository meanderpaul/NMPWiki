const fs = require('fs');
const episodes = require('./data/episodes.json');

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
fs.writeFileSync('data/guests.json', JSON.stringify(guests, null, 2));

console.log('guests.json has been generated and sorted!');
