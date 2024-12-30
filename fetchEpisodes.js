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
            allVideos = allVideos.concat(data.items);
            nextPageToken = data.nextPageToken;
        } catch (error) {
            console.error('Error fetching YouTube data:', error);
            break;
        }
    } while (nextPageToken);

    fs.writeFileSync('data/episodes.json', JSON.stringify(allVideos, null, 2));
    console.log('Episodes data saved to data/episodes.json');
}

fetchEpisodes().catch(error => {
    console.error('Error fetching episodes:', error);
});

