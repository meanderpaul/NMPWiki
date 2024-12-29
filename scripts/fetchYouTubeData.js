async function fetchYouTubeData() {
    const apiKey = 'AIzaSyCblwXPE3a7niqWNtanwdTjHWPQqcDp8r8';
    const searchUrl = 'https://www.googleapis.com/youtube/v3/search';
    const searchParams = new URLSearchParams({
        q: 'Nordic Mythology Podcast',
        part: 'snippet',
        type: 'video',
        maxResults: 50,
        key: apiKey
    });

    try {
        const response = await fetch(`${searchUrl}?${searchParams}`);
        const data = await response.json();

        const episodesContainer = document.getElementById('episodes-container');

        for (const video of data.items) {
            const videoId = video.id.videoId;
            const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;
            const videoResponse = await fetch(videoDetailsUrl);
            const videoData = await videoResponse.json();
            const videoItem = videoData.items[0];

            const episodeElement = document.createElement('div');
            episodeElement.classList.add('episode');

            episodeElement.innerHTML = `
                <h3>${videoItem.snippet.title}</h3>
                <p><strong>Episode Number:</strong> ${video.snippet.title.match(/\d+/) || 'N/A'}</p>
                <p><strong>Guest Name:</strong> ${extractGuestName(videoItem.snippet.description)}</p>
                <p><strong>Description:</strong> ${videoItem.snippet.description}</p>
                <p><strong>Published At:</strong> ${new Date(videoItem.snippet.publishedAt).toLocaleDateString()}</p>
                <p><strong>View Count:</strong> ${videoItem.statistics.viewCount}</p>
                <p><strong>Like Count:</strong> ${videoItem.statistics.likeCount}</p>
            `;
            episodesContainer.appendChild(episodeElement);
        }
    } catch (error) {
        console.error('Error fetching YouTube data:', error);
    }
}

function extractGuestName(description) {
    const guestMatch = description.match(/guest[:]? (.+)/i);
    return guestMatch ? guestMatch[1] : 'N/A';
}

window.onload = fetchYouTubeData;
