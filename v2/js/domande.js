// Catalogo corsi/categorie, formato unico delle domande e pubblicazione dei pacchetti.
import { db } from './firebase.js';
import { prendi, metti } from './cache.js';
import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Catalogo iniziale: dalla fase 3 vive nella collezione `corsi`.
// `legacy` = collezione del portale attuale da cui arrivano le domande.
export const CATALOGO = [
  { id: 'base', nome: 'Corso Base', icona: '🏥', area: 'salute', ordine: 1, quizGenerale: true, categorie: [
    { id: 'base_diu',       nome: 'Diritto Internazionale Umanitario', icona: '⚖️', legacy: 'domande_base_diu' },
    { id: 'base_movimento', nome: 'Movimento CRI e Mezzaluna Rossa',   icona: '🌍', legacy: 'domande_base_movimento' },
    { id: 'base_principi',  nome: 'Principi ed Emblema',               icona: '🔴', legacy: 'domande_base_principi' },
    { id: 'base_strategia', nome: 'Strategia CRI 2030',                icona: '📋', legacy: 'domande_base_strategia' },
    { id: 'base_salvavita', nome: 'Manovre Salvavita',                 icona: '🫀', legacy: 'domande_base_salvavita' }
  ]},
  { id: 'tssa', nome: 'Corso TSSA', icona: '🚑', area: 'salute', ordine: 2, quizGenerale: true, categorie: [
    { id: 'tssa_adulto',     nome: 'Protocolli operativi sanitari adulto',               icona: '🫀', legacy: 'domande_tssa_adulto' },
    { id: 'tssa_pediatrico', nome: 'Protocolli operativi sanitari pediatrico',           icona: '👶', legacy: 'domande_tssa_pediatrico' },
    { id: 'tssa_resp',       nome: 'Approccio al paziente con problematica respiratoria', icona: '🫁', legacy: 'domande_tssa_resp' },
    { id: 'tssa_neuro',      nome: 'Approccio al paziente con problematica neurologica',  icona: '🧠', legacy: 'domande_tssa_neuro' },
    { id: 'tssa_cardio',     nome: 'Approccio al paziente con problematica cardiaca',     icona: '❤️', legacy: 'domande_tssa_cardio' },
    { id: 'tssa_farmaci',    nome: 'Farmaci',                                             icona: '💊', legacy: 'domande_tssa_farmaci' },
    { id: 'tssa_ossigeno',   nome: 'Ossigeno',                                            icona: '🫧', legacy: 'domande_tssa_ossigeno' },
    { id: 'tssa_trauma',     nome: 'Trauma',                                              icona: '🦴', legacy: 'trauma' },
    { id: 'tssa_anatomia',   nome: 'Anatomia e Fisiologia',                               icona: '📖', legacy: 'domande_tssa_anatomia' }
  ]},
  { id: 'squadra', nome: 'Formazione Squadra', icona: '👥', area: 'salute', ordine: 3, quizGenerale: false, categorie: [
    { id: 'squadra', nome: 'Formazione Squadra', icona: '👥', legacy: 'domande_squadra' }
  ]}
];

export const DIFFICOLTA = ['facile', 'medio', 'difficile'];
export const TIPI = ['multipla', 'vf'];

// Converte una domanda del portale attuale (entrambi i formati) nel formato unico.
// Ritorna { domanda } oppure { errore }.
export function daLegacy(dati, corso, categoria, collezione, id) {
  let testo, opzioni, corretta, tipo;
  if (typeof dati.domanda === 'string' && Array.isArray(dati.risposte)) {
    // formato "trauma": corretta = indice
    testo = dati.domanda; opzioni = dati.risposte; corretta = dati.corretta; tipo = dati.tipo || 'multipla';
  } else {
    // formato standard: corretta = testo dell'opzione
    testo = dati.testo; opzioni = dati.opzioni; tipo = dati.tipo;
    corretta = Array.isArray(opzioni) ? opzioni.indexOf(dati.corretta) : -1;
  }
  let difficolta = dati.difficolta ?? null;
  if (difficolta === 'media') difficolta = 'medio';

  const domanda = {
    corso, categoria, tipo,
    testo: String(testo ?? '').trim(),
    opzioni: (opzioni || []).map(o => String(o).trim()),
    corretta,
    difficolta,
    spiegazione: '',
    stato: 'attiva',
    legacy: { collezione, id }
  };
  const errori = valida(domanda);
  return errori.length ? { errore: errori.join('; ') } : { domanda };
}

