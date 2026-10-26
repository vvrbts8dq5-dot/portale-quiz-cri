// Aree CRI: raggruppano i corsi nella home. Ogni corso in `corsi` ha il campo `area` con uno di questi id.
const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

export const AREE = [
  { id: 'salute', nome: 'Salute', colore: '#C8102E', tinta: '#FDE7EA',
    icona: svg('<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/><path d="M12 9v6M9 12h6"/>') },
  { id: 'sociale', nome: 'Inclusione sociale', colore: '#B35A00', tinta: '#FFEEDB',
    icona: svg('<path d="M7 11l3-3a2 2 0 0 1 3 0l1 1M3 13l4-4 3 3M21 13l-4-4-5 5a1.5 1.5 0 0 0 2 2l3-3M5 15l4 4a2 2 0 0 0 3 0"/>') },
  { id: 'emergenze', nome: 'Emergenze', colore: '#1D4F91', tinta: '#E3EEFB',
    icona: svg('<path d="M12 3l9 16H3z"/><path d="M12 9v5M12 17h.01"/>') },
  { id: 'principi', nome: 'Principi e Valori Umanitari', colore: '#6A3594', tinta: '#F1E8F8',
    icona: svg('<path d="M12 4v16M6 20h12M4 8h16M6 8l-3 6h6zM18 8l-3 6h6z"/>') },
  { id: 'giovani', nome: 'Giovani', colore: '#17664D', tinta: '#E1F2EC',
    icona: svg('<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/>') },
  { id: 'motorizzazione', nome: 'Motorizzazione', colore: '#3E4C59', tinta: '#E6EBF0',
    icona: svg('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2"/><path d="M12 14v6.5M10.2 11.2L4 9.5M13.8 11.2L20 9.5"/>') },
  { id: 'militare', nome: 'Corpo Militare', colore: '#4B5D23', tinta: '#EDF1E0',
    icona: svg('<path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"/><path d="M12 8v7M8.5 11.5h7"/>') }
];

const ALTRO = { id: 'altro', nome: 'Altri corsi', colore: '#4A4242', tinta: '#F3EFEE', icona: svg('<path d="M4 6h16M4 12h16M4 18h10"/>') };

export const area = id => AREE.find(a => a.id === id) || ALTRO;

// Raggruppa i corsi per area, nell'ordine delle aree CRI.
// Tutte le aree compaiono sempre, anche senza corsi; "Altri corsi" solo se serve.
export function perArea(corsi) {
  const gruppi = new Map(AREE.map(a => [a.id, { ...a, corsi: [] }]));
  for (const c of corsi) {
    const a = area(c.area);
    if (!gruppi.has(a.id)) gruppi.set(a.id, { ...a, corsi: [] });
    gruppi.get(a.id).corsi.push(c);
  }
  const ordine = [...AREE.map(a => a.id), 'altro'];
  return [...gruppi.values()].sort((x, y) => ordine.indexOf(x.id) - ordine.indexOf(y.id));
}

// Dove porta un corso: dritto al quiz se ha un solo argomento, altrimenti all'elenco argomenti
export const linkCorso = c => c.categorie.length === 1
  ? `quiz.html?c=${encodeURIComponent(c.id)}&cat=${encodeURIComponent(c.categorie[0].id)}`
  : `corso.html?c=${encodeURIComponent(c.id)}`;

// Schede dei corsi (home con una sola area e pagina dell'area)
import { ICONA, iconaCorso } from './icone.js';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const vociCorsi = corsi => corsi.map(c => {
  const ic = iconaCorso(c.id), una = c.categorie.length === 1;
  return `<a class="voce" href="${linkCorso(c)}">
    <span class="icona ${ic.tinta}">${ic.icona}</span>
    <span><span class="tit" style="display:block">${esc(c.nome)}</span><span class="sub">${una ? 'Quiz diretto' : c.categorie.length + ' argomenti'}</span></span>
    <span class="freccia">${ICONA.avanti}</span></a>`;
}).join('');

// Riquadri delle aree (home con più aree)
// Le aree senza corsi si vedono ma non si aprono
export const riquadriAree = gruppi => `<div class="griglia-aree">${gruppi.map(g => g.corsi.length ? `
  <a class="riquadro-area" href="area.html?a=${encodeURIComponent(g.id)}">
    <span class="ic" style="background:${g.tinta};color:${g.colore}">${g.icona}</span>
    <span class="nome">${esc(g.nome)}</span>
    <span class="sub">${g.corsi.length === 1 ? '1 corso' : g.corsi.length + ' corsi'}</span>
  </a>` : `
  <div class="riquadro-area vuota" aria-disabled="true">
    <span class="ic" style="background:${g.tinta};color:${g.colore}">${g.icona}</span>
    <span class="nome">${esc(g.nome)}</span>
    <span class="sub">Corsi in arrivo</span>
  </div>`).join('')}</div>`;
