const fetch = require('node-fetch');
const fs = require('fs');

async function fetchEpisodes() {
    const apiKey = process.env.YOUTUBE_API_KEY; // Your API key from GitHub Secrets
    const playlistId = 'PLhyCI_UmTvojuAANuiG6sG1XgRTZNZ4Pj'; // Playlist ID
    const playlistItemsUrl = 'https://www.googleapis.com/youtube/v3/playlistItems';
    let nextPageToken = '';
    let allVideos = [];

    do {
        const playlistItemsParams = new URLSearchParams({
            part: 'snippet,contentDetails',
            playlistId: playlistId,
            maxResults: 50,
            key: apiKey,
            pageToken: nextPageToken
        });

        try {
            const response = await fetch(`${playlistItemsUrl}?${playlistItemsParams}`);
            const data = await response.json();
            
            // Log the received data for debugging
            console.log('Received data:', JSON.stringify(data, null, 2));

            // Filter out items that do not have a snippet
            const validItems = data.items.filter(item => item.snippet);
            allVideos = allVideos.concat(validItems);
            
            nextPageToken = data.nextPageToken;
        } catch (error) {
            console.error('Error fetching YouTube data:', error);
            break;
        }
    } while (nextPageToken);

    if (allVideos.length === 0) {
        console.error('No valid episodes found.');
    }

    fs.writeFileSync('data/episodes.json', JSON.stringify(allVideos, null, 2));
    console.log('Episodes data saved to data/episodes.json');
}

fetchEpisodes().catch(error => {
    console.error('Error fetching episodes:', error);
});
