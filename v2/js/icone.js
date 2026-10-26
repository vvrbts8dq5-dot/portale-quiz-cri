// Icone a tratto (colore = currentColor), al posto delle emoji.
const svg = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;

export const ICONA = {
  avanti: svg('<path d="M9 6l6 6-6 6"/>'),
  indietro: svg('<path d="M15 6l-6 6 6 6"/>'),
  casa: svg('<path d="M3 11l9-7 9 7v9H3z"/>'),
  grafico: svg('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
  utente: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'),
  ingranaggio: svg('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>'),
  orologio: svg('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M10 2h4"/>'),
  croce: svg('<path d="M12 5v14M5 12h14"/>'),
  battito: svg('<path d="M3 12h4l2-5 4 10 2-5h6"/>'),
  persone: svg('<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 19c0-3 3-5 6-5s6 2 6 5M15 15c3 0 6 1.5 6 4"/>'),
  elenco: svg('<path d="M9 4h6v3H9zM7 5H5v16h14V5h-2M8 12h8M8 16h5"/>'),
  esci: svg('<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>')
};

// Corsi: icona e colore della piastrella
const CORSI = {
  base: { icona: ICONA.croce, tinta: '' },
  tssa: { icona: ICONA.battito, tinta: 'blu' },
  squadra: { icona: ICONA.persone, tinta: 'verde' }
};
export const iconaCorso = id => CORSI[id] || { icona: ICONA.croce, tinta: '' };

// Argomenti
const ARGOMENTI = {
  base_diu: svg('<path d="M12 4v16M6 20h12M4 8h16M6 8l-3 6h6zM18 8l-3 6h6z"/>'),
  base_movimento: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'),
  base_principi: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/>'),
  base_strategia: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'),
  base_salvavita: svg('<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/><path d="M8 12h2l1-2 2 4 1-2h2"/>'),
  tssa_adulto: svg('<circle cx="12" cy="6" r="3"/><path d="M12 9v7M8 12h8M9 21l3-5 3 5"/>'),
  tssa_pediatrico: svg('<circle cx="12" cy="9" r="5"/><path d="M10 9h.01M14 9h.01M10.5 11.5c.8.6 2.2.6 3 0M8 19c1-2 2.5-3 4-3s3 1 4 3"/>'),
  tssa_resp: svg('<path d="M12 4v8M12 10c-2 0-3 1-4 3l-2 5c-.6 1.5.4 3 2 3 2 0 3-2 3-4v-5M12 10c2 0 3 1 4 3l2 5c.6 1.5-.4 3-2 3-2 0-3-2-3-4v-5"/>'),
  tssa_neuro: svg('<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h1V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h-1V4z"/>'),
  tssa_cardio: svg('<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>'),
  tssa_farmaci: svg('<rect x="3" y="9" width="18" height="7" rx="3.5" transform="rotate(-35 12 12.5)"/><path d="M9.5 8.5l5 7"/>'),
  tssa_ossigeno: svg('<rect x="8" y="6" width="8" height="15" rx="4"/><path d="M10 3h4v3h-4zM10 13h4"/>'),
  tssa_trauma: svg('<path d="M7 4a2 2 0 0 0-2 3l9 10a2 2 0 1 0 3 0 2 2 0 1 0 0-3L8 5a2 2 0 0 0-1-1z"/>'),
  tssa_anatomia: svg('<path d="M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z"/>'),
  squadra: ICONA.persone,
  generale: ICONA.elenco
};
export const iconaArgomento = id => ARGOMENTI[id] || ICONA.elenco;

export const iniziali = p => ((p.nome || '')[0] || '').toUpperCase() + ((p.cognome || '')[0] || '').toUpperCase();
