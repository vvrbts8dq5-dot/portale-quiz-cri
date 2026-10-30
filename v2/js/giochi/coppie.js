// Coppie lampo: 3 manche da 5 coppie domanda → risposta. Tocca una domanda, poi la sua risposta.
import { esc, mescola, vibra, attendi } from './comune.js';
import { domandaDaCoppia } from './catalogo.js';

export const ripeti = true;
const MANCHE = 3, PER_MANCHE = 5;
export const regole = `<ul>
  <li><strong>${MANCHE} manche</strong> da ${PER_MANCHE} coppie: a sinistra le domande, a destra le risposte mescolate.</li>
  <li>Tocca una domanda e poi la risposta giusta.</li>
  <li>Ogni coppia trovata al primo colpo vale 20 punti, poi 5. Bonus se finisci la manche in fretta.</li></ul>`;

// Sceglie domande con risposte tutte diverse tra loro (altrimenti due coppie sarebbero ambigue)
function scegli(domande, n) {
  const usate = new Set(), out = [];
  for (const d of mescola(domande.filter(domandaDaCoppia))) {
    const k = d.opzioni[d.corretta].trim().toLowerCase();
    if (usate.has(k)) continue;
    usate.add(k); out.push(d);
    if (out.length === n) break;
  }
  return out;
}

export async function gioca({ campo, hud, domande }) {
  const tutte = scegli(domande, MANCHE * PER_MANCHE);
  const risposte = [], ripasso = [];
  let punti = 0;
  const nManche = Math.max(1, Math.floor(tutte.length / PER_MANCHE));
  hud.aggiorna({ punti, extraLab: 'Manche', extra: `1/${nManche}` });
  for (let m = 0; m < nManche; m++) {
    hud.aggiorna({ extra: `${m + 1}/${nManche}` });
    const gruppo = tutte.slice(m * PER_MANCHE, (m + 1) * PER_MANCHE);
    punti += await manche(campo, gruppo, risposte, ripasso, p => hud.aggiorna({ punti: punti + p }));
    hud.aggiorna({ punti });
    await attendi(500);
  }
  return { risposte, punti, ripasso, titolo: 'Tutte le coppie trovate!' };
}

function manche(campo, gruppo, risposte, ripasso, aggiornaPunti) {
  return new Promise(risolvi => {
    const destra = mescola(gruppo.map((d, i) => i));
    const errori = new Set(), sbagliateScelte = new Map();
    let sel = null, trovate = 0, parziale = 0;
    const t0 = Date.now();
    campo.innerHTML = `<p class="nota" style="margin:0 2px 10px">Tocca una domanda e poi la sua risposta.</p>
      <div class="colonne"><div class="col">${gruppo.map((d, i) => `<button class="tessera" type="button" data-q="${i}">${esc(d.testo)}</button>`).join('')}</div>
      <div class="col">${destra.map(i => `<button class="tessera destra" type="button" data-a="${i}">${esc(gruppo[i].opzioni[gruppo[i].corretta])}</button>`).join('')}</div></div>`;
    campo.addEventListener('click', function clic(ev) {
      const q = ev.target.closest('[data-q]'), a = ev.target.closest('[data-a]');
      if (q && !q.disabled) {
        campo.querySelectorAll('[data-q].sel').forEach(x => x.classList.remove('sel'));
        q.classList.add('sel'); sel = +q.dataset.q; return;
      }
      if (!a || a.disabled) return;
      if (sel === null) { a.classList.add('scuoti'); setTimeout(() => a.classList.remove('scuoti'), 400); return; }
      const qb = campo.querySelector(`[data-q="${sel}"]`);
      if (+a.dataset.a === sel) {
        trovate++;
        parziale += errori.has(sel) ? 5 : 20;
        aggiornaPunti(parziale);
        [qb, a].forEach(x => { x.classList.remove('sel'); x.classList.add('fatta', 'lampo-ok'); x.disabled = true; x.insertAdjacentHTML('afterbegin', `<span class="num">${trovate}</span>`); });
        sel = null;
        if (trovate === gruppo.length) {
          campo.removeEventListener('click', clic);
          const sec = (Date.now() - t0) / 1000;
          parziale += Math.max(0, Math.round(40 - sec));
          gruppo.forEach((d, i) => {
            const esatta = !errori.has(i);
            risposte.push({ id: d.id, scelta: esatta ? d.corretta : null, esatta, cat: d.categoria, ...(esatta ? {} : { det: sbagliateScelte.get(i) }) });
            if (!esatta) ripasso.push({ testo: d.testo, tua: 'Avevi abbinato: ' + sbagliateScelte.get(i), giusta: 'Risposta corretta: ' + d.opzioni[d.corretta], spieg: d.spiegazione });
          });
          setTimeout(() => risolvi(parziale), 450);
        }
      } else {
        vibra(100);
        if (!errori.has(sel)) { errori.add(sel); sbagliateScelte.set(sel, a.textContent); }
        [qb, a].forEach(x => { x.classList.add('errore', 'scuoti'); setTimeout(() => x.classList.remove('errore', 'scuoti'), 450); });
      }
    });
  });
}