// Controlli comuni a migrazione, editor e importazione
export function valida(d) {
  const e = [];
  if (!TIPI.includes(d.tipo)) e.push(`tipo "${d.tipo}" non valido`);
  if (!d.testo) e.push('testo vuoto');
  if (!Array.isArray(d.opzioni)) e.push('opzioni mancanti');
  else {
    if (d.tipo === 'vf' && (d.opzioni.length !== 2 || d.opzioni[0] !== 'Vero' || d.opzioni[1] !== 'Falso')) e.push('le opzioni V/F devono essere "Vero", "Falso"');
    if (d.tipo === 'multipla' && (d.opzioni.length < 2 || d.opzioni.length > 6)) e.push('servono da 2 a 6 opzioni');
    if (d.opzioni.some(o => !o)) e.push('opzione vuota');
    const piene = d.opzioni.filter(Boolean).map(o => o.toLowerCase());
    if (new Set(piene).size !== piene.length) e.push('opzioni ripetute');
  }
  if (!Number.isInteger(d.corretta) || d.corretta < 0 || d.corretta >= (d.opzioni?.length || 0)) e.push('risposta corretta non valida');
  if (d.difficolta !== null && !DIFFICOLTA.includes(d.difficolta)) e.push(`difficoltà "${d.difficolta}" non valida`);
  return e;
}

// Corsi dell'utente, letti dalla collezione `corsi`, in ordine di menu.
// Restano in memoria 15 minuti; fresco:true li rilegge (serve al quiz per sapere le versioni dei pacchetti).
const DURATA_CORSI = 15 * 60 * 1000;
export async function leggiCorsi(idCorsi, { fresco = false } = {}) {
  const corsi = await Promise.all((idCorsi || []).map(async id => {
    const salvato = fresco ? null : prendi('corso.' + id, { maxEta: DURATA_CORSI });
    if (salvato) return salvato;
    const d = await getDoc(doc(db, 'corsi', id));
    if (!d.exists()) return null;
    const c = { id: d.id, ...d.data(), categorie: [...(d.data().categorie || [])].sort((a, b) => a.ordine - b.ordine) };
    metti('corso.' + id, c);
    return c;
  }));
  return corsi.filter(c => c && c.attivo !== false).sort((a, b) => a.ordine - b.ordine);
}

// Pacchetto di domande di un argomento. Se il corso dice che la versione pubblicata è quella
// già salvata sul dispositivo, non serve rileggerlo: zero letture.
export async function leggiPacchetto(categoria, versioneAttesa = null) {
  const salvato = prendi('pk.' + categoria);
  if (salvato && versioneAttesa && salvato.versione === versioneAttesa) return salvato;
  const d = await getDoc(doc(db, 'pacchetti', categoria));
  if (!d.exists()) return null;
  const x = d.data();
  const p = { corso: x.corso, categoria, versione: x.versione, numero: x.numero, domande: x.domande };
  metti('pk.' + categoria, p);
  return p;
}

// Tutti i pacchetti di un elenco di corsi, usando quelli già sul dispositivo quando sono aggiornati
export async function leggiPacchettiCorsi(corsi) {
  const coppie = corsi.flatMap(c => c.categorie.map(cat => [cat.id, c.versioni?.[cat.id] || null]));
  const p = await Promise.all(coppie.map(([id, v]) => leggiPacchetto(id, v).catch(() => null)));
  return new Map(p.filter(Boolean).map(x => [x.categoria, x]));
}

// Tutti i corsi (per il pannello admin)
export async function leggiTuttiCorsi() {
  const snap = await getDocs(collection(db, 'corsi'));
  return snap.docs.map(d => ({ id: d.id, ...d.data(), categorie: [...(d.data().categorie || [])].sort((a, b) => a.ordine - b.ordine) }))
    .sort((a, b) => a.ordine - b.ordine);
}

// Testo normalizzato per riconoscere i doppioni ("La PA è…" = "la pa e")
export const chiaveTesto = t => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, ' ').trim();

// ---------- CSV ----------
export const COLONNE_CSV = ['categoria', 'tipo', 'testo', 'opzione_a', 'opzione_b', 'opzione_c', 'opzione_d',
  'opzione_e', 'opzione_f', 'corretta', 'difficolta', 'spiegazione'];
const LETTERE = 'ABCDEF';

