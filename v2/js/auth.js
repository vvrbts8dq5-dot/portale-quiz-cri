// Controllo di accesso e funzioni comuni alle pagine del portale v2.
import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Cartella principale del portale v2 (funziona sia da /v2/ sia da /v2/admin/)
export const RADICE = new URL('../', import.meta.url);
export const urlPagina = nome => new URL(nome, RADICE).href;

// Primo stato di autenticazione noto (Firebase lo ricostruisce da solo al caricamento)
export function utenteCorrente() {
  return new Promise(resolve => {
    const stop = onAuthStateChanged(auth, u => { stop(); resolve(u); });
  });
}

export async function leggiProfilo(uid) {
  const snap = await getDoc(doc(db, 'utenti', uid));
  return snap.exists() ? { uid, ...snap.data() } : null;
}

// Da chiamare all'apertura di ogni pagina protetta.
// Rimanda al login chi non è autenticato o ha il profilo disattivato.
// staff:true  → pannello (istruttori e responsabile); admin:true → solo responsabile (livello 2).
export async function richiediUtente({ admin = false, staff = false } = {}) {
  const user = await utenteCorrente();
  if (!user) { location.replace(urlPagina('index.html')); return new Promise(() => {}); }
  const profilo = await leggiProfilo(user.uid);
  if (!profilo || profilo.attivo !== true) {
    await signOut(auth);
    location.replace(urlPagina('index.html?msg=' + (profilo ? 'disattivato' : 'profilo')));
    return new Promise(() => {});
  }
  if ((admin && !eResponsabile(profilo)) || (staff && !eStaff(profilo))) {
    location.replace(urlPagina(eStaff(profilo) ? 'admin/index.html' : 'home.html'));
    return new Promise(() => {});
  }
  return { user, profilo };
}

// Livelli: volontario → istruttore (livello 1, solo i suoi corsi) → admin (livello 2, responsabile)
export const eResponsabile = p => p?.ruolo === 'admin';
export const eStaff = p => p?.ruolo === 'admin' || p?.ruolo === 'istruttore';
export const NOMI_RUOLO = { volontario: 'Volontario', istruttore: 'Istruttore', admin: 'Responsabile' };
// Corsi che una persona può gestire nel pannello (null = tutti)
export const corsiGestiti = p => eResponsabile(p) ? null : (p?.ruolo === 'istruttore' ? (p.corsiGestiti || []) : []);
export const gestisce = (p, corso) => { const g = corsiGestiti(p); return g === null || g.includes(corso); };

export async function esci() {
  sessionStorage.clear();
  await signOut(auth);
  location.replace(urlPagina('index.html'));
}

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Messaggi in italiano per gli errori più comuni di Firebase
export function messaggioErrore(e) {
  const m = {
    'auth/email-already-in-use': 'Esiste già un account con questa email. Usa "Accedi" oppure "Password dimenticata".',
    'auth/invalid-email': 'L\'indirizzo email non è valido.',
    'auth/weak-password': 'La password deve avere almeno 6 caratteri.',
    'auth/invalid-credential': 'Email o password non corrette.',
    'auth/wrong-password': 'Email o password non corrette.',
    'auth/user-not-found': 'Email o password non corrette.',
    'auth/user-disabled': 'Questo account è stato disattivato.',
    'auth/too-many-requests': 'Troppi tentativi. Attendi qualche minuto e riprova.',
    'auth/network-request-failed': 'Connessione assente. Controlla la rete e riprova.',
    'auth/missing-email': 'Inserisci la tua email.',
    'permission-denied': 'Operazione non consentita.',
    'unavailable': 'Servizio non raggiungibile. Controlla la connessione e riprova.'
  };
  return m[e?.code] || ('Errore imprevisto: ' + (e?.message || e));
}
