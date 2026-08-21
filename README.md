# AURA — Vinyl-styled, YouTube-powered music player

Full-track playback via YouTube's official embedded player (legal — no
downloading or redistribution), a curated demo catalog that always works,
and **live YouTube search** once you add one free API key.

## What's new in this build

- **Queue + Sleep Timer.** Open Now Playing → tap **Queue** to see what's
  next and jump to any upcoming track, or tap **Sleep timer** to
  auto-pause playback after 15/30/45/60 minutes.
- **Settings page.** A gear icon in the top bar opens Playback
  (autoplay, resume-on-reopen), Notifications (in-app toast messages),
  Account, and About & Support — each toggle actually does something.
- **Profile menu.** Once signed in, tapping your avatar opens a
  dropdown with quick links to Settings and Sign out.
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

## Account backup (Google sign-in)

By default AURA stores Liked Songs, Playlists, and Recently Played only
in this browser's local storage — clearing your browser's data/history
wipes it. Signing in with Google backs it up to your own free Firebase
project and restores it automatically on any device where you sign in.
**Nobody but you can see it** — you own and control the Firebase project.

This is optional. If you skip this section, the app works exactly as
it did before — local-only, no sign-in button errors.

### 1. Create a Firebase project
1. Go to https://console.firebase.google.com/ and sign in with Google.
2. Click **Add project** → give it any name (e.g. "aura-music") → keep
   default settings → **Create project**.

### 2. Register a Web App to get your config
1. On the project's home page, click the **`</>`** (web) icon.
2. Give it a nickname (e.g. "AURA") → **Register app**.
3. You'll see a code block with values like `apiKey`, `authDomain`,
   `projectId`, etc. Keep this page open — you'll copy these next.

### 3. Enable Google Sign-In
1. In the left sidebar: **Build → Authentication → Get started**.
2. Under **Sign-in method**, click **Google** → toggle **Enable** → pick
   a support email → **Save**.
3. Still in Authentication, go to **Settings → Authorized domains** →
   **Add domain** → add your Vercel domain, e.g.
   `celestial-sound.vercel.app` (no `https://`, no trailing slash).

### 4. Create the database
1. Left sidebar: **Build → Firestore Database → Create database**.
2. Choose any location close to you → **Start in production mode** →
   **Create**.
3. Go to the **Rules** tab and replace everything with:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
   Click **Publish**. This makes sure each person can only ever read
   or write their own backup — nobody else's.

### 5. Paste your config into the app
1. Open **`firebase-config.js`** in your GitHub repo → tap the pencil
   (edit) icon.
2. Replace the placeholder values with the real ones from step 2 —
   `apiKey`, `authDomain`, `projectId`, `storageBucket`,
   `messagingSenderId`, `appId`. Keep the quotes, just swap what's
   inside them.
3. Commit the change. Vercel redeploys automatically.

### 6. Done
Open the app → tap **"Sign in with Google"** (top right) → your Liked
Songs / Playlists / Recently Played now sync automatically, and will
restore themselves if you ever reinstall the app or clear your
browser's storage.

## Notes
  function (`videoEmbeddable: true`), so results should play inline
  without redirecting to YouTube.
- If a specific video still can't embed (region lock, owner disabled
  embedding after indexing, etc.), the player automatically skips to
  the next track and shows a toast.
- Everything else — likes, playlists, recently played — is stored in
  the browser's `localStorage` by default (per device, no account
  needed), and optionally synced to your own Firebase project if you
  set up Google sign-in (see above).
