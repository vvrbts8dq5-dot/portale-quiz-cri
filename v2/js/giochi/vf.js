// Vero o falso lampo: 60 secondi, si risponde con i bottoni, scorrendo la carta o con le frecce.
import { esc, mescola, vibra, attendi, contoAllaRovescia } from './comune.js';

export const ripeti = true;
export const regole = `<ul>
  <li>Hai <strong>60 secondi</strong>: leggi l'affermazione e scegli Vero o Falso.</li>
  <li>Puoi anche <strong>trascinare la carta</strong>: a destra = Vero, a sinistra = Falso.</li>
  <li>Ogni risposta giusta vale 10 punti; dopo 3 giuste di fila valgono il doppio, dopo 6 il triplo.</li>
  <li>Un errore azzera la serie. Alla fine trovi le spiegazioni.</li></ul>`;

export function gioca({ campo, hud, domande }) {
  return new Promise(risolvi => {
    const mazzo = mescola(domande.filter(d => d.tipo === 'vf'));
    const risposte = [], ripasso = [];
    let i = 0, punti = 0, serie = 0, bloccato = false, finito = false;
    campo.innerHTML = `
      <div class="card vf-carta" id="vfCarta"><span class="timbro f">FALSO</span><span class="timbro v">VERO</span>
        <div class="testo-domanda" id="vfTesto"></div></div>
      <div class="vf-bottoni"><button class="falso" type="button" data-r="1">✗ Falso</button><button class="vero" type="button" data-r="0">✓ Vero</button></div>
      <div class="combo" id="vfCombo"></div><div class="esito-lampo" id="vfEsito"></div>`;
    const carta = campo.querySelector('#vfCarta');
    const molt = () => serie >= 6 ? 3 : serie >= 3 ? 2 : 1;
    const mostra = () => {
      carta.className = 'card vf-carta';
      carta.style.transform = '';
      campo.querySelector('#vfTesto').textContent = mazzo[i].testo;
      campo.querySelector('#vfCombo').textContent = molt() > 1 ? `Serie di ${serie} · punti ×${molt()}` : '';
    };
    const chiudi = () => {
      if (finito) return; finito = true; ferma();
      document.removeEventListener('keydown', tasti);
      risolvi({ risposte, punti, ripasso, titolo: risposte.length ? `${risposte.filter(r => r.esatta).length} risposte giuste in 60 secondi` : 'Tempo scaduto' });
    };
    async function rispondi(scelta) {
      if (bloccato || finito) return;
      bloccato = true;
      const d = mazzo[i];
      const esatta = scelta === d.corretta;
      risposte.push({ id: d.id, scelta, esatta, cat: d.categoria });
      carta.classList.add(scelta === 0 ? 'via-dx' : 'via-sx');
      if (esatta) { serie++; punti += 10 * molt(); campo.querySelector('#vfEsito').innerHTML = '<span style="color:var(--green);font-weight:700">Giusto!</span>'; }
      else {
        serie = 0; vibra(120);
        campo.querySelector('#vfEsito').innerHTML = `<span style="color:var(--red-dark);font-weight:700">Era ${esc(d.opzioni[d.corretta])}</span>`;
        ripasso.push({ testo: d.testo, tua: 'Hai risposto: ' + d.opzioni[scelta], giusta: 'Risposta corretta: ' + d.opzioni[d.corretta], spieg: d.spiegazione });
      }
      hud.aggiorna({ punti });
      await attendi(esatta ? 260 : 700);
      i++;
      if (i >= mazzo.length) return chiudi();
      mostra(); bloccato = false;
    }
    campo.querySelector('.vf-bottoni').addEventListener('click', ev => { const b = ev.target.closest('[data-r]'); if (b) rispondi(+b.dataset.r); });
    const tasti = ev => { if (ev.key === 'ArrowRight') rispondi(0); if (ev.key === 'ArrowLeft') rispondi(1); };
    document.addEventListener('keydown', tasti);

    // trascinamento della carta
    let x0 = null;
    carta.addEventListener('pointerdown', ev => { if (bloccato) return; x0 = ev.clientX; carta.setPointerCapture(ev.pointerId); carta.style.transition = 'none'; });
    carta.addEventListener('pointermove', ev => {
      if (x0 === null) return;
      const dx = ev.clientX - x0;
      carta.style.transform = `translateX(${dx}px) rotate(${dx / 20}deg)`;
      carta.querySelector('.timbro.v').style.opacity = Math.max(0, Math.min(1, dx / 80));
      carta.querySelector('.timbro.f').style.opacity = Math.max(0, Math.min(1, -dx / 80));
    });
    const rilascia = ev => {
      if (x0 === null) return;
      const dx = ev.clientX - x0; x0 = null;
      carta.style.transition = '';
      carta.querySelectorAll('.timbro').forEach(t => t.style.opacity = 0);
      if (Math.abs(dx) > 90) rispondi(dx > 0 ? 0 : 1); else carta.style.transform = '';
    };
    carta.addEventListener('pointerup', rilascia);
    carta.addEventListener('pointercancel', rilascia);

    hud.aggiorna({ punti: 0, tempo: 60 });
    const ferma = contoAllaRovescia(60, s => hud.aggiorna({ tempo: s }), chiudi);
    mostra();
  });
}
