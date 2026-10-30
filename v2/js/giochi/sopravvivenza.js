// Sopravvivenza: tre vite, domande sempre più difficili, 25 secondi a domanda.
import { mescola, vibra, attendi, MAX_RISPOSTE } from './comune.js';
import { disegnaDomanda, vocePerRipasso } from './domanda-ui.js';

export const ripeti = true;
const SECONDI = 25;
const VALORE = { facile: 10, medio: 20, difficile: 30 };
export const regole = `<ul>
  <li>Hai <strong>3 vite</strong>: ogni errore (o tempo scaduto) ne toglie una.</li>
  <li><strong>${SECONDI} secondi</strong> per ogni domanda; più rispondi in fretta, più bonus prendi.</li>
  <li>Le domande diventano via via più difficili: facili 10 punti, medie 20, difficili 30.</li>
  <li>Quando sbagli vedi subito la risposta giusta e la spiegazione.</li></ul>`;

// 6 facili, poi 8 medie, poi difficili; se un livello finisce si pesca dagli altri
function costruisciMazzo(domande) {
  const liv = l => mescola(domande.filter(d => (d.difficolta || 'medio') === l));
  const f = liv('facile'), m = liv('medio'), dd = liv('difficile');
  const out = [...f.splice(0, 6), ...m.splice(0, 8), ...dd, ...m, ...f];
  return out;
}

export async function gioca({ campo, hud, domande }) {
  const mazzo = costruisciMazzo(domande);
  const risposte = [], ripasso = [];
  let vite = 3, punti = 0;
  hud.aggiorna({ punti, vite, viteMax: 3, extraLab: 'Domanda', extra: 1 });
  for (let i = 0; i < mazzo.length && vite > 0 && risposte.length < MAX_RISPOSTE; i++) {
    const d = mazzo[i];
    hud.aggiorna({ extra: i + 1 });
    const t0 = Date.now();
    const ui = disegnaDomanda(campo, d, { secondi: SECONDI });
    const s = await ui.scelta;
    const esatta = s === d.corretta;
    risposte.push({ id: d.id, scelta: s, esatta, cat: d.categoria });
    ui.mostraCorrezione(s);
    if (esatta) {
      const bonus = Math.max(0, Math.round((SECONDI - (Date.now() - t0) / 1000) / 2));
      punti += (VALORE[d.difficolta] || 20) + bonus;
      hud.aggiorna({ punti });
      await attendi(1100);
    } else {
      vite--; vibra(150);
      ripasso.push(vocePerRipasso(d, s));
      hud.aggiorna({ vite });
      campo.firstElementChild.classList.add('scuoti');
      await continua(campo, vite > 0 ? 'Continua' : 'Vedi il risultato');
    }
  }
  return { risposte, punti, ripasso, titolo: vite > 0 ? 'Hai finito le domande disponibili!' : `Sei arrivato alla domanda ${risposte.length}` };
}

function continua(campo, testo) {
  return new Promise(r => {
    const b = document.createElement('button');
    b.className = 'btn'; b.type = 'button'; b.textContent = testo; b.style.marginTop = '12px';
    b.onclick = () => r();
    campo.appendChild(b);
    b.focus({ preventScroll: true });
  });
}
