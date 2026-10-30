// Trova il punto: si tocca sulla figura il punto richiesto (polsi, organi, punti delle manovre).
import { esc, mescola, vibra } from './comune.js';
import { PUNTI_ANATOMIA, perCorso } from './contenuti.js';

export const ripeti = true;
const N = 8, TOLLERANZA = 20;
export const regole = `<ul>
  <li>${N} punti da trovare sulla figura: tocca dove si trova quello richiesto.</li>
  <li>Il paziente è <strong>girato verso di te</strong>: la sua destra è alla tua sinistra.</li>
  <li>10 punti per ogni centro, più un bonus per la precisione.</li></ul>`;

// Figura frontale (viewBox 240×500). Le coordinate dei punti sono in contenuti.js
const FIGURA = `
  <g class="corpo">
    <path d="M66 116 L54 190 L40 262" stroke="#C9A797" stroke-width="27" stroke-linecap="round" fill="none"/>
    <path d="M174 116 L186 190 L200 262" stroke="#C9A797" stroke-width="27" stroke-linecap="round" fill="none"/>
    <path d="M102 292 L98 390 L96 468" stroke="#C9A797" stroke-width="35" stroke-linecap="round" fill="none"/>
    <path d="M138 292 L142 390 L144 468" stroke="#C9A797" stroke-width="35" stroke-linecap="round" fill="none"/>
  </g>
  <g>
    <path d="M66 116 L54 190 L40 262" stroke="#F2DDD3" stroke-width="24" stroke-linecap="round" fill="none"/>
    <path d="M174 116 L186 190 L200 262" stroke="#F2DDD3" stroke-width="24" stroke-linecap="round" fill="none"/>
    <path d="M102 292 L98 390 L96 468" stroke="#F2DDD3" stroke-width="32" stroke-linecap="round" fill="none"/>
    <path d="M138 292 L142 390 L144 468" stroke="#F2DDD3" stroke-width="32" stroke-linecap="round" fill="none"/>
  </g>
  <ellipse class="corpo" cx="36" cy="284" rx="11" ry="14"/>
  <ellipse class="corpo" cx="204" cy="284" rx="11" ry="14"/>
  <ellipse class="corpo" cx="93" cy="485" rx="16" ry="9"/>
  <ellipse class="corpo" cx="147" cy="485" rx="16" ry="9"/>
  <path class="corpo" d="M106 70 L134 70 L136 102 L104 102 Z"/>
  <path class="corpo" d="M66 118 Q66 100 104 98 L136 98 Q174 100 174 118 L170 196 Q166 232 172 262 Q172 288 160 300 L80 300 Q68 288 68 262 Q74 232 70 196 Z"/>
  <ellipse class="corpo" cx="120" cy="44" rx="24" ry="30"/>
  <g class="linee">
    <path d="M78 110 Q100 116 116 108 M124 108 Q140 116 162 110"/>
    <path d="M120 108 L120 176"/>
    <path d="M88 180 Q120 200 152 180"/>
    <circle cx="120" cy="232" r="2.5"/>
    <path d="M96 276 Q120 292 144 276"/>
    <path d="M120 296 L120 302"/>
  </g>`;

export async function gioca({ campo, hud, categorie }) {
  const punti_ = mescola(perCorso(PUNTI_ANATOMIA, categorie)).slice(0, N);
  const risposte = [], ripasso = [];
  let punti = 0;
  campo.innerHTML = `<div class="card" style="padding:16px">
      <div class="bersaglio" id="anBers"></div>
      <div class="figura-wrap"><svg class="figura" id="anFig" viewBox="0 0 240 500" role="img" aria-label="Figura umana vista di fronte">${FIGURA}<g id="anSegni"></g></svg></div>
      <p class="didascalia">Il paziente è girato verso di te</p>
      <div class="fb"></div></div>
    <button class="btn hidden" type="button" id="anAvanti">Avanti</button>`;
  const svg = campo.querySelector('#anFig'), segni = campo.querySelector('#anSegni'), btn = campo.querySelector('#anAvanti');
  hud.aggiorna({ punti, extraLab: 'Punto', extra: `1/${punti_.length}` });
  for (let k = 0; k < punti_.length; k++) {
    const p = punti_[k];
    hud.aggiorna({ extra: `${k + 1}/${punti_.length}` });
    campo.querySelector('#anBers').textContent = `Tocca: ${p.nome}`;
    campo.querySelector('.fb').innerHTML = '';
    segni.innerHTML = ''; btn.classList.add('hidden');
    const [x, y] = await new Promise(r => svg.addEventListener('pointerdown', function tocco(ev) {
      ev.preventDefault();
      const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
      const q = pt.matrixTransform(svg.getScreenCTM().inverse());
      svg.removeEventListener('pointerdown', tocco); r([q.x, q.y]);
    }));
    const dist = Math.min(...p.punti.map(([px, py]) => Math.hypot(px - x, py - y)));
    const esatta = dist <= TOLLERANZA;
    segni.innerHTML = p.punti.map(([px, py]) => `<circle cx="${px}" cy="${py}" r="${TOLLERANZA}" fill="rgba(23,102,77,.18)" stroke="#17664D" stroke-width="2"/>
        <circle cx="${px}" cy="${py}" r="3.5" fill="#17664D"/>`).join('')
      + `<circle cx="${x}" cy="${y}" r="6" fill="${esatta ? '#17664D' : '#C8102E'}" stroke="#fff" stroke-width="2"/>`;
    risposte.push({ id: `g:anatomia:${p.id}`, scelta: null, esatta, cat: p.argomento, det: Math.round(dist) });
    if (esatta) punti += 10 + Math.max(0, Math.round(10 - dist / 2));
    else { vibra(120); ripasso.push({ testo: p.nome, tua: 'Hai toccato un punto troppo lontano', giusta: p.nota }); }
    hud.aggiorna({ punti });
    campo.querySelector('.fb').innerHTML = `<div class="feedback ${esatta ? 'ok' : 'ko'}"><strong>${esatta ? 'Preso!' : 'Non qui.'}</strong> ${esc(p.nota)}</div>`;
    btn.textContent = k < punti_.length - 1 ? 'Prossimo punto' : 'Vedi il risultato';
    btn.classList.remove('hidden');
    await new Promise(r => { btn.onclick = r; });
  }
  return { risposte, punti, ripasso, titolo: 'Figura completata' };
}
