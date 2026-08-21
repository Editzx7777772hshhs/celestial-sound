# AURA — Vinyl-styled, YouTube-powered music player

Full-track playback via YouTube's official embedded player (legal — no
downloading or redistribution), a curated demo catalog that always works,
and **live YouTube search** once you add one free API key.

## What's new in this build

- **Installable app + lock-screen controls.** A `manifest.json` and
  service worker (`sw.js`) make AURA installable ("Add to Home Screen"
  on Android/iOS). Combined with the Media Session API, this gives you
  real play/pause/next/prev controls in the phone's notification
  shade and lock screen, and is what makes playback survive going to
  the background — a plain browser tab running a YouTube iframe will
  still get suspended by the OS, so **installing the app icon (not
  just visiting the URL) is the fix for background playback.**
- **Tap-to-expand Now Playing view.** Tap the mini player bar to open
  a full-screen player with big art, a Lyrics tab, like/shuffle/repeat,
  and swipe-down-to-close.
- **Lyrics.** `api/lyrics.js`, a serverless function using the free
  lyrics.ovh API (no key needed). Best-effort — not every track has
  lyrics indexed, and it shows a friendly "not found" state when so.
- **Real mobile bottom nav.** Previously missing on phones entirely;
  now Home/Search/Liked/Playlists/Recent are always reachable.
- **Daily Hits** strip on Home (deterministic daily shuffle of the
  catalog) and a redesigned **Liked Songs** header with cover collage,
  track count, Play All and Shuffle.

## How it works

- **Frontend**: a single static `index.html` — no build step, no
  framework. Works the moment you open it.
- **Live search**: `api/youtube-search.js`, a serverless function that
  calls the YouTube Data API. This is the *only* place your API key is
  used — it never reaches the browser.
- **Fallback**: if the key isn't set (or a request fails), search
  silently falls back to filtering the local 30-track demo catalog, so
  the app is never broken — just less exhaustive.

## 1. Get a free YouTube Data API key

1. Go to https://console.cloud.google.com/
2. Create a project (or pick an existing one).
3. Go to **APIs & Services → Library**, search **"YouTube Data API v3"**,
   click **Enable**.
4. Go to **APIs & Services → Credentials → Create Credentials → API key**.
5. Copy the key. (Optional but recommended: click "Restrict key" →
   restrict it to the YouTube Data API v3 only.)

Free tier: 10,000 quota units/day. Each search costs 100 units, so
that's about 100 live searches/day by default — plenty for personal use.
The backend caches results for an hour to stretch this further.

## 2. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Then in the Vercel dashboard: **Project → Settings → Environment
Variables**, add:

```
YOUTUBE_API_KEY = <your key from step 1>
```

Redeploy (`vercel --prod`) after adding the variable. That's it — the
search bar now hits real YouTube results for anything, not just the
30 demo tracks.

## 3. Run locally with live search

```bash
npm i -g vercel
vercel dev
```

`vercel dev` serves both `index.html` and `/api/youtube-search`
together, matching production. Create a `.env` file with
`YOUTUBE_API_KEY=...` for local testing, or just open `index.html`
directly in a browser to use the demo catalog only (no live search
without the serverless function running).

## Notes

- Only videos YouTube marks as embeddable are returned by the search
  function (`videoEmbeddable: true`), so results should play inline
  without redirecting to YouTube.
- If a specific video still can't embed (region lock, owner disabled
  embedding after indexing, etc.), the player automatically skips to
  the next track and shows a toast.
- Everything else — likes, playlists, recently played — is stored in
  the browser's `localStorage`, per device, no account needed.
