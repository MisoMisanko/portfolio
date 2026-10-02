import coefficients from './genre-coefficients.json';

export function createMusicTest() {
  const test = document.createElement('details');
  test.className = 'music-test';
  const genres = ['Alternative', 'Classical music', 'Dance', 'Hiphop, Rap', 'Pop', 'Rock'];
  const traits = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'];
  test.innerHTML = '<summary>🧪 TEST YOUR TASTE</summary><p>Rate these genres: 1 = dislike, 3 = neutral, 5 = love. See how the dissertation model shifts its estimates relative to neutral preferences.</p>';
  const form = document.createElement('form');
  genres.forEach((genre, index) => {
    const label = document.createElement('label');
    label.htmlFor = `genre-${index}`;
    label.textContent = genre;
    const input = document.createElement('input');
    input.id = label.htmlFor;
    input.type = 'range'; input.min = '1'; input.max = '5'; input.step = '1'; input.value = '3';
    input.dataset.genre = genre;
    const value = document.createElement('output');
    value.textContent = '3'; value.htmlFor = input.id;
    input.addEventListener('input', () => { value.textContent = input.value; });
    label.append(input, value);
    form.append(label);
  });
  const submit = document.createElement('button');
  submit.type = 'submit'; submit.className = 'cta-btn'; submit.textContent = 'RUN THE EXPERIMENT →';
  form.append(submit);
  const results = document.createElement('div');
  results.className = 'taste-results'; results.setAttribute('aria-live', 'polite');
  form.addEventListener('submit', event => {
    event.preventDefault(); results.replaceChildren();
    traits.forEach(trait => {
      const delta = [...form.querySelectorAll('input')].reduce((sum, input) => {
        const row = coefficients.find(item => item.Genre === input.dataset.genre);
        return sum + (Number(input.value) - 3) * Number(row[trait]);
      }, 0);
      const line = document.createElement('div');
      line.className = 'taste-result';
      const name = document.createElement('strong'); name.textContent = trait;
      const score = document.createElement('span'); score.textContent = `${delta >= 0 ? '+' : ''}${delta.toFixed(2)} points`;
      line.append(name, score); results.append(line);
    });
  });
  const note = document.createElement('p');
  note.className = 'preview-note';
  note.textContent = 'Uses the published genre coefficients. Unrated genres stay neutral. These are changes on the model’s 1–5 trait scale, before clipping—not absolute personality scores. The full Spotify app adds listening-pattern adjustments. Everything here runs in your browser.';
  test.append(form, results, note);
  return test;
}
