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
        <h1>Literature Discussed in Videos</h1>`;

literatureData.forEach(entry => {
    htmlContent += `
        <div class="video-summary">
            <h2>Video Title: Exploring the Viking Age Literature</h2>
            <p><strong>Summary:</strong> In this video, Dan interviews Rebeca Franco Valle about the literature from the Viking Age.</p>
            <h3>Key Points:</h3>
            <ul>${entry.keyPoints.map(point => `<li>${point}</li>`).join('')}</ul>
            <h3>Books Mentioned:</h3>
            <ul>${entry.books.map(book => `<li>${book}</li>`).join('')}</ul>
            <h3>Authors Mentioned:</h3>
            <ul>${entry.authors.map(author => `<li>${author}</li>`).join('')}</ul>
            <h3>Additional Resources:</h3>
            <ul>
                <li><a href="https://example.com/article1" target="_blank">Article on Viking Age Literature</a></li>
                <li><a href="https://example.com/article2" target="_blank">Interview with Rebeca Franco Valle</a></li>
            </ul>
        </div>`;
});

htmlContent += `
    </div>
</body>
</html>`;

fs.writeFileSync('literature.html', htmlContent);
