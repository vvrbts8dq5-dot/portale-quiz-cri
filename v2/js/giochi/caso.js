// Caso clinico a bivi: a ogni tappa si sceglie cosa fare; le scelte sbagliate peggiorano il paziente.
import { esc, mescola, vibra } from './comune.js';
import { CASI, perCorso } from './contenuti.js';

export const ripeti = true;
export const regole = `<ul>
  <li>Scegli un caso: sei la squadra che interviene.</li>
  <li>A ogni tappa scegli l'azione migliore. Dopo ogni scelta vedi il perché.</li>
  <li>Le scelte sbagliate fanno peggiorare il paziente: la barra in alto mostra le sue condizioni.</li>
  <li>20 punti per ogni scelta giusta, più un bonus per le condizioni finali del paziente.</li></ul>`;

const statoPaziente = v => v >= 70 ? ['Stabile', 'var(--green)'] : v >= 40 ? ['Instabile', '#E5B000'] : ['Critico', 'var(--red)'];

export async function gioca({ campo, hud, categorie }) {
  const casi = perCorso(CASI, categorie);
  const c = await scegliCaso(campo, casi);
  const risposte = [], ripasso = [];
  let vita = 100, punti = 0;
  hud.aggiorna({ punti, extraLab: 'Tappa', extra: `1/${c.tappe.length}` });
  campo.innerHTML = `<div class="paziente"><strong style="font-size:13px">Paziente</strong><div class="vita"><div id="csVita"></div></div><span class="stato" id="csStato"></span></div>
    <div class="card"><div class="card-title" style="margin-bottom:8px">${esc(c.titolo)}</div><div id="csCorpo"></div></div>`;
  const barra = () => { const [t, col] = statoPaziente(vita); const b = campo.querySelector('#csVita'); b.style.width = vita + '%'; b.style.background = col;
    const s = campo.querySelector('#csStato'); s.textContent = t; s.style.color = col; };
  barra();
  const corpo = campo.querySelector('#csCorpo');
  await avanti(corpo, `<div class="scena">${esc(c.intro)}</div>`, 'Arrivo sul posto');
  for (let k = 0; k < c.tappe.length; k++) {
    const t = c.tappe[k];
    hud.aggiorna({ extra: `${k + 1}/${c.tappe.length}` });
    const ordine = mescola(t.scelte.map((_, i) => i));
    corpo.innerHTML = `<div class="scena">${esc(t.testo)}</div>${ordine.map(i => `<button class="scelta-caso" type="button" data-s="${i}">${esc(t.scelte[i].t)}</button>`).join('')}<div class="fb"></div>`;
    const s = await new Promise(r => corpo.addEventListener('click', function clic(ev) {
      const b = ev.target.closest('[data-s]'); if (!b) return; corpo.removeEventListener('click', clic); r(+b.dataset.s);
    }));
    const giusta = t.scelte.findIndex(x => x.ok);
    const esatta = s === giusta;
    corpo.querySelectorAll('.scelta-caso').forEach(b => { b.disabled = true; const i = +b.dataset.s;
      if (i === giusta) b.classList.add('giusta'); else if (i === s) b.classList.add('sbagliata'); else b.style.opacity = .5; });
    risposte.push({ id: `g:caso:${c.id}:${t.id}`, scelta: s, esatta, cat: c.argomento });
    if (esatta) { punti += 20; vita = Math.min(100, vita + 5); }
    else { vita = Math.max(5, vita - 25); vibra(150); ripasso.push({ testo: t.testo, tua: 'Hai scelto: ' + t.scelte[s].t, giusta: 'Meglio: ' + t.scelte[giusta].t, spieg: t.scelte[s].fb }); }
    barra(); hud.aggiorna({ punti });
    corpo.querySelector('.fb').innerHTML = `<div class="feedback ${esatta ? 'ok' : 'ko'}">${esc(t.scelte[s].fb)}${esatta ? '' : `<div class="spieg">${esc(t.scelte[giusta].fb)}</div>`}</div>`;
    await bottone(corpo, k < c.tappe.length - 1 ? 'Continua' : 'Com\'è andata?');
  }
  punti += Math.round(vita / 2);
  hud.aggiorna({ punti });
  const [stato] = statoPaziente(vita);
  const titolo = vita >= 70 ? 'Paziente consegnato in condizioni stabili' : vita >= 40 ? 'Il paziente è arrivato, ma instabile' : 'Il paziente è peggiorato molto';
  return { risposte, punti, ripasso, titolo, nota: `${c.titolo} · condizioni finali: ${stato.toLowerCase()}` };
}

function scegliCaso(campo, casi) {
  return new Promise(r => {
    campo.innerHTML = `<p class="nota" style="margin:0 2px 12px">Scegli il caso da affrontare.</p>` + casi.map((c, i) => `
      <button class="voce" type="button" data-c="${i}"><span><span class="tit" style="display:block">${esc(c.titolo)}</span>
      <span class="sub">${c.tappe.length} decisioni</span></span><span class="freccia">›</span></button>`).join('');
    campo.addEventListener('click', function clic(ev) { const b = ev.target.closest('[data-c]'); if (!b) return; campo.removeEventListener('click', clic); r(casi[+b.dataset.c]); });
  });
}
const bottone = (el, testo) => new Promise(r => {
  const b = document.createElement('button'); b.className = 'btn'; b.type = 'button'; b.textContent = testo; b.style.marginTop = '12px';
  b.onclick = () => r(); el.appendChild(b);
});
const avanti = (el, html, testo) => { el.innerHTML = html; return bottone(el, testo); };
