async function fetchEpisodesFromFile() {
    try {
        const response = await fetch('data/episodes.json');
        const episodes = await response.json();
        const episodesContainer = document.getElementById('episodes-container');
        
        if (episodesContainer) {
            episodesContainer.innerHTML = '';

            const totalEpisodes = episodes.length;
            const totalCounter = document.createElement('h2');
            totalCounter.textContent = `Total Episodes: ${totalEpisodes}`;
            totalCounter.classList.add('total-counter');
            episodesContainer.appendChild(totalCounter);

            const episodesByYear = episodes.reduce((acc, episode) => {
                const year = new Date(episode.snippet.publishedAt).getFullYear();
                acc[year] = acc[year] || [];
                acc[year].push(episode);
                return acc;
            }, {});
            const sortedYears = Object.keys(episodesByYear).sort((a, b) => b - a);

            for (const year of sortedYears) {
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

                for (const episode of episodesByYear[year]) {
                    const episodeElement = document.createElement('div');
                    episodeElement.classList.add('episode');

                    episodeElement.innerHTML = `
                        <h3>${episode.snippet.title}</h3>
                        <p><strong>Episode Number:</strong> ${episode.snippet.title.match(/\d+/) || 'N/A'}</p>
                        <p><strong>Guest Name:</strong> ${extractGuestName(episode.snippet.description)}</p>
                        <p><strong>Description:</strong> ${episode.snippet.description}</p>
                        <p><strong>Published At:</strong> ${new Date(episode.snippet.publishedAt).toLocaleDateString()}</p>
                    `;
                    yearContent.appendChild(episodeElement);
                }

                yearContent.style.display = 'none'; // Initially collapse year sections
                yearContainer.appendChild(yearContent);
                episodesContainer.appendChild(yearContainer);
            }
        }
    } catch (error) {
        console.error('Error fetching episodes from file:', error);
    }
}

function extractGuestName(description) {
    const guestMatch = description.match(/guest[:]? (.+)/i);
    return guestMatch ? guestMatch[1] : 'N/A';
}

window.onload = fetchEpisodesFromFile;
