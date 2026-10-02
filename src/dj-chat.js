export function createDJChat() {
  const widget = document.createElement('div');
  widget.className = 'dj-chat';
  widget.innerHTML = '<div class="dj-messages" role="log" aria-live="polite" aria-label="DJ Bot conversation"></div><form><label for="dj-message">Your message</label><div class="dj-input-row"><input id="dj-message" maxlength="200" required autocomplete="off" placeholder="How are you feeling?"><button class="cta-btn" type="submit">SEND →</button></div></form><button type="button" class="dj-reset">Start again</button>';
  const log = widget.querySelector('.dj-messages');
  const form = widget.querySelector('form');
  const input = widget.querySelector('input');
  const submit = form.querySelector('button');
  let step = 'mood', mood = 'calm', busy = false, generation = 0;
  function message(text, user = false, url, label) {
    const bubble = document.createElement('p');
    bubble.className = user ? 'dj-user' : 'dj-answer';
    if (url) bubble.classList.add('dj-result');
    bubble.textContent = text;
    if (url) {
      const link = document.createElement('a'); link.href = url;
      link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.textContent = label; bubble.append(document.createElement('br'), link);
    }
    log.append(bubble); log.scrollTop = log.scrollHeight;
  }
  function reset() {
    generation++; busy = false; step = 'mood'; mood = 'calm'; log.replaceChildren();
    input.disabled = false; submit.disabled = false; input.value = '';
    message('Hey! I’m DJ Bot. How are you feeling today? 🎧');
  }
  widget.querySelector('.dj-reset').addEventListener('click', reset);
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (busy) return;
    const text = input.value.trim(); if (!text) return;
    message(text, true); input.value = '';
    if (/^exit$/i.test(text)) { step = 'done'; message('Catch you next time! Hit Start again for another mix.'); return; }
    if (/^special$/i.test(text)) { message('Here’s the original DJ Bot’s special playlist.', false, 'https://open.spotify.com/playlist/37i9dQZF1EP6YuccBxUcC1', 'Open the special playlist →'); return; }
    if (step === 'done' || /^another$/i.test(text)) { step = 'mood'; message('What’s your mood this time?'); return; }
    if (step === 'mood') {
      const groups = { sad: 'sad|down|heartbroken|blue|unhappy', stressed: 'stressed|anxious|overwhelmed|nervous', angry: 'angry|mad|furious|annoyed|frustrated', excited: 'excited|thrilled|pumped|ecstatic', happy: 'happy|joyful|cheerful|elated|content|grateful', calm: 'calm|relaxed|peaceful|serene' };
      mood = Object.keys(groups).find(key => new RegExp('\\b(' + groups[key] + ')\\b', 'i').test(text)) || 'calm';
      if (mood === 'sad') { step = 'intent'; message('Want music to match that feeling, or something to lift your mood?'); }
      else { step = 'activity'; message('Got it. What are you doing—studying, working out, relaxing, something else?'); }
      return;
    }
    if (step === 'intent') { if (/better|uplift|happy|improve|change|lift/i.test(text)) mood = 'happy'; step = 'activity'; message('What are you doing right now?'); return; }
    if (step !== 'activity') { message('Type “another” for a new mix, “special” for the curated playlist, or “exit”.'); return; }
    const query = `${mood} ${text} playlist`;
    busy = true; input.disabled = true; submit.disabled = true;
    const current = generation;
    let playlist;
    try {
      const response = await fetch('/.netlify/functions/dj-playlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mood, activity: text }), signal: AbortSignal.timeout(12000) });
      if (response.ok) { const result = await response.json(); if (/^https:\/\/open\.spotify\.com\/playlist\/[A-Za-z0-9]+$/.test(result.url)) playlist = result; }
    } catch { /* The static preview works through Spotify search too. */ }
    if (current !== generation) return;
    if (playlist) message('Here’s a playlist for your vibe. 🎶', false, playlist.url, playlist.name);
    else message('Here’s a Spotify search for your mood and activity. Choose a playlist that fits. 🎶', false, 'https://open.spotify.com/search/' + encodeURIComponent(query), 'Find your playlist on Spotify →');
    message('Want another? Type “another”, “special”, or “exit”.');
    step = 'post'; busy = false; input.disabled = false; submit.disabled = false; input.focus();
  });
  reset(); return widget;
}
