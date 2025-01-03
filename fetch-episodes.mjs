// fetch-episodes.mjs
import fetch from 'node-fetch';
import fs from 'fs/promises';
import { config } from 'dotenv';

config(); // Ensure you have dotenv package to manage environment variables

async function fetchEpisodes() {
    const apiKey = process.env.YOUTUBE_API_KEY; // Your API key from environment variables
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
            console.log(`Fetching from YouTube API with params: ${playlistItemsParams.toString()}`);
            const response = await fetch(`${playlistItemsUrl}?${playlistItemsParams}`);
            const data = await response.json();

            // Log response status and data
            console.log(`Response Status: ${response.status}`);
            console.log('Received data:', JSON.stringify(data, null, 2));

            if (response.status !== 200) {
                console.error('Error response from YouTube API:', data);
                break;
            }

            // Filter out items that do not have a snippet
            const validItems = data.items ? data.items.filter(item => item.snippet) : [];
            allVideos = allVideos.concat(validItems);

            nextPageToken = data.nextPageToken;
        } catch (error) {
            console.error('Error fetching YouTube data:', error);
            break;
        }
    } while (nextPageToken);

    if (allVideos.length === 0) {
        console.error('No valid episodes found.');
    } else {
        // Write data to episodes.json
        try {
            await fs.writeFile('data/episodes.json', JSON.stringify(allVideos, null, 2));
            console.log('Episodes data saved to data/episodes.json');
        } catch (writeError) {
            console.error('Error writing episodes.json:', writeError);
        }
    }
}

fetchEpisodes().catch(error => {
    console.error('Error fetching episodes:', error);
});
