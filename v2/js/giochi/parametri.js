// Parametri: normale o no? Scorrono valori di parametri vitali: si decide in fretta se sono nella norma.
// I valori vengono generati dagli intervalli dei contenuti, lontani dai limiti, così non sono mai discutibili.
import { esc, vibra, contoAllaRovescia } from './comune.js';
import { PARAMETRI, perCorso } from './contenuti.js';

export const ripeti = true;
const SECONDI = 60;
export const regole = `<ul>
  <li>${SECONDI} secondi: compaiono valori di parametri vitali.</li>
  <li>Per ognuno tocca <strong>Normale</strong> o <strong>Fuori norma</strong>.</li>
  <li>10 punti per risposta giusta, +2 per ogni risposta giusta di fila (fino a +10). Un errore azzera la serie.</li></ul>`;

const caso = (a, b, dec = 0) => { const x = a + Math.random() * (b - a); return dec ? Math.round(x * 10 ** dec) / 10 ** dec : Math.round(x); };
const formato = (v, dec) => v.toLocaleString('it-IT', { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 });

function genera(p) {
  const anomali = [p.basso, p.alto].filter(Boolean);
  const normale = Math.random() < 0.5 || !anomali.length;
  const r = normale ? p.normale : anomali[Math.floor(Math.random() * anomali.length)];
  return { p, valore: caso(r[0], r[1], p.decimali), normale };
}

export async function gioca({ campo, hud, categorie }) {
  const lista = perCorso(PARAMETRI, categorie);
  const perPar = new Map(lista.map(p => [p.id, { n: 0, err: 0, esempio: null }]));
  let punti = 0, serie = 0, giuste = 0, totali = 0, finito = false, ultimo = null;
  hud.aggiorna({ punti, tempo: SECONDI, extraLab: 'Serie', extra: '0' });
  campo.innerHTML = `<div class="card" style="text-align:center">
    <div class="nota" id="parNome" style="font-size:15px;margin-bottom:6px"></div>
    <div id="parValore" style="font-size:44px;font-weight:700;margin:6px 0 16px"></div>
    <div style="display:flex;gap:10px"><button class="btn" type="button" data-r="1" style="flex:1;background:var(--green)">Normale</button>
      <button class="btn" type="button" data-r="0" style="flex:1">Fuori norma</button></div>
    <div class="fb" style="min-height:52px;margin-top:10px"></div></div>`;
  let attuale;
  const prossimo = () => {
    let x; do { x = genera(lista[Math.floor(Math.random() * lista.length)]); } while (lista.length > 1 && x.p.id === ultimo);
    ultimo = x.p.id; attuale = x;
    campo.querySelector('#parNome').textContent = x.p.nome;
    campo.querySelector('#parValore').textContent = `${formato(x.valore, x.p.decimali)} ${x.p.unita}`;
  };
  return new Promise(risolvi => {
    const chiudi = () => {
      if (finito) return; finito = true; ferma(); campo.removeEventListener('click', clic);
      const risposte = lista.filter(p => perPar.get(p.id).n).map(p => { const s = perPar.get(p.id);
        return { id: `g:parametri:${p.id}`, scelta: null, esatta: s.err === 0, cat: p.argomento, det: `${s.n - s.err}/${s.n} giuste` }; });
      const ripasso = lista.filter(p => perPar.get(p.id).err).map(p => ({ testo: p.nome, tua: `Errori: ${perPar.get(p.id).err} su ${perPar.get(p.id).n} (es. ${perPar.get(p.id).esempio})`, giusta: p.regola }));
      risolvi({ risposte, punti, ripasso, titolo: 'Tempo scaduto!', nota: `${giuste} valori giusti su ${totali}` });
    };
    const clic = ev => {
      const b = ev.target.closest('[data-r]'); if (!b || finito) return;
      const detto = b.dataset.r === '1', ok = detto === attuale.normale, s = perPar.get(attuale.p.id);
      s.n++; totali++;
      if (ok) { giuste++; serie++; punti += 10 + Math.min(10, (serie - 1) * 2); }
      else { s.err++; serie = 0; vibra(120); s.esempio = s.esempio || `${formato(attuale.valore, attuale.p.decimali)} ${attuale.p.unita}`; }
      const v = `${formato(attuale.valore, attuale.p.decimali)} ${attuale.p.unita}`;
      campo.querySelector('.fb').innerHTML = ok
        ? `<div class="feedback ok" style="text-align:left">Giusto: ${esc(v)} è ${attuale.normale ? 'nella norma' : 'fuori norma'}.</div>`
        : `<div class="feedback ko" style="text-align:left">No: ${esc(attuale.p.nome.toLowerCase())} ${esc(v)} è ${attuale.normale ? 'nella norma' : 'fuori norma'}. ${esc(attuale.p.regola)}</div>`;
      hud.aggiorna({ punti, extra: String(serie) });
      prossimo();
    };
    campo.addEventListener('click', clic);
    const ferma = contoAllaRovescia(SECONDI, t => hud.aggiorna({ tempo: t }), chiudi);
    prossimo();
  });
}
