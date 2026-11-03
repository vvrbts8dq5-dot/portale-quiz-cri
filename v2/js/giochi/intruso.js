// Intruso: quattro voci, una non appartiene al gruppo. Si tocca l'intruso e si vede il perché.
import { esc, mescola, vibra } from './comune.js';
import { INTRUSI, perCorso } from './contenuti.js';

export const ripeti = true;
const N = 8, VELOCE = 8; // gruppi per partita, secondi per il bonus
export const regole = `<ul>
  <li>${N} gruppi da quattro voci: in ognuno <strong>una non c'entra</strong>.</li>
  <li>Tocca l'intruso. Risposta giusta: 10 punti, +5 se rispondi entro ${VELOCE} secondi.</li>
  <li>Dopo ogni risposta vedi il perché, preso dal manuale.</li></ul>`;

export async function gioca({ campo, hud, categorie }) {
  const lista = mescola(perCorso(INTRUSI, categorie)).slice(0, N);
  const risposte = [], ripasso = [];
  let punti = 0;
  hud.aggiorna({ punti, extraLab: 'Gruppo', extra: `1/${lista.length}` });
  for (let k = 0; k < lista.length; k++) {
    const el = lista[k];
    hud.aggiorna({ extra: `${k + 1}/${lista.length}` });
    const ordine = mescola([0, 1, 2, 3]);
    campo.innerHTML = `<div class="card"><div class="card-title" style="margin-bottom:10px">${esc(el.titolo)}</div>
      ${ordine.map(i => `<button class="scelta-caso" type="button" data-i="${i}">${esc(el.voci[i])}</button>`).join('')}<div class="fb"></div></div>`;
    const inizio = Date.now();
    const s = await new Promise(r => campo.addEventListener('click', function clic(ev) {
      const b = ev.target.closest('[data-i]'); if (!b) return; campo.removeEventListener('click', clic); r(+b.dataset.i);
    }));
    const esatta = s === el.intruso;
    campo.querySelectorAll('.scelta-caso').forEach(b => { b.disabled = true; const i = +b.dataset.i;
      if (i === el.intruso) b.classList.add('giusta'); else if (i === s) b.classList.add('sbagliata'); else b.style.opacity = .5; });
    if (esatta) punti += 10 + ((Date.now() - inizio) / 1000 <= VELOCE ? 5 : 0);
    else { vibra(150); ripasso.push({ testo: el.titolo, tua: 'Hai scelto: ' + el.voci[s], giusta: 'Intruso: ' + el.voci[el.intruso], spieg: el.perche }); }
    risposte.push({ id: `g:intruso:${el.id}`, scelta: s, esatta, cat: el.argomento });
    hud.aggiorna({ punti });
    campo.querySelector('.fb').innerHTML = `<div class="feedback ${esatta ? 'ok' : 'ko'}">${esatta ? 'Giusto! ' : 'No: l\'intruso era «' + esc(el.voci[el.intruso]) + '». '}${esc(el.perche)}</div>`;
    await bottone(campo.querySelector('.card'), k < lista.length - 1 ? 'Avanti' : 'Fine');
  }
  const giuste = risposte.filter(r => r.esatta).length;
  return { risposte, punti, ripasso, titolo: giuste === risposte.length ? 'Nessun intruso ti è sfuggito!' : 'Intrusi trovati' };
}

const bottone = (el, testo) => new Promise(r => {
  const b = document.createElement('button'); b.className = 'btn'; b.type = 'button'; b.textContent = testo; b.style.marginTop = '12px';
  b.onclick = () => r(); el.appendChild(b);
});
