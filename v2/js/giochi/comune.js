// Parti comuni dei giochi: salvataggio della partita, record personali, piccoli aiuti.
//
// Ogni partita diventa un documento in `esiti` con modalita 'gioco', così le statistiche
// degli istruttori vedono anche gli errori fatti giocando. Formato delle risposte:
//   { id, scelta, esatta, cat, det? }
//   id    id della domanda (giochi con le domande) oppure "g:<gioco>:<elemento>[:<parte>]"
//   cat   argomento a cui contare la risposta
//   det   dettaglio facoltativo (es. passaggi fuori posto, frequenza RCP)
import { db } from '../firebase.js';
import { leggiProgressi, salvaProgressi } from '../progressi.js';
import { prendi, metti } from '../cache.js';
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export const MAX_RISPOSTE = 60; // limite delle regole di sicurezza

export { mescola } from '../quiz-engine.js';
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const vibra = ms => { try { navigator.vibrate?.(ms); } catch { /* niente */ } };
export const attendi = ms => new Promise(r => setTimeout(r, ms));

// Record personale (solo su questo dispositivo)
export const record = (gioco, corso) => prendi(`rec.${corso}.${gioco}`) || 0;
export function aggiornaRecord(gioco, corso, punti) {
  const prima = record(gioco, corso);
  if (punti > prima) metti(`rec.${corso}.${gioco}`, punti);
  return { prima, nuovo: punti > prima && punti > 0 };
}

// Conto alla rovescia basato sull'ora di fine (resta giusto anche se il telefono mette in pausa la pagina)
export function contoAllaRovescia(secondi, suTick, suFine) {
  const fine = Date.now() + secondi * 1000;
  let fermo = false;
  const giro = () => {
    if (fermo) return;
    const rimasti = Math.max(0, Math.ceil((fine - Date.now()) / 1000));
    suTick(rimasti);
    if (rimasti <= 0) { fermo = true; suFine(); }
  };
  const t = setInterval(giro, 250); giro();
  return () => { fermo = true; clearInterval(t); };
}

// Salva la partita. Ritorna l'esito salvato (o lancia l'errore).
export async function salvaPartita({ user, profilo, corso, gioco, nomeGioco, risposte, punti, durataSec, argomenti }) {
  const lista = risposte.slice(0, MAX_RISPOSTE).map(r => {
    const x = { id: String(r.id), scelta: r.scelta ?? null, esatta: !!r.esatta, cat: r.cat || null };
    if (r.det !== undefined && r.det !== null && r.det !== '') x.det = String(r.det).slice(0, 120);
    return x;
  });
  if (!lista.length) return null;
  const corrette = lista.filter(r => r.esatta).length;
  const percentuale = Math.round(corrette / lista.length * 100);
  const cats = [...new Set(lista.map(r => r.cat).filter(Boolean))];
  const categoria = cats.length === 1 ? cats[0] : 'giochi';
  const nomeCat = cats.length === 1 ? (argomenti?.get?.(cats[0]) || '') : '';
  const esito = {
    uid: user.uid, nome: profilo.nome, cognome: profilo.cognome,
    corso, categoria, categoriaNome: `Gioco · ${nomeGioco}${nomeCat ? ' · ' + nomeCat : ''}`,
    numeroDomande: lista.length, corrette, percentuale, superato: percentuale >= 70,
    durataSec: Math.max(0, Math.round(durataSec || 0)), tempoScaduto: false,
    risposte: lista, modalita: 'gioco', gioco, punti: Math.max(0, Math.round(punti || 0)),
    ...(profilo.codiceInvito ? { edizione: profilo.codiceInvito } : {}),
    timestamp: serverTimestamp()
  };
  await addDoc(collection(db, 'esiti'), esito);
  // Ripasso personale: le domande dei quiz sbagliate giocando entrano nel ripasso, quelle giuste ne escono
  const domande = lista.filter(r => !r.id.startsWith('g:'));
  if (domande.length) {
    try {
      const p = await leggiProgressi(user.uid);
      if (!p.ricostruito) {
        const errori = new Set(p.errori[corso] || []);
        for (const r of domande) r.esatta ? errori.delete(r.id) : errori.add(r.id);
        p.errori[corso] = [...errori];
        await salvaProgressi(user.uid, p);
      }
    } catch (e) { console.warn('Ripasso non aggiornato', e); }
  }
  return esito;
}
