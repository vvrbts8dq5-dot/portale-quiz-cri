// Elenco dei giochi: nome, descrizione, gruppo e quando sono disponibili per un corso.
import { SEQUENZE, FRASI, ABBINAMENTI, CASI, PUNTI_ANATOMIA, perCorso } from './contenuti.js';

const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

export const ICONE_GIOCHI = {
  vf: svg('<path d="M4 12l4 4 8-9"/><path d="M14 15l6 6M20 15l-6 6"/>'),
  sopravvivenza: svg('<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/><path d="M9 11h6"/>'),
  scala: svg('<path d="M7 3v18M17 3v18M7 7h10M7 12h10M7 17h10"/>'),
  coppie: svg('<rect x="3" y="5" width="7" height="14" rx="2"/><rect x="14" y="5" width="7" height="14" rx="2"/><path d="M10 12h4"/>'),
  completa: svg('<path d="M4 7h7M15 7h5M4 12h3M11 12h9M4 17h9M17 17h3"/><path d="M12 5v4M8 10v4M14 15v4" stroke-dasharray="1 2"/>'),
  ordina: svg('<path d="M4 6h10M4 12h10M4 18h10M18 4v16M15 17l3 3 3-3"/>'),
  abbina: svg('<circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6l10 12M7 18L17 6"/>'),
  caso: svg('<path d="M12 3v6M12 9l-6 5v7M12 9l6 5v7"/><circle cx="12" cy="3" r="1"/>'),
  anatomia: svg('<circle cx="12" cy="5" r="2.5"/><path d="M12 8v7M7 10l5 1 5-1M9 22l3-7 3 7"/><circle cx="17" cy="15" r="3"/><path d="M19 17l2 2"/>'),
  triage: svg('<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 9h2M11 9h6M7 14h2M11 14h6"/>'),
  rcp: svg('<path d="M3 12h4l2-6 4 12 2-6h6"/>')
};

export const GRUPPI = [
  { id: 'domande', nome: 'Gioca con le domande del corso', sub: 'Le domande dei quiz, in versione gioco. Gli errori finiscono nel tuo ripasso.' },
  { id: 'contenuti', nome: 'Allenamento pratico', sub: 'Sequenze, frasi e abbinamenti da ricordare in servizio.' },
  { id: 'interattivi', nome: 'Simulazioni', sub: 'Casi a bivi, anatomia, triage e ritmo delle compressioni.' }
];

// Domande adatte al gioco "Coppie": testo e risposta brevi, risposta non generica
export const domandaDaCoppia = d => d.tipo === 'multipla' && d.testo.length <= 120 && d.opzioni[d.corretta]?.length <= 50
  && !/precedent|tutte le|nessuna|entrambe/i.test(d.opzioni[d.corretta]);

const CAT_TRIAGE = ['tssa_trauma', 'tssa_adulto', 'squadra'];
const CAT_RCP = ['base_salvavita', 'tssa_cardio', 'tssa_adulto', 'squadra'];
export const argomentoTriage = cats => CAT_TRIAGE.find(c => cats.includes(c)) || null;
export const argomentoRcp = cats => CAT_RCP.find(c => cats.includes(c)) || null;

// disponibile({ domande, categorie }) → true/false. domande = domande pubblicate scelte, categorie = id argomenti del corso
export const GIOCHI = [
  { id: 'vf', gruppo: 'domande', nome: 'Vero o falso lampo', sub: '60 secondi: più risposte giuste di fila, più punti.',
    usaDomande: true, disponibile: ({ domande }) => domande.filter(d => d.tipo === 'vf').length >= 8 },
  { id: 'sopravvivenza', gruppo: 'domande', nome: 'Sopravvivenza', sub: 'Tre vite, domande sempre più difficili. Fin dove arrivi?',
    usaDomande: true, disponibile: ({ domande }) => domande.length >= 10 },
  { id: 'scala', gruppo: 'domande', nome: 'La scala', sub: '15 gradini, due aiuti. Un errore e scendi al traguardo.',
    usaDomande: true, disponibile: ({ domande }) => domande.length >= 15 },
  { id: 'coppie', gruppo: 'domande', nome: 'Coppie lampo', sub: 'Collega ogni domanda alla sua risposta, contro il tempo.',
    usaDomande: true, disponibile: ({ domande }) => domande.filter(domandaDaCoppia).length >= 5 },
  { id: 'ordina', gruppo: 'contenuti', nome: 'Metti in ordine', sub: 'Le sequenze delle manovre, passo dopo passo.',
    disponibile: ({ categorie }) => perCorso(SEQUENZE, categorie).length > 0 },
  { id: 'completa', gruppo: 'contenuti', nome: 'Completa la frase', sub: 'Numeri e parole chiave da sapere a memoria.',
    disponibile: ({ categorie }) => perCorso(FRASI, categorie).length > 0 },
  { id: 'abbina', gruppo: 'contenuti', nome: 'Abbina', sub: 'Collega ogni voce alla sua definizione.',
    disponibile: ({ categorie }) => perCorso(ABBINAMENTI, categorie).length > 0 },
  { id: 'caso', gruppo: 'interattivi', nome: 'Caso clinico a bivi', sub: 'Sei sul posto: ogni scelta cambia come va a finire.',
    disponibile: ({ categorie }) => perCorso(CASI, categorie).length > 0 },
  { id: 'anatomia', gruppo: 'interattivi', nome: 'Trova il punto', sub: 'Tocca sulla figura polsi, organi e punti delle manovre.',
    disponibile: ({ categorie }) => perCorso(PUNTI_ANATOMIA, categorie).length >= 4 },
  { id: 'triage', gruppo: 'interattivi', nome: 'Triage START', sub: 'Maxi-emergenza: assegna il codice colore a ogni ferito.',
    disponibile: ({ categorie }) => !!argomentoTriage(categorie) },
  { id: 'rcp', gruppo: 'interattivi', nome: 'Ritmo RCP', sub: '30 compressioni: tieni il ritmo tra 100 e 120 al minuto.',
    disponibile: ({ categorie }) => !!argomentoRcp(categorie) }
];

export const gioco = id => GIOCHI.find(g => g.id === id) || null;
