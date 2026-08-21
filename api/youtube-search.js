
// Vercel serverless function — the ONLY place the YouTube API key is used.
// Deployed at: /api/youtube-search?q=<query>
//
// Requires an environment variable YOUTUBE_API_KEY set in your Vercel
// project (Settings -> Environment Variables). Never commit the real key.

export default async function handler(req, res) {
  // Basic CORS (safe to restrict to your own domain once deployed)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.YOUTUBE_API_KEY;
  const q = (req.query.q || '').toString().trim();

  if (!apiKey) {
    return res.status(200).json({
      ok: false,
      reason: 'no_api_key',
      message: 'YOUTUBE_API_KEY is not set on the server. Search is running on the local demo catalog instead.',
      results: [],
    });
  }
  if (!q) {
    return res.status(400).json({ ok: false, reason: 'missing_query', results: [] });
  }

  try {
    const params = new URLSearchParams({
      part: 'snippet',
      q,
      type: 'video',
      videoCategoryId: '10', // Music category
      videoEmbeddable: 'true',
      maxResults: '25',
      safeSearch: 'none',
      key: apiKey,
    });

    const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
    const data = await ytRes.json();

    if (!ytRes.ok) {
      return res.status(ytRes.status).json({
        ok: false,
        reason: 'youtube_api_error',
        message: data?.error?.message || 'YouTube API request failed.',
        results: [],
      });
    }

    const results = (data.items || [])
      .filter(item => item.id && item.id.videoId)
      .map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
        publishedAt: item.snippet.publishedAt,
      }));

    // Cache at the edge for a bit to save quota on repeat queries.
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ ok: true, results });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      reason: 'server_error',
      message: err.message,
      results: [],
    });
  }
}
