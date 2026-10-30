// Riepilogo personale di ogni volontario, in un solo documento `progressi/{uid}`:
// domande da ripassare per corso, totali e ultimi 50 quiz.
// Così la pagina del quiz e "I miei quiz" leggono 1 documento invece di tutti i risultati.
import { db } from './firebase.js';
import { doc, getDoc, setDoc, getDocs, collection, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export const MAX_ULTIMI = 50;
const ms = v => v?.toMillis ? v.toMillis() : (typeof v === 'number' ? v : Date.now());

const vuoto = () => ({ errori: {}, totali: { quiz: 0, somma: 0, superati: 0 }, ultimi: [] });

// Aggiunge un esito al riepilogo (non salva)
export function aggiungiEsito(p, e) {
  const errori = new Set(p.errori[e.corso] || []);
  // gli elementi propri dei giochi ("g:…") non sono domande: non entrano nel ripasso
  for (const r of e.risposte || []) if (!String(r.id).startsWith('g:')) r.esatta ? errori.delete(r.id) : errori.add(r.id);
  p.errori[e.corso] = [...errori];
  // le partite ai giochi aggiornano solo il ripasso: totali e "I miei quiz" restano dei quiz
  if (e.modalita === 'gioco') return p;
  p.totali.quiz++; p.totali.somma += e.percentuale; p.totali.superati += e.superato ? 1 : 0;
  p.ultimi.unshift({ t: ms(e.timestamp), corso: e.corso, categoria: e.categoria, categoriaNome: e.categoriaNome,
    percentuale: e.percentuale, corrette: e.corrette, numeroDomande: e.numeroDomande, superato: !!e.superato,
    modalita: e.modalita || 'quiz', tempoScaduto: !!e.tempoScaduto });
  p.ultimi = p.ultimi.slice(0, MAX_ULTIMI);
  return p;
}

// Legge il riepilogo; la prima volta lo ricostruisce dai risultati già salvati
export async function leggiProgressi(uid) {
  const d = await getDoc(doc(db, 'progressi', uid));
  if (d.exists()) {
    const x = d.data();
    return { errori: x.errori || {}, totali: x.totali || vuoto().totali, ultimi: x.ultimi || [] };
  }
  const snap = await getDocs(query(collection(db, 'esiti'), where('uid', '==', uid)));
  const esiti = snap.docs.map(s => s.data()).sort((a, b) => ms(a.timestamp) - ms(b.timestamp));
  const p = esiti.reduce(aggiungiEsito, vuoto());
  await salvaProgressi(uid, p).catch(() => {});
  p.ricostruito = true; // contiene già tutti i risultati salvati finora
  return p;
}

export const salvaProgressi = (uid, p) =>
  setDoc(doc(db, 'progressi', uid), { errori: p.errori, totali: p.totali, ultimi: p.ultimi, aggiornatoIl: serverTimestamp() });
