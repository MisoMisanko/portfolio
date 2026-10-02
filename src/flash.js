import { createDJChat } from './dj-chat.js';
import { createMusicTest } from './music-test.js';
const thesisUrl = new URL('./assets/Misanko_Thesis.pdf', import.meta.url);
const mediaRoot = '/mlggkflashnewz/assets/';
function projectCover(icon, top, bottom, gif, theme) {
  const cover = document.createElement('div');
  cover.className = 'project-cover ' + theme;
  cover.setAttribute('aria-hidden', 'true');
  const text = document.createElement('div');
  text.innerHTML = '<span class="cover-icon">' + icon + '</span><span>' + top + '</span><strong>' + bottom + '</strong>';
  const art = document.createElement('div');
  art.className = 'cover-art';
  art.innerHTML = theme === 'cover-news' ? '<div class="mini-news"><b>FLASH / 01</b><i></i><i></i><i></i><small>NEWS · CULTURE · IDEAS</small></div>' : theme === 'cover-taste' ? '<svg viewBox="0 0 200 180"><g fill="none" stroke="#00f0ff" stroke-width="2"><path d="M100 15L180 70L150 160H50L20 70Z M100 40L155 78L135 140H65L45 78Z M100 15V105L180 70 M100 105L150 160 M100 105L50 160 M100 105L20 70"/></g><path d="M100 35L145 85L138 143L67 136L36 76Z" fill="#b6ff0066" stroke="#b6ff00" stroke-width="4"/></svg>' : '<div class="turntable"><div class="record"></div><div class="equalizer">▂ ▅ █ ▃ ▆ ▂</div></div>';
  cover.append(text, art);
  return cover;
}
if (document.querySelector('#projects')) {
  const hero = document.querySelector('#hero');
  const about = document.querySelector('#about');
  const djbot = document.querySelector('#djbot');
  const projects = document.querySelector('#projects');
  const rows = [...projects.querySelectorAll('.project-wrapper > .row')];
  const categories = [
    { id: 'ai-work', label: 'AI work', icon: '🤖', note: 'Newsletters, music & machine learning', rows: [], extra: djbot },
    { id: 'strategy-work', label: 'Strategy Work', icon: '🎯', note: 'Coming soon', rows: [] },
    { id: 'creative-work', label: 'Creative Work', icon: '⚡', note: 'Concepts, copy & award-winning ideas', rows: [1, 0, 2, 3, 4] },
    { id: 'side-quests', label: 'Side quests', icon: '🛸', note: 'Things that escalated beautifully', rows: [5] },
  ];
  categories.forEach(category => {
    let section = category.section;
    if (!section) {
      section = document.createElement('section');
      section.innerHTML = '<div class="container"><div class="project-wrapper"><h2 class="section-title"></h2></div></div>';
      section.querySelector('h2').textContent = category.label + ' ' + category.icon;
      const wrapper = section.querySelector('.project-wrapper');
      category.rows.forEach(index => wrapper.append(rows[index]));
      if (category.id === 'ai-work') {
        const newsletter = document.createElement('article');
        newsletter.className = 'bot-panel';
        newsletter.innerHTML = '<h3 class="project-wrapper__text-title">⚡ MLGGK Flash Newz</h3><p>A weekly dose of campaigns, trends, and inspiration for MullenLowe GGK.</p><a class="cta-btn cta-btn--hero" href="/mlggkflashnewz/">OPEN FLASH NEWZ →</a>';
        newsletter.prepend(projectCover('⚡', 'MLGGK', 'FLASH NEWZ', 'steal_12.gif', 'cover-news'));
        wrapper.append(newsletter);
        const dissertation = document.createElement('article');
        dissertation.className = 'bot-panel research-preview';
        dissertation.innerHTML = '<span class="research-label">MSc DISSERTATION</span><h3 class="project-wrapper__text-title">Spotify Personality Predictor</h3><p>My MSc dissertation explores whether music taste can predict personality, with a Spotify prototype and a genre-based test.</p><div class="research-links"><a class="cta-btn cta-btn--hero" href="' + thesisUrl.href + '" target="_blank" rel="noopener noreferrer">DISSERTATION PDF →</a><a class="cta-btn cta-btn--hero" href="https://github.com/MisoMisanko/Spotify_scheduler" target="_blank" rel="noopener noreferrer">PROJECT &amp; CODE →</a></div>';
        dissertation.prepend(projectCover('🎧', 'YOUR MUSIC.', 'YOUR MIND?', 'steal_24.gif', 'cover-taste'));
        dissertation.append(createMusicTest());
        wrapper.append(dissertation);
      }
      if (category.extra) {
        const bot = category.extra.querySelector('.container');
        const panel = document.createElement('div');
        panel.className = 'bot-panel';
        while (bot.firstChild) panel.append(bot.firstChild);
        panel.prepend(projectCover('🤖', 'MOOD IN.', 'MUSIC OUT.', 'steal_07.gif', 'cover-bot'));
        panel.querySelector('iframe').remove();
        const tryPrompt = document.createElement('div');
        tryPrompt.className = 'dj-try-prompt';
        tryPrompt.innerHTML = '<span aria-hidden="true">↓ ↓ ↓</span><strong>YOUR NEXT PLAYLIST STARTS HERE</strong><span>Tell me your mood. Get your music. 🎧</span>';
        panel.append(tryPrompt, createDJChat());
        wrapper.querySelector('h2').after(panel);
        category.extra.remove();
      }
      projects.before(section);
    }
    section.id = category.id;
    section.classList.add('portfolio-view');
    section.querySelector('h2').textContent = category.label + ' ' + category.icon;
    category.section = section;
  });
  about.id = 'lore';
  about.querySelector('h2').textContent = 'Lore 🧠';
  projects.remove();
  document.querySelector('.hero-cta').remove();
  const nav = document.createElement('nav');
  nav.className = 'flash-nav portal-nav';
  nav.setAttribute('aria-label', 'Portfolio microsites');
  categories.forEach(category => {
    const link = document.createElement('a');
    link.href = '#' + category.id;
    link.innerHTML = '<span class="portal-icon">' + category.icon + '</span><span>' + category.label + '<small>' + category.note + '</small></span>';
    link.dataset.view = category.id;
    nav.append(link);
  });
  hero.append(nav);
  const home = document.createElement('a');
  home.className = 'view-home-link';
  home.href = '#home';
  home.textContent = '← HOME';
  hero.prepend(home);
  function showView() {
    const aliases = { about: 'home', lore: 'home', djbot: 'ai-work', projects: 'creative-work' };
    let id = location.hash.slice(1);
    id = aliases[id] || id;
    const active = categories.find(category => category.id === id);
    categories.forEach(category => {
      const selected = category === active;
      category.section.hidden = !selected;
      const link = nav.querySelector('[data-view="' + category.id + '"]');
      if (selected) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    about.hidden = !!active;
    document.body.classList.toggle('in-microsite', !!active);
    home.hidden = !active;
    if (active || id === 'home' || id === '') window.scrollTo(0, 0);
    document.title = active ? active.label + ' | Mišo Mišanko' : 'Mišo Mišanko | The Mišoverse';
  }
  window.addEventListener('hashchange', showView);
  showView();
}

const mainGifs = Array.from({ length: 48 }, (_, index) =>
  'steal_' + String(index).padStart(2, '0') + '.gif'
);
// Shuffle the main Flash Newz GIF collection once, without repeats between sections.
for (let i = mainGifs.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [mainGifs[i], mainGifs[j]] = [mainGifs[j], mainGifs[i]];
}
document.querySelectorAll('body > section').forEach((section, index) => {
  const rail = document.createElement('div');
  rail.className = 'gif-rail';
  rail.setAttribute('aria-hidden', 'true');
  for (let n = 0; n < 4; n++) {
    const gif = document.createElement('img');
    gif.src = mediaRoot + mainGifs[(index * 4 + n) % mainGifs.length];
    gif.alt = '';
    gif.loading = 'eager';
    gif.draggable = false;
    rail.append(gif);
  }
  section.append(rail);
});

const audio = document.createElement('audio');
audio.src = `${mediaRoot}song.mp3`;
audio.loop = true;
audio.preload = 'none';
audio.volume = 0.6;
document.body.append(audio);
const button = document.createElement('button');
button.id = 'musicbtn';
button.type = 'button';
button.textContent = 'Add music';
button.setAttribute('aria-label', 'Play background music');
button.setAttribute('aria-pressed', 'false');
document.body.append(button);
let manuallyStopped = false;
function updateMusic() {
  const playing = !audio.paused;
  button.textContent = playing ? 'Feel the lyrics, they are about me' : 'Add music';
  button.classList.toggle('on', playing);
  button.setAttribute('aria-pressed', String(playing));
  button.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
}
async function startMusic() {
  try { await audio.play(); } catch { /* Browser may require another interaction. */ }
  updateMusic();
}
button.addEventListener('click', () => {
  if (audio.paused) { manuallyStopped = false; startMusic(); }
  else { manuallyStopped = true; audio.pause(); }
});
audio.addEventListener('play', updateMusic);
audio.addEventListener('pause', updateMusic);