// Converte una riga del CSV (oggetto colonna→valore) in domanda. `categorie` = Map id → corso.
export function daRigaCsv(riga, categorie) {
  const v = k => String(riga[k] ?? '').trim();
  const categoria = v('categoria').toLowerCase();
  if (!categorie.has(categoria)) return { errore: `categoria "${categoria}" sconosciuta` };
  const corso = categorie.get(categoria);
  if (v('corso') && v('corso').toLowerCase() !== corso) return { errore: `la categoria ${categoria} appartiene al corso ${corso}, non a ${v('corso')}` };

  let tipo = v('tipo').toLowerCase().replace(/[^a-z]/g, '');
  if (['vf', 'verofalso'].includes(tipo)) tipo = 'vf';
  else if (['multipla', 'rispostamultipla', 'm'].includes(tipo)) tipo = 'multipla';

  let opzioni, corretta;
  const c = v('corretta').toUpperCase();
  if (tipo === 'vf') {
    opzioni = ['Vero', 'Falso'];
    corretta = ['A', 'VERO', 'V'].includes(c) ? 0 : ['B', 'FALSO', 'F'].includes(c) ? 1 : -1;
  } else {
    opzioni = ['a', 'b', 'c', 'd', 'e', 'f'].map(l => v('opzione_' + l)).filter(Boolean);
    corretta = c.length === 1 ? LETTERE.indexOf(c) : opzioni.findIndex(o => o.toUpperCase() === c);
  }
  let difficolta = v('difficolta').toLowerCase() || null;
  if (difficolta === 'media') difficolta = 'medio';

  const domanda = { corso, categoria, tipo, testo: v('testo'), opzioni, corretta, difficolta,
    spiegazione: v('spiegazione'), stato: 'bozza' };
  const errori = valida(domanda);
  return errori.length ? { errore: errori.join('; ') } : { domanda };
}

// Domanda → riga CSV (stesse colonne del modello di importazione)
export function aRigaCsv(d) {
  const r = { categoria: d.categoria, tipo: d.tipo, testo: d.testo, corretta: LETTERE[d.corretta] || '',
    difficolta: d.difficolta || '', spiegazione: d.spiegazione || '' };
  ['a', 'b', 'c', 'd', 'e', 'f'].forEach((l, i) => r['opzione_' + l] = d.tipo === 'vf' ? (i < 2 ? d.opzioni[i] : '') : (d.opzioni[i] || ''));
  return r;
}

// Id stabile per le domande migrate: rieseguire la migrazione non crea doppioni
export const idLegacy = (collezione, id) => `${collezione}__${id}`;

// ---------- Manuali di riferimento ----------
// Collezione `manuali`: { nome, edizione, corsi: [...], link, attivo }. La gestisce il responsabile.
export async function leggiManuali() {
  const snap = await getDocs(collection(db, 'manuali'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(m => m.attivo !== false)
    .sort((a, b) => String(a.nome).localeCompare(String(b.nome), 'it'));
}

// Riferimento di una domanda { manuale, capitolo, pagina } → "Manuale TSSA (2024) · cap. 4 · pag. 112"
export function testoRiferimento(r, manuali) {
  if (!r || !r.manuale) return '';
  const m = (manuali instanceof Map ? manuali.get(r.manuale) : manuali.find(x => x.id === r.manuale));
  if (!m) return '';
  const parti = [`${m.nome}${m.edizione ? ` (${m.edizione})` : ''}`];
  if (r.capitolo) parti.push(/^\d/.test(r.capitolo) ? `cap. ${r.capitolo}` : r.capitolo);
  if (r.pagina) parti.push(`pag. ${r.pagina}`);
  return parti.join(' · ');
}
// Link al manuale (se il manuale ha un indirizzo); per i PDF si apre direttamente alla pagina
export function linkRiferimento(r, manuali) {
  if (!r || !r.manuale) return '';
  const m = (manuali instanceof Map ? manuali.get(r.manuale) : manuali.find(x => x.id === r.manuale));
  if (!m?.link) return '';
  const pag = parseInt(r.pagina, 10);
  return /\.pdf($|[?#])/i.test(m.link) && pag ? `${m.link.split('#')[0]}#page=${pag}` : m.link;
}

// Rigenera il pacchetto di una categoria con le sole domande attive.
// Il riferimento al manuale viene scritto già come testo: i volontari non devono leggere i manuali.
export async function pubblicaCategoria(corso, categoria, uid) {
  const [snap, manuali] = await Promise.all([
    getDocs(query(collection(db, 'domande'), where('corso', '==', corso), where('categoria', '==', categoria), where('stato', '==', 'attiva'))),
    leggiManuali().catch(() => [])
  ]);
  const domande = snap.docs.map(d => {
    const x = d.data();
    const rif = testoRiferimento(x.riferimento, manuali), rifLink = linkRiferimento(x.riferimento, manuali);
    return { id: d.id, tipo: x.tipo, testo: x.testo, opzioni: x.opzioni, corretta: x.corretta,
             difficolta: x.difficolta ?? null, spiegazione: x.spiegazione || '',
             ...(rif ? { rif } : {}), ...(rifLink ? { rifLink } : {}) };
  }).sort((a, b) => a.id.localeCompare(b.id));
  const versione = Date.now();
  await setDoc(doc(db, 'pacchetti', categoria), {
    corso, categoria,
    numero: domande.length,
    versione,
    pubblicatoIl: serverTimestamp(),
    pubblicatoDa: uid,
    domande
  });
  // il corso annota la versione: così i telefoni dei volontari sanno se riscaricare il pacchetto
  await updateDoc(doc(db, 'corsi', corso), { [`versioni.${categoria}`]: versione });
  return domande.length;
}
