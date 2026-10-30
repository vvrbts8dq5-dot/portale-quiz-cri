// Disegna una domanda a scelta (multipla o V/F) e aspetta la risposta.
import { esc, mescola, contoAllaRovescia } from './comune.js';

const ETICHETTE = { facile: 'Facile', medio: 'Media', difficile: 'Difficile' };

// Ritorna { scelta: Promise<indice originale | null se tempo scaduto>, mostraCorrezione(scelta), togli(n), ferma() }
export function disegnaDomanda(contenitore, d, { secondi = 0, extraHtml = '' } = {}) {
  const indici = d.tipo === 'vf' ? d.opzioni.map((_, i) => i) : mescola(d.opzioni.map((_, i) => i));
  contenitore.innerHTML = `<div class="card">
    ${secondi ? '<div class="barra-tempo"><div style="width:100%"></div></div>' : ''}
    <span class="etichetta ${d.difficolta || ''}">${d.tipo === 'vf' ? 'Vero / Falso' : 'Risposta multipla'}${d.difficolta ? ' · ' + ETICHETTE[d.difficolta] : ''}</span>
    <div class="testo-domanda">${esc(d.testo)}</div>
    <div class="opzioni">${indici.map((o, pos) => `<button class="opz" type="button" data-o="${o}">
      <span class="lettera">${d.tipo === 'vf' ? d.opzioni[o][0] : 'ABCDEF'[pos]}</span><span>${esc(d.opzioni[o])}</span></button>`).join('')}</div>
    <div class="fb"></div>${extraHtml}</div>`;
  let risolvi, ferma = () => {};
  const scelta = new Promise(r => { risolvi = r; });
  const finito = v => { ferma(); contenitore.querySelectorAll('.opz').forEach(b => b.disabled = true); risolvi(v); };
  contenitore.querySelector('.opzioni').addEventListener('click', ev => {
    const b = ev.target.closest('.opz'); if (!b || b.disabled) return; finito(+b.dataset.o);
  });
  if (secondi) {
    const barra = contenitore.querySelector('.barra-tempo > div');
    ferma = contoAllaRovescia(secondi, s => { barra.style.width = (s / secondi * 100) + '%'; }, () => finito(null));
  }
  return {
    scelta,
    ferma: () => ferma(),
    mostraCorrezione(s, conSpiegazione = true) {
      contenitore.querySelectorAll('.opz').forEach(b => {
        if (+b.dataset.o === d.corretta) b.classList.add('giusta');
        else if (+b.dataset.o === s) b.classList.add('sbagliata');
      });
      const ok = s === d.corretta;
      contenitore.querySelector('.fb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'ko'}"><strong>${ok ? 'Giusto!' : s === null ? 'Tempo scaduto.' : 'Sbagliato.'}</strong>
        ${ok ? '' : ' La risposta corretta è: ' + esc(d.opzioni[d.corretta])}
        ${conSpiegazione && d.spiegazione ? `<div class="spieg">${esc(d.spiegazione)}</div>` : ''}</div>`;
    },
    // 50:50: nasconde n opzioni sbagliate
    togli(n) {
      const sbagliate = mescola([...contenitore.querySelectorAll('.opz')].filter(b => +b.dataset.o !== d.corretta)).slice(0, n);
      sbagliate.forEach(b => { b.classList.add('tolta'); b.disabled = true; });
    }
  };
}

// Voce di ripasso per una domanda sbagliata
export const vocePerRipasso = (d, s) => ({
  testo: d.testo,
  tua: s === null || s === undefined ? 'Nessuna risposta' : 'La tua risposta: ' + d.opzioni[s],
  giusta: 'Risposta corretta: ' + d.opzioni[d.corretta],
  spieg: d.spiegazione
});

// Domande in ordine di difficoltà crescente (senza difficoltà = media), mescolate dentro ogni livello
const RANGO = { facile: 0, medio: 1, difficile: 2 };
export const perDifficolta = domande => mescola(domande).sort((a, b) => (RANGO[a.difficolta] ?? 1) - (RANGO[b.difficolta] ?? 1));
