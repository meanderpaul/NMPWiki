import fetch from 'node-fetch';
import fs from 'fs';

async function transcribeVideo(videoPath) {
    const response = await fetch('http://localhost:8000/api/v1/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoPath })
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const transcription = data.transcription;
    return transcription;
}

const videoPath = 'path/to/video1.mp4';
const transcription = await transcribeVideo(videoPath);
fs.writeFileSync('data/transcription1.txt', transcription);
console.log('Transcription saved to data/transcription1.txt');
