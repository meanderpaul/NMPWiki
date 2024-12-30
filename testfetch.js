const fetch = require('node-fetch');
const fs = require('fs');

async function testFetch() {
    const apiKey = 'AIzaSyCblwXPE3a7niqWNtanwdTjHWPQqcDp8r8'; // Your API key
    const playlistId = 'PLhyCI_UmTvojuAANuiG6sG1XgRTZNZ4Pj'; // Playlist ID
    const playlistItemsUrl = 'https://www.googleapis.com/youtube/v3/playlistItems';
    const playlistItemsParams = new URLSearchParams({
        part: 'snippet,contentDetails',
        playlistId: playlistId,
        maxResults: 50,
        key: apiKey
    });

    try {
        console.log(`Fetching from YouTube API with params: ${playlistItemsParams.toString()}`);
        const response = await fetch(`${playlistItemsUrl}?${playlistItemsParams}`);
        const data = await response.json();

        // Log response status and data
        console.log(`Response Status: ${response.status}`);
        console.log('Received data:', JSON.stringify(data, null, 2));

        // Save the data to a file
        fs.writeFileSync('test_episodes.json', JSON.stringify(data, null, 2));
        console.log('Test episodes data saved to test_episodes.json');
    } catch (error) {
        console.error('Error fetching YouTube data:', error);
    }
}

testFetch();
