// Completa la frase: si riempiono gli spazi scegliendo tra parole giuste e distrattori.
import { esc, mescola, vibra } from './comune.js';
import { FRASI, perCorso } from './contenuti.js';

export const ripeti = true;
const N = 6;
export const regole = `<ul>
  <li>${N} frasi con delle parole mancanti.</li>
  <li>Tocca una parola in basso per inserirla nello spazio evidenziato; tocca uno spazio pieno per svuotarlo.</li>
  <li>Quando hai riempito tutto premi <strong>Verifica</strong>. Ogni spazio giusto vale 10 punti, una frase perfetta +10.</li></ul>`;

export async function gioca({ campo, hud, categorie }) {
  const frasi = mescola(perCorso(FRASI, categorie)).slice(0, N);
  const risposte = [], ripasso = [];
  let punti = 0;
  hud.aggiorna({ punti, extraLab: 'Frase', extra: `1/${frasi.length}` });
  for (let k = 0; k < frasi.length; k++) {
    hud.aggiorna({ extra: `${k + 1}/${frasi.length}` });
    const r = await frase(campo, frasi[k], k === frasi.length - 1);
    r.forEach((x, j) => risposte.push({ id: `g:completa:${frasi[k].id}:${j}`, scelta: null, esatta: x.ok, cat: frasi[k].argomento, ...(x.ok ? {} : { det: x.messa }) }));
    const giusti = r.filter(x => x.ok).length;
    punti += giusti * 10 + (giusti === r.length ? 10 : 0);
    hud.aggiorna({ punti });
    if (giusti < r.length) {
      ripasso.push({ testo: frasi[k].testo.replace(/\[\[(.+?)\]\]/g, '___'),
        tua: 'Hai scritto: ' + r.map(x => x.messa).join(' · '), giusta: 'Corretto: ' + r.map(x => x.giusta).join(' · ') });
    }
  }
  return { risposte, punti, ripasso, titolo: 'Frasi completate' };
}

function frase(campo, f, ultima) {
  return new Promise(risolvi => {
    const parti = f.testo.split(/\[\[(.+?)\]\]/); // pari = testo, dispari = parola da indovinare
    const giuste = parti.filter((_, i) => i % 2 === 1);
    const chips = mescola([...giuste, ...f.distrattori.filter(x => !giuste.includes(x))]);
    const messe = giuste.map(() => null); // indice della chip in ogni spazio
    let attivo = 0, verificata = false;
    campo.innerHTML = `<div class="card"><div class="frase">${parti.map((p, i) => i % 2 ? `<span class="buco" data-b="${(i - 1) / 2}" role="button" tabindex="0"></span>` : esc(p)).join('')}</div>
      <div class="chips">${chips.map((c, i) => `<button class="chip" type="button" data-c="${i}">${esc(c)}</button>`).join('')}</div>
      <div class="fb"></div></div>
      <button class="btn" type="button" id="cmpVerifica" disabled style="margin-top:4px">Verifica</button>`;
    const btn = campo.querySelector('#cmpVerifica');
    const aggiorna = () => {
      campo.querySelectorAll('.buco').forEach(b => {
        const j = +b.dataset.b;
        b.textContent = messe[j] === null ? ' ' : chips[messe[j]];
        b.classList.toggle('pieno', messe[j] !== null);
        b.classList.toggle('attivo', !verificata && j === attivo);
      });
      campo.querySelectorAll('.chip').forEach(c => c.disabled = verificata || messe.includes(+c.dataset.c));
      btn.disabled = !verificata && messe.includes(null);
    };
    campo.addEventListener('click', ev => {
      if (verificata) return;
      const c = ev.target.closest('.chip'), b = ev.target.closest('.buco');
      if (c && !c.disabled) {
        if (attivo === -1) return;
        messe[attivo] = +c.dataset.c;
        const prossimo = messe.findIndex((m, j) => m === null && j > attivo);
        attivo = prossimo >= 0 ? prossimo : messe.indexOf(null);
      } else if (b) {
        const j = +b.dataset.b;
        messe[j] = null; attivo = j;
      } else return;
      aggiorna();
    });
    btn.addEventListener('click', () => {
      if (!verificata) {
        verificata = true;
        const esiti = giuste.map((g, j) => ({ giusta: g, messa: chips[messe[j]], ok: chips[messe[j]] === g }));
        campo.querySelectorAll('.buco').forEach(b => {
          const e = esiti[+b.dataset.b];
          b.classList.remove('attivo', 'pieno');
          b.classList.add(e.ok ? 'ok' : 'ko');
          if (!e.ok) b.innerHTML = `${esc(e.messa)}<span class="corr">${esc(e.giusta)}</span>`;
        });
        campo.querySelectorAll('.chip').forEach(c => c.disabled = true);
        const tutte = esiti.every(e => e.ok);
        if (!tutte) vibra(120);
        campo.querySelector('.fb').innerHTML = `<div class="feedback ${tutte ? 'ok' : 'ko'}"><strong>${tutte ? 'Perfetto!' : 'Quasi.'}</strong> ${tutte ? '' : 'Sotto le parole sbagliate trovi quelle corrette.'}</div>`;
        btn.textContent = ultima ? 'Vedi il risultato' : 'Prossima frase';
        btn.disabled = false;
        btn._esiti = esiti;
      } else risolvi(btn._esiti);
    });
    aggiorna();
  });
}
