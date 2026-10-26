// Menu che si apre toccando l'avatar: profilo, valutazione dell'app, ticket di assistenza, privacy, esci.
import { db } from './firebase.js';
import { esc, esci, messaggioErrore, eStaff, urlPagina } from './auth.js';
import { ICONA, iniziali } from './icone.js';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const IC = {
  stella: svg('<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/>'),
  aiuto: svg('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7M12 17h.01"/>'),
  ticket: svg('<path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z"/><path d="M14 7v10" stroke-dasharray="2 2"/>'),
  libro: svg('<path d="M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z"/>'),
  scudo: svg('<path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"/>')
};
export const CATEGORIE_TICKET = {
  accesso: 'Accesso o account', quiz: 'Quiz o domande', errore: 'L\'app non funziona o dà errore', corsi: 'Corsi che non vedo', altro: 'Altro'
};
export const STATI_TICKET = { aperto: 'Aperto', lavorazione: 'In lavorazione', risolto: 'Risolto' };

const STILE = `
.menu-utente .voce-menu { display: flex; align-items: center; gap: 12px; width: 100%; padding: 13px 12px; border: none; background: none;
  border-radius: 14px; font: 600 16px 'Figtree', sans-serif; color: var(--text); text-align: left; text-decoration: none; cursor: pointer; }
.menu-utente .voce-menu:hover { background: var(--campo); }
.menu-utente .voce-menu svg { width: 22px; height: 22px; color: var(--red); flex-shrink: 0; }
.menu-utente .chi { display: flex; align-items: center; gap: 12px; padding: 4px 4px 14px; border-bottom: 1px solid var(--linea); margin-bottom: 8px; }
.menu-utente .chi .nome { font-weight: 800; font-size: 17px; }
.menu-utente .chi .mail { font-size: 13px; color: var(--text2); word-break: break-all; }
.stelle { display: flex; gap: 6px; justify-content: center; margin: 6px 0 16px; }
.stelle button { border: none; background: none; padding: 4px; cursor: pointer; color: var(--linea); }
.stelle button svg { width: 40px; height: 40px; }
.stelle button.on { color: #F2B544; }
.stelle button.on svg { fill: #F2B544; }
.menu-utente textarea, .modale textarea { width: 100%; min-height: 110px; padding: 12px 14px; border: 2px solid transparent; border-radius: 14px;
  background: var(--campo); font: 500 15px 'Figtree', sans-serif; color: var(--text); resize: vertical; outline: none; }
.modale textarea:focus { border-color: var(--red); background: #fff; }
.mio-ticket { background: var(--campo); border-radius: 14px; padding: 12px 14px; margin-bottom: 10px; font-size: 14px; line-height: 1.45; }
.mio-ticket .testa { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; color: var(--text2); margin-bottom: 4px; }
.mio-ticket .risposta { margin-top: 8px; background: #fff; border-radius: 10px; padding: 8px 10px; }
`;

let P = null;
const $ = id => document.getElementById(id);
const chiudiTutto = () => document.querySelectorAll('.overlay.mu').forEach(o => o.remove());

function finestra(html, classe = '') {
  chiudiTutto();
  const o = document.createElement('div');
  o.className = 'overlay mu';
  o.innerHTML = `<div class="modale ${classe}" role="dialog" aria-modal="true">${html}</div>`;
  o.addEventListener('click', ev => { if (ev.target === o || ev.target.closest('[data-chiudi]')) o.remove(); });
  document.body.appendChild(o);
  return o;
}

function apriMenu() {
  const o = finestra(`
    <div class="chi"><span class="avatar">${esc(iniziali(P))}</span>
      <div><div class="nome">${esc(P.nome)} ${esc(P.cognome)}</div><div class="mail">${esc(P.email)}</div></div></div>
    <a class="voce-menu" href="${urlPagina('profilo.html')}">${ICONA.utente}Il mio profilo</a>
    ${eStaff(P) ? `<a class="voce-menu" href="${urlPagina('admin/index.html')}">${ICONA.ingranaggio}Pannello formazione</a>` : ''}
    <button class="voce-menu" type="button" data-azione="feedback">${IC.stella}Valuta l'app</button>
    <button class="voce-menu" type="button" data-azione="ticket">${IC.ticket}Segnala un problema</button>
    <button class="voce-menu" type="button" data-azione="miei">${IC.aiuto}Le mie richieste</button>
    <a class="voce-menu" href="${urlPagina('guida.html')}">${IC.libro}Come si usa</a>
    ${eStaff(P) ? `<a class="voce-menu" href="${urlPagina('admin/guida.html')}">${IC.libro}Guida per gli istruttori</a>` : ''}
    <a class="voce-menu" href="${urlPagina('privacy.html')}">${IC.scudo}Informativa privacy</a>
    <button class="voce-menu" type="button" data-azione="esci">${ICONA.esci}Esci</button>
    <button class="btn sec" type="button" data-chiudi style="margin-top:10px">Chiudi</button>`, 'menu-utente');
  o.addEventListener('click', ev => {
    const a = ev.target.closest('[data-azione]')?.dataset.azione;
    if (a === 'feedback') apriFeedback();
    else if (a === 'ticket') apriTicket();
    else if (a === 'miei') apriMiei();
    else if (a === 'esci') esci();
  });
}

const base = () => ({
  uid: P.uid, nome: P.nome, cognome: P.cognome, email: P.email,
  pagina: location.pathname.split('/').slice(-2).join('/'),
  dispositivo: `${navigator.userAgent.slice(0, 180)} · ${innerWidth}×${innerHeight}`,
  stato: 'aperto', creatoIl: serverTimestamp()
});

