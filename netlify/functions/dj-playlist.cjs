let cachedToken, expires = 0;
exports.handler = async event => {
  const reply = (statusCode, body) => ({ statusCode, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(body) });
  if (event.httpMethod !== 'POST') return reply(405, { error: 'Use POST' });
  let data; try { data = JSON.parse(event.body || '{}'); } catch { return reply(400, { error: 'Invalid request' }); }
  if (!['happy','excited','calm','sad','angry','stressed'].includes(data.mood) || typeof data.activity !== 'string' || !data.activity.trim() || data.activity.length > 200) return reply(400, { error: 'Invalid mood or activity' });
  const id = process.env.SPOTIPY_CLIENT_ID, secret = process.env.SPOTIPY_CLIENT_SECRET;
  if (!id || !secret) return reply(503, { error: 'Spotify search is not configured' });
  try {
    if (!cachedToken || Date.now() >= expires) {
      const response = await fetch('https://accounts.spotify.com/api/token', { method: 'POST', headers: { Authorization: 'Basic ' + Buffer.from(id + ':' + secret).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials', signal: AbortSignal.timeout(4000) });
      if (!response.ok) throw new Error('Token request failed');
      const token = await response.json(); cachedToken = token.access_token; expires = Date.now() + (token.expires_in - 60) * 1000;
    }
    const query = `${data.mood} ${data.activity.trim()} playlist`;
    const response = await fetch('https://api.spotify.com/v1/search?' + new URLSearchParams({ q: query, type: 'playlist', limit: '5' }), { headers: { Authorization: 'Bearer ' + cachedToken }, signal: AbortSignal.timeout(4000) });
    if (!response.ok) throw new Error('Search failed');
    const results = await response.json();
    const playlist = results.playlists?.items?.find(item => item?.external_urls?.spotify);
    return playlist ? reply(200, { name: playlist.name, url: playlist.external_urls.spotify }) : reply(404, { error: 'No playlist found' });
  } catch { return reply(502, { error: 'Spotify is temporarily unavailable' }); }
};
