# NMP Resources

Companion site for the [Nordic Mythology Podcast](https://www.nordicmythologypodcast.com): browse episodes, guests, literature references, and historic locations.

## Stack

- Vite + React + React Router
- Static JSON data under `public/data/`
- Node scripts + GitHub Actions to refresh YouTube-derived data

## Setup

Requirements: **Node.js 20+**

```bash
cp .env.example .env
# Add your YouTube Data API v3 key to .env
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

### Required secret

| Name | Where |
|------|--------|
| `YOUTUBE_API_KEY` | Local `.env` and GitHub Actions repository secret |

The old committed API key must be treated as compromised: revoke/rotate it in Google Cloud and store only the new key as a secret.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run fetch` | Fetch playlist episodes → `public/data/episodes.json` |
| `npm run guests` | Rebuild `public/data/guests.json` from episodes |
| `npm run literature` | Rebuild `public/data/literature.json` from episode descriptions |
| `npm run data` | Run guests + literature |

## Deploy

```bash
npm run build
```

Serve the `dist/` folder with any static host (GitHub Pages, Netlify, nginx, etc.). Data files are copied from `public/` into the build output.

## CI

Weekly (and manual) workflows:

- `.github/workflows/update-episodes.yml` — fetch episodes, then regenerate guests + literature
- `.github/workflows/update_guests.yml` — guests only
- `.github/workflows/update-literature.yml` — literature only

Configure `YOUTUBE_API_KEY` under repository **Settings → Secrets and variables → Actions**.

## About the podcast

Since 2019, NMP has shared accurate discussions of Nordic mythology and the Viking Age. This site expands on episode content so listeners can follow guests, places, books, and papers referenced on the show.
