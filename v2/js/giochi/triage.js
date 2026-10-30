// Triage START: i feriti vengono generati a caso a partire dalle regole dell'algoritmo,
// così le risposte sono sempre coerenti. Ogni ferito ha una "regola decisiva" (RAMI_START):
// le statistiche mostrano quale passaggio dell'algoritmo viene sbagliato più spesso.
import { esc, mescola, vibra, contoAllaRovescia, attendi } from './comune.js';
import { RAMI_START } from './contenuti.js';
import { argomentoTriage } from './catalogo.js';

export const ripeti = true;
const N = 10, SECONDI = 150;
export const regole = `<ul>
  <li>Maxi-emergenza: arrivano <strong>${N} feriti</strong>, hai <strong>${SECONDI} secondi</strong> in tutto.</li>
  <li>Assegna a ciascuno il codice dell'algoritmo <strong>START</strong>:
    cammina → <b style="color:#1E8B5A">verde</b>; non respira nemmeno dopo l'apertura delle vie aeree → <b>nero</b>;
    respira solo dopo l'apertura, FR &gt; 30, polso radiale assente, non esegue ordini semplici → <b style="color:#C8102E">rosso</b>;
    altrimenti <b style="color:#9A7600">giallo</b>.</li>
  <li>10 punti per ogni codice giusto, bonus per il tempo avanzato.</li></ul>`;

const COLORE = { cammina: 'verde', apnea: 'nero', respira_dopo_apertura: 'rosso', fr_alta: 'rosso', perfusione: 'rosso', ordini: 'rosso', giallo: 'giallo' };
const NOMI = { verde: 'Verde', giallo: 'Giallo', rosso: 'Rosso', nero: 'Nero' };
const PESI = [['cammina', 2], ['apnea', 1], ['respira_dopo_apertura', 1], ['fr_alta', 1.5], ['perfusione', 1.5], ['ordini', 1.5], ['giallo', 2]];
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pesca = () => { const tot = PESI.reduce((s, [, p]) => s + p, 0); let x = Math.random() * tot; for (const [k, p] of PESI) { x -= p; if (x < 0) return k; } return 'giallo'; };

const CHI = ['Uomo, circa 40 anni', 'Donna, circa 25 anni', 'Ragazzo, circa 16 anni', 'Donna, circa 70 anni', 'Uomo, circa 60 anni', 'Ragazza, circa 20 anni', 'Uomo, circa 30 anni', 'Donna, circa 50 anni'];
const LESIONI = ['ferita al braccio', 'dolore alla gamba', 'escoriazioni al volto', 'trauma al torace', 'ferita alla testa', 'dolore all\'addome', 'sospetta frattura di polso', 'ustione alla mano'];

// Un ferito: descrizione con tutti i dati che servono a decidere, nell'ordine dell'algoritmo
export function generaFerito(regola = pesca()) {
  const chi = CHI[rnd(0, CHI.length - 1)], lesione = LESIONI[rnd(0, LESIONI.length - 1)];
  const dati = [];
  if (regola === 'cammina') {
    return { regola, chi, descr: `Si avvicina a te camminando da solo, ${lesione}.`, dati: [`Frequenza respiratoria ${rnd(14, 32)}/min`, 'Agitato, chiede aiuto per un familiare'] };
  }
  const descr = `A terra, non riesce a camminare: ${lesione}.`;
  if (regola === 'apnea') return { regola, chi, descr, dati: ['Non respira', 'Dopo l\'apertura delle vie aeree continua a non respirare'] };
  if (regola === 'respira_dopo_apertura') return { regola, chi, descr, dati: ['Non respira', 'Dopo l\'apertura delle vie aeree inizia a respirare'] };
  const fr = regola === 'fr_alta' ? rnd(32, 40) : rnd(12, 28);
  dati.push(`Respira, frequenza respiratoria ${fr}/min`);
  if (regola === 'fr_alta') { dati.push('Polso radiale presente'); return { regola, chi, descr, dati }; }
  if (regola === 'perfusione') {
    dati.push('Polso radiale assente');
    if (Math.random() < .5) dati.push('Risponde alle domande');
    return { regola, chi, descr, dati };
  }
  dati.push('Polso radiale presente');
  dati.push(regola === 'ordini' ? (Math.random() < .5 ? 'Non esegue ordini semplici ("stringi la mia mano")' : 'Confuso, non esegue ordini semplici') : 'Esegue gli ordini semplici');
  return { regola, chi, descr, dati };
}

export function gioca({ campo, hud, categorie }) {
  const cat = argomentoTriage(categorie);
  // almeno un ferito per i rami più importanti, poi a caso
  const regole = mescola(['cammina', 'apnea', 'fr_alta', 'perfusione', 'ordini', 'giallo', ...Array.from({ length: N - 6 }, pesca)]);
  const feriti = regole.map(generaFerito);
  const risposte = [], ripasso = [];
  let punti = 0, finito = false, ferma = () => {}, risolviGiro = null;
  return new Promise(async risolvi => {
    const chiudi = async (tempoFinito) => {
      if (finito) return; finito = true; ferma();
      const rimasti = tempoFinito ? 0 : (hud.stato.tempo || 0);
      punti += Math.round(rimasti / 3);
      hud.aggiorna({ punti });
      risolviGiro?.(null);
      risolvi({ risposte, punti, ripasso, titolo: tempoFinito ? `Tempo finito: ${risposte.length} feriti su ${N} valutati` : 'Tutti i feriti valutati' });
    };
    hud.aggiorna({ punti, tempo: SECONDI, extraLab: 'Ferito', extra: `1/${N}` });
    ferma = contoAllaRovescia(SECONDI, s => hud.aggiorna({ tempo: s }), () => chiudi(true));
    for (let k = 0; k < feriti.length && !finito; k++) {
      const f = feriti[k];
      hud.aggiorna({ extra: `${k + 1}/${N}` });
      campo.innerHTML = `<div class="ferito"><div class="chi">Ferito ${k + 1} · ${esc(f.chi)}</div><div class="descr">${esc(f.descr)}</div>
        <ul>${f.dati.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
        <div class="codici">${['verde', 'giallo', 'rosso', 'nero'].map(c => `<button type="button" class="${c}" data-c="${c}">${NOMI[c]}</button>`).join('')}</div>
        <div class="fb"></div>`;
      const scelta = await new Promise(r => { risolviGiro = r; campo.querySelector('.codici').addEventListener('click', ev => { const b = ev.target.closest('[data-c]'); if (b) r(b.dataset.c); }); });
      if (scelta === null || finito) break;
      const giusto = COLORE[f.regola], esatta = scelta === giusto;
      campo.querySelectorAll('.codici button').forEach(b => { b.disabled = b.dataset.c !== giusto && b.dataset.c !== scelta; });
      risposte.push({ id: `g:triage:${f.regola}`, scelta, esatta, cat });
      if (esatta) punti += 10;
      else { vibra(150); ripasso.push({ testo: `${f.descr} ${f.dati.join('; ')}.`, tua: 'Hai assegnato: ' + NOMI[scelta], giusta: 'Codice corretto: ' + NOMI[giusto], spieg: 'Regola START: ' + RAMI_START[f.regola] }); }
      hud.aggiorna({ punti });
      campo.querySelector('.fb').innerHTML = `<div class="feedback ${esatta ? 'ok' : 'ko'}"><strong>${esatta ? 'Giusto.' : 'Codice ' + NOMI[giusto] + '.'}</strong> ${esc(RAMI_START[f.regola])}</div>`;
      await attendi(esatta ? 900 : 2300);
    }
    chiudi(false);
  });
}