function apriFeedback() {
  let voto = 0;
  const o = finestra(`
    <h3>Ti piace il portale?</h3>
    <p class="nota">Dai un voto da 1 a 5 stelle e, se vuoi, scrivi cosa miglioreresti.</p>
    <div class="stelle" id="muStelle">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-voto="${n}" aria-label="${n} stell${n === 1 ? 'a' : 'e'}">${IC.stella}</button>`).join('')}</div>
    <div class="campo"><label for="muCommento">Commento (facoltativo)</label><textarea id="muCommento" maxlength="2000" placeholder="Cosa ti è piaciuto? Cosa manca?"></textarea></div>
    <div class="azioni"><button class="btn piccolo" id="muInvia" type="button">Invia</button><button class="btn sec piccolo" type="button" data-chiudi>Annulla</button></div>
    <div id="muMsg"></div>`);
  $('muStelle').addEventListener('click', ev => {
    const b = ev.target.closest('[data-voto]'); if (!b) return;
    voto = +b.dataset.voto;
    $('muStelle').querySelectorAll('button').forEach(x => x.classList.toggle('on', +x.dataset.voto <= voto));
  });
  $('muInvia').addEventListener('click', async () => {
    if (!voto) return $('muMsg').innerHTML = '<div class="msg err">Scegli da 1 a 5 stelle.</div>';
    $('muInvia').disabled = true;
    try {
      await addDoc(collection(db, 'assistenza'), { ...base(), tipo: 'feedback', stelle: voto, categoria: '', testo: $('muCommento').value.trim() });
      o.querySelector('.modale').innerHTML = `<h3>Grazie!</h3><p class="nota">Il tuo parere ci aiuta a migliorare il portale.</p>
        <button class="btn" type="button" data-chiudi style="margin-top:16px">Chiudi</button>`;
    } catch (e) { $('muMsg').innerHTML = `<div class="msg err">${esc(messaggioErrore(e))}</div>`; $('muInvia').disabled = false; }
  });
}

function apriTicket() {
  const o = finestra(`
    <h3>Segnala un problema</h3>
    <p class="nota" style="margin-bottom:12px">Descrivi cosa è successo: risponderemo qui, in "Le mie richieste".
      Per un errore in una domanda usa il pulsante "Segnala un errore" nel quiz.</p>
    <div class="campo"><label for="muCat">Di cosa si tratta?</label>
      <select id="muCat">${Object.entries(CATEGORIE_TICKET).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('')}</select></div>
    <div class="campo"><label for="muTesto">Descrizione</label><textarea id="muTesto" maxlength="2000" placeholder="Cosa stavi facendo, cosa ti aspettavi, cosa è successo"></textarea></div>
    <div class="azioni"><button class="btn piccolo" id="muInvia" type="button">Invia</button><button class="btn sec piccolo" type="button" data-chiudi>Annulla</button></div>
    <div id="muMsg"></div>`);
  $('muInvia').addEventListener('click', async () => {
    const testo = $('muTesto').value.trim();
    if (testo.length < 5) return $('muMsg').innerHTML = '<div class="msg err">Scrivi una breve descrizione del problema.</div>';
    $('muInvia').disabled = true;
    try {
      await addDoc(collection(db, 'assistenza'), { ...base(), tipo: 'ticket', stelle: 0, categoria: $('muCat').value, testo });
      o.querySelector('.modale').innerHTML = `<h3>Richiesta inviata</h3><p class="nota">La trovi in "Le mie richieste", dove vedrai anche la risposta.</p>
        <button class="btn" type="button" data-chiudi style="margin-top:16px">Chiudi</button>`;
    } catch (e) { $('muMsg').innerHTML = `<div class="msg err">${esc(messaggioErrore(e))}</div>`; $('muInvia').disabled = false; }
  });
}

async function apriMiei() {
  finestra(`<h3>Le mie richieste</h3><div id="muElenco"><p class="nota">Caricamento…</p></div>
    <button class="btn sec" type="button" data-chiudi style="margin-top:12px">Chiudi</button>`);
  try {
    const snap = await getDocs(query(collection(db, 'assistenza'), where('uid', '==', P.uid)));
    const L = snap.docs.map(d => d.data()).filter(t => t.tipo === 'ticket')
      .sort((a, b) => (b.creatoIl?.toMillis?.() || 0) - (a.creatoIl?.toMillis?.() || 0));
    const data = ts => ts ? ts.toDate().toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
    const badge = s => `<span class="badge ${s === 'risolto' ? 'si' : s === 'lavorazione' ? 'istr' : 'neutro'}">${STATI_TICKET[s] || s}</span>`;
    $('muElenco').innerHTML = L.length ? L.map(t => `<div class="mio-ticket">
      <div class="testa"><span>${data(t.creatoIl)} · ${esc(CATEGORIE_TICKET[t.categoria] || t.categoria)}</span>${badge(t.stato)}</div>
      <div>${esc(t.testo)}</div>
      ${t.risposta ? `<div class="risposta"><strong>Risposta:</strong> ${esc(t.risposta)}</div>` : ''}</div>`).join('')
      : '<p class="nota">Non hai ancora inviato richieste di assistenza.</p>';
  } catch (e) { $('muElenco').innerHTML = `<div class="msg err">${esc(messaggioErrore(e))}</div>`; }
}

// Collega il menu a un elemento (di solito l'avatar in alto a destra)
export function menuUtente(profilo, el) {
  P = profilo;
  if (!document.getElementById('stileMenuUtente')) {
    const s = document.createElement('style'); s.id = 'stileMenuUtente'; s.textContent = STILE; document.head.appendChild(s);
  }
  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', 'Menu: profilo, valutazione, assistenza');
  el.addEventListener('click', ev => { ev.preventDefault(); apriMenu(); });
}
