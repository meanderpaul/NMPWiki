import fetch from 'node-fetch';
import fs from 'fs';

async function transcribeAudio(audioFilePath) {
    const response = await fetch('https://api.example.com/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioFilePath })
    });
    const transcription = await response.json();
    return transcription.text;
}

const transcription1 = await transcribeAudio('path/to/video1/audio');
fs.writeFileSync('data/transcription1.txt', transcription1);
