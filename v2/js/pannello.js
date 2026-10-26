// Parti comuni alle pagine del pannello: barra di navigazione, corsi gestiti, registro delle operazioni.
import { db } from './firebase.js';
import { esci, esc, eResponsabile, corsiGestiti, NOMI_RUOLO } from './auth.js';
import { leggiTuttiCorsi } from './domande.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const VOCI = [
  { id: 'inviti', href: 'index.html', nome: 'Codici invito' },
  { id: 'domande', href: 'domande.html', nome: 'Domande' },
  { id: 'segnalazioni', href: 'segnalazioni.html', nome: 'Segnalazioni' },
  { id: 'statistiche', href: 'statistiche.html', nome: 'Statistiche' },
  { id: 'esame', href: 'esame.html', nome: 'Esame PDF' },
  { id: 'guida', href: 'guida.html', nome: 'Guida' }
];

let PROFILO = null;

// Disegna la barra in alto della pagina del pannello.
// Il contenitore è un <div class="topbar"> con id="barraPannello".
export function barraPannello(profilo, attiva, titolo) {
  PROFILO = profilo;
  const voci = [...VOCI, ...(eResponsabile(profilo) ? [{ id: 'riservata', href: 'riservata.html', nome: 'Area riservata', riservata: true }] : [])];
  const el = document.getElementById('barraPannello');
  el.innerHTML = `
    <img src="../img/emblema-cri-padova.png" alt="CRI">
    <div><div class="t1">Pannello formazione${titolo ? ' · ' + esc(titolo) : ''}</div>
      <div class="t2">${esc(profilo.nome)} ${esc(profilo.cognome)} · ${esc(NOMI_RUOLO[profilo.ruolo] || profilo.ruolo)}</div></div>
    <div class="spazio"></div>
    <nav class="menu-pannello" aria-label="Pannello">
      ${voci.map(v => `<a href="${v.href}" class="${v.id === attiva ? 'attiva' : ''}${v.riservata ? ' riservata' : ''}">${esc(v.nome)}</a>`).join('')}
      <a href="../home.html">I miei corsi</a>
      <button type="button" id="btnEsciPannello">Esci</button>
    </nav>`;
  document.getElementById('btnEsciPannello').onclick = esci;
  // un'annotazione per sessione di lavoro
  try {
    if (!sessionStorage.getItem('pannelloAperto')) { sessionStorage.setItem('pannelloAperto', '1'); registra('accesso.pannello', `Prima pagina: ${titolo || attiva}`); }
  } catch { /* archiviazione non disponibile */ }
}

// Corsi visibili nel pannello: tutti per il responsabile, i propri per l'istruttore
export async function corsiDelPannello(profilo) {
  const tutti = await leggiTuttiCorsi();
  const g = corsiGestiti(profilo);
  return g === null ? tutti : tutti.filter(c => g.includes(c.id));
}

// Avviso per l'istruttore senza corsi assegnati
export const avvisoSenzaCorsi = () => `<div class="card"><div class="msg info">Non hai ancora corsi da gestire.
  Chiedi al responsabile della formazione di assegnarteli.</div></div>`;

// Registro delle operazioni. Non blocca mai l'operazione: se la scrittura fallisce la segnala in console.
// azione: breve codice (es. 'invito.crea'); dettaglio: testo leggibile; corso e rif facoltativi.
export async function registra(azione, dettaglio = '', { corso = null, rif = null } = {}) {
  if (!PROFILO) return;
  try {
    await addDoc(collection(db, 'registro'), {
      uid: PROFILO.uid, nome: `${PROFILO.nome} ${PROFILO.cognome}`, ruolo: PROFILO.ruolo,
      azione, dettaglio: String(dettaglio).slice(0, 500), corso, rif: rif === null ? null : String(rif).slice(0, 200),
      quando: serverTimestamp()
    });
  } catch (e) { console.warn('Registro non aggiornato', azione, e); }
}

// Descrizioni leggibili delle azioni, usate nell'area riservata
export const AZIONI = {
  'accesso.pannello': 'Apre il pannello',
  'invito.crea': 'Crea un codice invito',
  'invito.attiva': 'Riattiva un codice',
  'invito.disattiva': 'Disattiva un codice',
  'domanda.crea': 'Crea una domanda',
  'domanda.modifica': 'Modifica una domanda',
  'domande.attiva': 'Rende attive delle bozze',
  'domande.importa': 'Importa domande da CSV',
  'domande.esporta': 'Esporta le domande in CSV',
  'pubblica': 'Pubblica un argomento',
  'statistiche.apri': 'Apre le statistiche',
  'scheda.apri': 'Guarda la scheda di un volontario',
  'esiti.elimina': 'Elimina risultati',
  'esiti.esporta': 'Esporta i risultati in CSV',
  'esame.stampa': 'Prepara un esame PDF',
  'segnalazione.gestisci': 'Gestisce una segnalazione',
  'utente.attiva': 'Riattiva un utente',
  'utente.disattiva': 'Disattiva un utente',
  'utente.corsi': 'Cambia i corsi di un utente',
  'utente.ruolo': 'Cambia il ruolo di un utente',
  'registro.esporta': 'Esporta il registro',
  'assistenza.gestisci': 'Risponde a un ticket'
};
