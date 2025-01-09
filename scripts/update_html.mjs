import fs from 'fs';

const literatureData = JSON.parse(fs.readFileSync('data/literature.json', 'utf8'));

let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Literature - NMP Resources</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="navbar">
        <a href="index.html">Home</a>
        <a href="episodes.html">Episodes</a>
        <a href="literature.html" class="active">Literature</a>
        <a href="locations.html">Locations</a>
        <a href="guests.html">Guests</a>
        <a href="https://www.nordicmythologypodcast.com" target="_blank">NMP</a>
        <a href="https://www.hornsofodin.com" target="_blank">Horns of Odin</a>
    </div>

    <div class="container">
        <h1>Literature</h1>
        <div id="literature-container">
            <!-- Content will be dynamically loaded here by JavaScript -->
        </div>
    </div>

    <script>
        async function loadLiterature() {
            try {
                const response = await fetch('data/literature.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const literatureData = await response.json();
                
                const container = document.getElementById('literature-container');

                literatureData.forEach(entry => {
                    const videoSummary = document.createElement('div');
                    videoSummary.classList.add('video-summary');

                    videoSummary.innerHTML = `
                        <h2>Video Title: ${entry.videoTitle || 'Unknown Title'}</h2>
                        <p><strong>Summary:</strong> ${entry.summary || 'No summary available'}</p>
                        <h3>Key Points:</h3>
                        <ul>${entry.keyPoints.map(point => `<li>${point}</li>`).join('')}</ul>
                        <h3>Books Mentioned:</h>
                        <ul>${entry.books.map(book => `<li>${book}</li>`).join('')}</ul>
                        <h3>Authors Mentioned:</h3>
                        <ul>${entry.authors.map(author => `<li>${author}</li>`).join('')}</ul>
                        <h3>Additional Resources:</h3>
                        <ul>${entry.additionalResources.map(resource => `<li><a href="${resource}" target="_blank">${resource}</a></li>`).join('')}</ul>
                    `;
                    container.appendChild(videoSummary);
                });
            } catch (error) {
                console.error('Failed to load literature data:', error);
                document.getElementById('literature-container').innerHTML = '<p>Error loading literature data. Please try again later.</p>';
            }
        }

        window.onload = loadLiterature;
    </script>
</body>
</html>
