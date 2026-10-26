// Logica del quiz senza dipendenze da Firebase: selezione domande, ordine, punteggio.

export const SOGLIA_SUPERAMENTO = 70; // percentuale minima per "superato"
export const SECONDI_PER_DOMANDA = 60;

const RANGO = { facile: 0, medio: 1, difficile: 2 };
const rango = d => RANGO[d.difficolta] ?? 1; // senza difficoltà = media

export function mescola(arr, rnd = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Prende n elementi alternando i gruppi, così ogni gruppo è rappresentato
// in proporzione alla sua dimensione (usato dal quiz generale di un corso).
function pescaBilanciata(gruppi, n, rnd) {
  const code = gruppi.map(g => mescola(g, rnd)).filter(g => g.length);
  const tot = code.reduce((s, g) => s + g.length, 0);
  const presi = [];
  // quota proporzionale, arrotondata per difetto
  const quote = code.map(g => Math.floor(n * g.length / tot));
  code.forEach((g, i) => presi.push(...g.splice(0, quote[i])));
  // il resto a giro, partendo dai gruppi più grandi
  const ordine = code.map((g, i) => i).sort((a, b) => code[b].length - code[a].length);
  while (presi.length < Math.min(n, tot)) {
    for (const i of ordine) {
      if (presi.length >= n) break;
      if (code[i].length) presi.push(code[i].shift());
    }
  }
  return presi;
}

// Sceglie n domande. `gruppi` = una lista di domande per categoria.
// - più categorie (quiz generale): pesca bilanciata tra le categorie
// - una categoria in cui almeno l'80% ha la difficoltà: 35% facili, 50% medie, 15% difficili
// - altrimenti: a caso
// In tutti i casi le domande escono in ordine di difficoltà crescente.
export function selezionaDomande(gruppi, n, rnd = Math.random) {
  const pool = gruppi.flat();
  let scelte;
  if (gruppi.filter(g => g.length).length > 1) {
    scelte = pescaBilanciata(gruppi, n, rnd);
  } else if (pool.filter(d => d.difficolta).length >= pool.length * 0.8) {
    const per = liv => mescola(pool.filter(d => d.difficolta === liv), rnd);
    const nF = Math.round(n * 0.35), nD = Math.round(n * 0.15), nM = n - nF - nD;
    scelte = [...per('facile').slice(0, nF), ...per('medio').slice(0, nM), ...per('difficile').slice(0, nD)];
    if (scelte.length < n) {
      const usate = new Set(scelte);
      scelte.push(...mescola(pool.filter(d => !usate.has(d)), rnd).slice(0, n - scelte.length));
    }
  } else {
    scelte = mescola(pool, rnd).slice(0, n);
  }
  scelte = mescola(scelte, rnd); // mescola dentro ogni livello…
  return scelte.sort((a, b) => rango(a) - rango(b)); // …poi ordina per difficoltà (sort stabile)
}

// Prepara una domanda per la visualizzazione: le multiple hanno le opzioni mescolate,
// le Vero/Falso restano nell'ordine Vero, Falso. `indici` mappa la posizione mostrata
// all'indice originale.
export function preparaDomanda(d, rnd = Math.random) {
  const indici = d.opzioni.map((_, i) => i);
  return { ...d, indici: d.tipo === 'vf' ? indici : mescola(indici, rnd) };
}

export function calcolaEsito(risposte, totale) {
  const corrette = risposte.filter(r => r.esatta).length;
  const percentuale = totale ? Math.round(corrette / totale * 100) : 0;
  return { corrette, errate: totale - corrette, totale, percentuale, superato: percentuale >= SOGLIA_SUPERAMENTO };
}

export function formattaTempo(sec) {
  const s = Math.max(0, sec);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}
