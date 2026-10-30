// Abbina: si collegano le voci di sinistra alle definizioni di destra.
import { esc, mescola, vibra, attendi } from './comune.js';
import { ABBINAMENTI, perCorso } from './contenuti.js';

export const ripeti = true;
const N = 3;
export const regole = `<ul>
  <li>Fino a ${N} gruppi di abbinamenti.</li>
  <li>Tocca una voce a sinistra e poi la sua definizione a destra.</li>
  <li>Ogni coppia trovata al primo colpo vale 15 punti, poi 5.</li></ul>`;

export async function gioca({ campo, hud, categorie }) {
  const gruppi = mescola(perCorso(ABBINAMENTI, categorie)).slice(0, N);
  const risposte = [], ripasso = [];
  let punti = 0;
  hud.aggiorna({ punti, extraLab: 'Gruppo', extra: `1/${gruppi.length}` });
  for (let k = 0; k < gruppi.length; k++) {
    hud.aggiorna({ extra: `${k + 1}/${gruppi.length}` });
    const g = gruppi[k];
    const errori = await gruppo(campo, g, p => hud.aggiorna({ punti: punti + p }));
    g.coppie.forEach(([sx, dx], i) => {
      const esatta = !errori.has(i);
      risposte.push({ id: `g:abbina:${g.id}:${i}`, scelta: null, esatta, cat: g.argomento, ...(esatta ? {} : { det: errori.get(i) }) });
      punti += esatta ? 15 : 5;
      if (!esatta) ripasso.push({ testo: `${g.titolo}: ${sx}`, tua: 'Avevi abbinato: ' + errori.get(i), giusta: dx });
    });
    hud.aggiorna({ punti });
    await attendi(500);
  }
  return { risposte, punti, ripasso, titolo: 'Abbinamenti completati' };
}

function gruppo(campo, g, aggiornaPunti) {
  return new Promise(risolvi => {
    const destra = mescola(g.coppie.map((_, i) => i));
    const errori = new Map();
    let sel = null, trovate = 0, parziale = 0;
    campo.innerHTML = `<div class="card-title" style="margin:0 2px 10px">${esc(g.titolo)}</div>
      <div class="colonne"><div class="col">${g.coppie.map(([sx], i) => `<button class="tessera" type="button" data-q="${i}">${esc(sx)}</button>`).join('')}</div>
      <div class="col">${destra.map(i => `<button class="tessera destra" type="button" data-a="${i}">${esc(g.coppie[i][1])}</button>`).join('')}</div></div>`;
    campo.addEventListener('click', function clic(ev) {
      const q = ev.target.closest('[data-q]'), a = ev.target.closest('[data-a]');
      if (q && !q.disabled) { campo.querySelectorAll('[data-q].sel').forEach(x => x.classList.remove('sel')); q.classList.add('sel'); sel = +q.dataset.q; return; }
      if (!a || a.disabled) return;
      if (sel === null) { a.classList.add('scuoti'); setTimeout(() => a.classList.remove('scuoti'), 400); return; }
      const qb = campo.querySelector(`[data-q="${sel}"]`);
      if (+a.dataset.a === sel) {
        trovate++; parziale += errori.has(sel) ? 5 : 15; aggiornaPunti(parziale);
        [qb, a].forEach(x => { x.classList.remove('sel'); x.classList.add('fatta', 'lampo-ok'); x.disabled = true; });
        sel = null;
        if (trovate === g.coppie.length) { campo.removeEventListener('click', clic); setTimeout(() => risolvi(errori), 450); }
      } else {
        vibra(100);
        if (!errori.has(sel)) errori.set(sel, g.coppie[+a.dataset.a][1]);
        [qb, a].forEach(x => { x.classList.add('errore', 'scuoti'); setTimeout(() => x.classList.remove('errore', 'scuoti'), 450); });
      }
    });
  });
}
