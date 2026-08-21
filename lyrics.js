// Vercel serverless function — fetches lyrics from the free lyrics.ovh API.
// Deployed at: /api/lyrics?artist=<artist>&title=<title>
// No API key required. Results are best-effort — not every track has
// lyrics available in the underlying database.

function cleanArtist(a) {
  // YouTube channel titles often carry suffixes like "- Topic", "VEVO", etc.
  return (a || '')
    .replace(/\s*-\s*topic$/i, '')
    .replace(/vevo$/i, '')
    .replace(/official$/i, '')
    .trim();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const artist = cleanArtist((req.query.artist || '').toString());
  const title = (req.query.title || '').toString().trim();

  if (!artist || !title) {
    return res.status(400).json({ ok: false, reason: 'missing_params', lyrics: '' });
  }

  try {
    const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
    const r = await fetch(url);

    if (r.status === 404) {
      return res.status(200).json({ ok: false, reason: 'not_found', lyrics: '' });
    }
    if (!r.ok) {
      return res.status(200).json({ ok: false, reason: 'provider_error', lyrics: '' });
    }

    const data = await r.json();
    if (!data.lyrics) {
      return res.status(200).json({ ok: false, reason: 'not_found', lyrics: '' });
    }

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).json({ ok: true, lyrics: data.lyrics.trim() });
  } catch (err) {
    return res.status(200).json({ ok: false, reason: 'server_error', lyrics: '' });
  }
}
