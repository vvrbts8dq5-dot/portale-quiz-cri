// La scala: 15 domande di difficoltà crescente, due aiuti, traguardi al 5° e al 10° gradino.
import { mescola, vibra, attendi, esc } from './comune.js';
import { disegnaDomanda, vocePerRipasso } from './domanda-ui.js';

export const ripeti = true;
const PREMI = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
const TRAGUARDI = [4, 9]; // indici (5° e 10° gradino)
const fmt = n => n.toLocaleString('it-IT');
export const regole = `<ul>
  <li><strong>15 gradini</strong>: domande facili, poi medie, poi difficili. Nessun limite di tempo.</li>
  <li>Due aiuti, una volta sola: <strong>50:50</strong> toglie metà delle risposte sbagliate, <strong>Cambia domanda</strong> ne propone un'altra.</li>
  <li>Se sbagli scendi all'ultimo traguardo raggiunto (5° o 10° gradino).</li>
  <li>Puoi <strong>ritirarti</strong> in qualsiasi momento e tenere i punti del gradino raggiunto.</li></ul>`;

function mazzi(domande) {
  const liv = l => mescola(domande.filter(d => (d.difficolta || 'medio') === l));
  const f = liv('facile'), m = liv('medio'), dd = liv('difficile');
  const prendi = (prima, n, ...altre) => { const out = prima.splice(0, n); for (const a of altre) while (out.length < n && a.length) out.push(a.shift()); return out; };
  const scelte = [...prendi(f, 5, m, dd), ...prendi(m, 5, f, dd), ...prendi(dd, 5, m, f)];
  return { scelte, riserva: { facile: f, medio: m, difficile: dd, tutte: [...f, ...m, ...dd] } };
}

export async function gioca({ campo, hud, domande }) {
  const { scelte, riserva } = mazzi(domande);
  const risposte = [], ripasso = [];
  const aiuti = { cinquanta: true, cambia: true };
  let gradino = 0, punti = 0, esito = null;
  campo.innerHTML = `<div class="scala-wrap"><div><div id="scDom"></div>
      <div class="aiuti"><button type="button" id="sc50">50:50</button><button type="button" id="scCambia">Cambia domanda</button>
      <button type="button" id="scRitira">Ritirati</button></div></div>
    <div class="gradini" id="scGradini"></div></div>`;
  const gradini = () => campo.querySelector('#scGradini').innerHTML = PREMI.map((p, i) => `<div class="${i === gradino ? 'ora' : i < gradino ? 'fatto' : ''} ${TRAGUARDI.includes(i) ? 'traguardo' : ''}">
    <span>${i + 1}</span><span>${fmt(p)}</span></div>`).join('');
  hud.aggiorna({ punti: 0, extraLab: 'Gradino', extra: '1/15' });

  while (gradino < scelte.length) {
    let d = scelte[gradino];
    gradini(); hud.aggiorna({ extra: `${gradino + 1}/${scelte.length}` });
    let ui = disegnaDomanda(campo.querySelector('#scDom'), d);
    const b50 = campo.querySelector('#sc50'), bCambia = campo.querySelector('#scCambia'), bRitira = campo.querySelector('#scRitira');
    b50.disabled = !aiuti.cinquanta || d.tipo === 'vf' || d.opzioni.length < 3;
    bCambia.disabled = !aiuti.cambia;
    bRitira.disabled = false;
    // la scelta arriva o da una risposta, o dal ritiro
    const azione = await new Promise(r => {
      const attesa = s => r({ s });
      let corrente = ui;
      corrente.scelta.then(attesa);
      b50.onclick = () => { aiuti.cinquanta = false; b50.disabled = true; corrente.togli(d.opzioni.length - 2); };
      bCambia.onclick = () => {
        const liv = d.difficolta || 'medio';
        const nuova = (riserva[liv].length ? riserva[liv] : riserva.tutte).find(x => !scelte.includes(x));
        if (!nuova) return;
        aiuti.cambia = false; bCambia.disabled = true;
        riserva[liv] = riserva[liv].filter(x => x !== nuova); riserva.tutte = riserva.tutte.filter(x => x !== nuova);
        scelte[gradino] = d = nuova;
        corrente = disegnaDomanda(campo.querySelector('#scDom'), d);
        b50.disabled = !aiuti.cinquanta || d.tipo === 'vf' || d.opzioni.length < 3;
        ui = corrente;
        corrente.scelta.then(attesa);
      };
      bRitira.onclick = () => r({ ritiro: true });
    });
    [b50, bCambia, bRitira].forEach(b => { b.disabled = true; b.onclick = null; });
    if (azione.ritiro) { esito = 'ritiro'; break; }
    const s = azione.s, esatta = s === d.corretta;
    risposte.push({ id: d.id, scelta: s, esatta, cat: d.categoria });
    ui.mostraCorrezione(s);
    if (!esatta) {
      vibra(200); ripasso.push(vocePerRipasso(d, s));
      const t = [...TRAGUARDI].reverse().find(t => gradino > t);
      punti = t === undefined ? 0 : PREMI[t];
      esito = 'errore';
      hud.aggiorna({ punti });
      await attendi(2200);
      break;
    }
    punti = PREMI[gradino];
    hud.aggiorna({ punti });
    gradino++;
    await attendi(1300);
  }
  if (!esito) esito = 'vinto';
  const titoli = { vinto: 'Hai completato la scala!', ritiro: `Ti sei ritirato al gradino ${gradino + 1}`, errore: `Errore al gradino ${gradino + 1}${punti ? ': scendi al traguardo' : ''}` };
  return { risposte, punti, ripasso, titolo: titoli[esito], nota: esito === 'vinto' ? '15 gradini su 15' : esc(`${gradino} gradini superati`) };
}
