// Metti in ordine: si toccano i passi nell'ordine in cui vanno eseguiti.
import { esc, mescola, vibra } from './comune.js';
import { SEQUENZE, perCorso } from './contenuti.js';

export const ripeti = true;
const N = 4;
export const regole = `<ul>
  <li>${N} sequenze di manovre da ricostruire.</li>
  <li>Tocca i passi <strong>nell'ordine in cui li faresti</strong>: finiscono nella tua sequenza. Toccane uno nella sequenza per toglierlo.</li>
  <li>Ogni passo al posto giusto vale 10 punti, una sequenza perfetta +20.</li></ul>`;

export async function gioca({ campo, hud, categorie }) {
  const seq = mescola(perCorso(SEQUENZE, categorie)).slice(0, N);
  const risposte = [], ripasso = [];
  let punti = 0;
  hud.aggiorna({ punti, extraLab: 'Sequenza', extra: `1/${seq.length}` });
  for (let k = 0; k < seq.length; k++) {
    hud.aggiorna({ extra: `${k + 1}/${seq.length}` });
    const s = seq[k];
    const ordine = await sequenza(campo, s, k === seq.length - 1);
    const fuori = ordine.map((orig, pos) => orig === pos ? null : orig).filter(x => x !== null);
    const esatta = fuori.length === 0;
    risposte.push({ id: `g:ordina:${s.id}`, scelta: null, esatta, cat: s.argomento, ...(esatta ? {} : { det: fuori.map(x => x + 1).sort((a, b) => a - b).join(',') }) });
    punti += (s.passi.length - fuori.length) * 10 + (esatta ? 20 : 0);
    hud.aggiorna({ punti });
    if (!esatta) ripasso.push({ testo: s.titolo, tua: `${fuori.length} passi fuori posto`, giusta: s.passi.map((p, i) => `${i + 1}. ${p}`).join('\n') });
  }
  return { risposte, punti, ripasso, titolo: 'Sequenze completate' };
}

function sequenza(campo, s, ultima) {
  return new Promise(risolvi => {
    const mescolati = mescola(s.passi.map((_, i) => i));
    const messi = []; // indici originali nell'ordine scelto
    let verificata = false;
    campo.innerHTML = `<div class="card"><div class="card-title" style="margin-bottom:6px">${esc(s.titolo)}</div>
      <p style="font-size:15px;line-height:1.5;margin-bottom:14px">${esc(s.consegna)}</p>
      <div class="sequenza" id="ordMessi"></div>
      <div class="card-title" style="margin:18px 0 8px" id="ordTitLiberi">Passi da sistemare</div>
      <div class="sequenza" id="ordLiberi"></div><div class="fb"></div></div>
      <button class="btn" type="button" id="ordVerifica" disabled>Verifica</button>`;
    const btn = campo.querySelector('#ordVerifica');
    const disegna = () => {
      campo.querySelector('#ordMessi').innerHTML = messi.length ? messi.map((o, pos) => {
        const stato = !verificata ? '' : (o === pos ? 'ok' : 'ko');
        return `<button class="passo ${stato}" type="button" data-tog="${pos}" ${verificata ? 'disabled' : ''}><span class="n">${pos + 1}</span>
          <span>${esc(s.passi[o])}${stato === 'ko' ? `<span class="giusto">Va al n° ${o + 1}</span>` : ''}</span></button>`;
      }).join('') : '<div class="vuoto-seq">Tocca il primo passo qui sotto</div>';
      const liberi = mescolati.filter(o => !messi.includes(o));
      campo.querySelector('#ordLiberi').innerHTML = liberi.map(o => `<button class="passo libero" type="button" data-add="${o}"><span class="n">?</span><span>${esc(s.passi[o])}</span></button>`).join('');
      campo.querySelector('#ordTitLiberi').classList.toggle('hidden', !liberi.length);
      btn.disabled = !verificata && messi.length < s.passi.length;
    };
    campo.addEventListener('click', ev => {
      if (verificata) return;
      const a = ev.target.closest('[data-add]'), t = ev.target.closest('[data-tog]');
      if (a) messi.push(+a.dataset.add);
      else if (t) messi.splice(+t.dataset.tog, 1);
      else return;
      disegna();
    });
    btn.addEventListener('click', () => {
      if (verificata) return risolvi(messi);
      verificata = true;
      const ok = messi.every((o, pos) => o === pos);
      if (!ok) vibra(120);
      disegna();
      campo.querySelector('.fb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'ko'}"><strong>${ok ? 'Sequenza perfetta!' : 'Alcuni passi sono fuori posto.'}</strong>
        ${ok ? '' : 'Accanto ai passi in rosso trovi la posizione giusta.'}</div>`;
      btn.textContent = ultima ? 'Vedi il risultato' : 'Prossima sequenza';
      btn.disabled = false;
    });
    disegna();
  });
}
