import requests
from youtube_transcript_api import YouTubeTranscriptApi
import spacy

# Initialize NLP
nlp = spacy.load("en_core_web_sm")

def get_latest_videos(channel_id, api_key):
    url = f"https://www.googleapis.com/youtube/v3/search?key={api_key}&channelId={channel_id}&part=snippet,id&order=date&maxResults=10"
    response = requests.get(url)
    data = response.json()
    video_ids = [item['id']['videoId'] for item in data['items'] if 'videoId' in item['id']]
    return video_ids

def get_video_transcript(video_id):
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    full_text = " ".join([t['text'] for t in transcript])
    return full_text

def extract_locations_nlp(text):
    doc = nlp(text)
    locations = [ent.text for ent in doc.ents if ent.label_ == "GPE"]
    return locations

def update_locations_page(locations):
    with open('locations.html', 'w') as file:
        file.write('<html><body><h1>Locations</h1><ul>')
        for location in locations:
            file.write(f'<li>{location}</li>')
        file.write('</ul></body></html>')

channel_id = 'YOUR_CHANNEL_ID'
api_key = 'YOUR_API_KEY'
latest_videos = get_latest_videos(channel_id, api_key)

all_locations = []
for video_id in latest_videos:
    transcript = get_video_transcript(video_id)
    locations = extract_locations_nlp(transcript)
    all_locations.extend(locations)

update_locations_page(all_locations)
