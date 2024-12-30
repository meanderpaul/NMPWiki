async function fetchYouTubeData() {
    const apiKey = 'AIzaSyCblwXPE3a7niqWNtanwdTjHWPQqcDp8r8'; // Your API key
    const playlistId = 'PLhyCI_UmTvojuAANuiG6sG1XgRTZNZ4Pj'; // Playlist ID for the specific playlist
    const playlistItemsUrl = 'https://www.googleapis.com/youtube/v3/playlistItems';
    const playlistItemsParams = new URLSearchParams({
        part: 'snippet,contentDetails',
        playlistId: playlistId,
        maxResults: 50,
        key: apiKey
    });

    console.log("Fetching data from YouTube API..."); // Log for debugging

    try {
        const response = await fetch(`${playlistItemsUrl}?${playlistItemsParams}`);
        console.log("API response received."); // Log for debugging
        const data = await response.json();
        console.log("Data parsed successfully:", data); // Log for debugging

        const episodesContainer = document.getElementById('episodes-container');
        if (!episodesContainer) {
            console.error("episodes-container element not found."); // Log for debugging
            return;
        }

        // Fetch detailed video data, including duration
        const videoDetails = await Promise.all(data.items.map(async item => {
            const videoId = item.contentDetails.videoId;
            const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`;
            const videoResponse = await fetch(videoDetailsUrl);
            const videoData = await videoResponse.json();
            return videoData.items[0];
        }));

        // Sort videos by published date (newest at the top)
        videoDetails.sort((a, b) => new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt));

        // Group videos by year
        const episodesByYear = videoDetails.reduce((acc, video) => {
            const year = new Date(video.snippet.publishedAt).getFullYear();
            acc[year] = acc[year] || [];
            acc[year].push(video);
            return acc;
        }, {});

        // Display sorted videos by year
        for (const [year, videos] of Object.entries(episodesByYear)) {
            const yearContainer = document.createElement('div');
            yearContainer.classList.add('year-container');

            const yearHeader = document.createElement('h2');
            yearHeader.textContent = year;
            yearHeader.classList.add('year-header');
            yearHeader.onclick = () => {
                const yearContent = yearContainer.querySelector('.year-content');
                yearContent.style.display = yearContent.style.display === 'none' ? 'block' : 'none';
            };
            yearContainer.appendChild(yearHeader);

            const yearContent = document.createElement('div');
            yearContent.classList.add('year-content');

            for (const videoItem of videos) {
                const episodeElement = document.createElement('div');
                episodeElement.classList.add('episode');

                episodeElement.innerHTML = `
                    <h3>${videoItem.snippet.title}</h3>
                    <p><strong>Episode Number:</strong> ${videoItem.snippet.title.match(/\d+/) || 'N/A'}</p>
                    <p><strong>Guest Name:</strong> ${extractGuestName(videoItem.snippet.description)}</p>
                    <p><strong>Description:</strong> ${videoItem.snippet.description}</p>
                    <p><strong>Published At:</strong> ${new Date(videoItem.snippet.publishedAt).toLocaleDateString()}</p>
                `;
                yearContent.appendChild(episodeElement);
            }

            yearContent.style.display = 'none'; // Initially collapse year sections
            yearContainer.appendChild(yearContent);
            episodesContainer.appendChild(yearContainer);
        }

        console.log("Episodes added to the DOM."); // Log for debugging
    } catch (error) {
        console.error('Error fetching YouTube data:', error);
    }
}

function extractGuestName(description) {
    const guestMatch = description.match(/guest[:]? (.+)/i);
    return guestMatch ? guestMatch[1] : 'N/A';
}

window.onload = fetchYouTubeData;
