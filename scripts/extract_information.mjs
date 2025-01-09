import fs from 'fs';

function extractInformation(transcription) {
    const books = transcription.match(/\b(?:book|title):\s*(.*?)\b/gi) || [];
    const authors = transcription.match(/\b(?:author|writer):\s*(.*?)\b/gi) || [];
    const keyPoints = transcription.match(/\b(?:key point|important):\s*(.*?)\b/gi) || [];
    return { books, authors, keyPoints };
}

const transcription1 = fs.readFileSync('data/transcription1.txt', 'utf8');
const data = [extractInformation(transcription1)];
fs.writeFileSync('data/literature.json', JSON.stringify(data, null, 2));
console.log('Extracted information saved to data/literature.json');
