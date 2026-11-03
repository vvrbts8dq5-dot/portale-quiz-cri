// Chiamata alla centrale: dallo scenario si scelgono le informazioni da comunicare (e si scartano quelle inutili).
import { esc, mescola, vibra } from './comune.js';
import { CHIAMATE, perCorso } from './contenuti.js';

export const ripeti = true;
const N = 3;
export const regole = `<ul>
  <li>${N} scenari: leggi cosa trovi sul posto.</li>
  <li>Tocca le informazioni da <strong>comunicare alla centrale</strong>, poi premi "Comunica".</li>
  <li>10 punti per ogni informazione giusta comunicata, −5 per ogni informazione inutile o fuorviante.
    Messaggio perfetto: +20.</li></ul>`;

export async function gioca({ campo, hud, categorie }) {
  const lista = mescola(perCorso(CHIAMATE, categorie)).slice(0, N);
  const risposte = [], ripasso = [];
  let punti = 0;
  hud.aggiorna({ punti, extraLab: 'Chiamata', extra: `1/${lista.length}` });
  for (let k = 0; k < lista.length; k++) {
    const el = lista[k];
    hud.aggiorna({ extra: `${k + 1}/${lista.length}` });
    const ordine = mescola(el.info.map((_, i) => i));
    campo.innerHTML = `<div class="card"><div class="card-title" style="margin-bottom:8px">📞 Chiamata alla centrale</div>
      <div class="scena">${esc(el.scenario)}</div>
      <p class="nota" style="margin:10px 2px 8px">Cosa comunichi? Tocca tutte le informazioni da dare.</p>
      <div class="info-chiamata">${ordine.map(i => `<button class="tessera" type="button" data-i="${i}" aria-pressed="false" style="width:100%;margin-bottom:6px;text-align:left">${esc(el.info[i].t)}</button>`).join('')}</div>
      <button class="btn" type="button" id="chInvia" style="margin-top:8px">Comunica</button><div class="fb"></div></div>`;
    const scelte = new Set();
    await new Promise(r => campo.addEventListener('click', function clic(ev) {
      const b = ev.target.closest('[data-i]');
      if (b) { const i = +b.dataset.i; scelte.has(i) ? scelte.delete(i) : scelte.add(i); b.classList.toggle('sel', scelte.has(i)); b.setAttribute('aria-pressed', scelte.has(i)); return; }
      if (ev.target.id === 'chInvia') { campo.removeEventListener('click', clic); r(); }
    }));
    const giuste = el.info.map((x, i) => x.ok ? i : -1).filter(i => i >= 0);
    const prese = giuste.filter(i => scelte.has(i)), mancate = giuste.filter(i => !scelte.has(i));
    const inutili = [...scelte].filter(i => !el.info[i].ok);
    const esatta = !mancate.length && !inutili.length;
    punti += Math.max(0, prese.length * 10 - inutili.length * 5) + (esatta ? 20 : 0);
    campo.querySelectorAll('[data-i]').forEach(b => { b.disabled = true; const i = +b.dataset.i;
      b.classList.remove('sel');
      const etichetta = t => b.insertAdjacentHTML('afterbegin', `<small style="display:block;font-weight:700;opacity:.8">${t}</small>`);
      if (el.info[i].ok && scelte.has(i)) { b.classList.add('fatta'); etichetta('✓ Comunicata'); }
      else if (el.info[i].ok) { b.classList.add('errore'); etichetta('Mancava'); }
      else if (scelte.has(i)) { b.classList.add('errore'); b.style.textDecoration = 'line-through'; etichetta('Non serviva'); }
      else b.style.opacity = .45; });
    campo.querySelector('#chInvia').remove();
    risposte.push({ id: `g:chiamata:${el.id}`, scelta: null, esatta, cat: el.argomento,
      ...(esatta ? {} : { det: `${mancate.length} mancate, ${inutili.length} inutili` }) });
    if (!esatta) {
      vibra(150);
      ripasso.push({ testo: el.scenario,
        tua: [mancate.length ? 'Non hai detto: ' + mancate.map(i => el.info[i].t).join('; ') : '', inutili.length ? 'Non serviva: ' + inutili.map(i => el.info[i].t).join('; ') : ''].filter(Boolean).join(' · '),
        giusta: 'Da comunicare: ' + giuste.map(i => el.info[i].t).join('; '), spieg: el.spiegazione });
    }
    hud.aggiorna({ punti });
    campo.querySelector('.fb').innerHTML = `<div class="feedback ${esatta ? 'ok' : 'ko'}">${esatta ? 'Messaggio perfetto! ' :
      `${mancate.length ? `Hai dimenticato ${mancate.length} informazion${mancate.length === 1 ? 'e' : 'i'}. ` : ''}${inutili.length ? `${inutili.length} informazion${inutili.length === 1 ? 'e non serviva' : 'i non servivano'}. ` : ''}`}${esc(el.spiegazione)}</div>`;
    await bottone(campo.querySelector('.card'), k < lista.length - 1 ? 'Prossima chiamata' : 'Fine');
  }
  return { risposte, punti, ripasso, titolo: risposte.every(r => r.esatta) ? 'Comunicazioni perfette!' : 'Chiamate completate' };
}

const bottone = (el, testo) => new Promise(r => {
  const b = document.createElement('button'); b.className = 'btn'; b.type = 'button'; b.textContent = testo; b.style.marginTop = '12px';
  b.onclick = () => r(); el.appendChild(b);
});
