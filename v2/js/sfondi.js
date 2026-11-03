// Sfondi decorativi: trama dei sette principi (accesso) e attrezzature di soccorso (home).
// Disegnati in base alla dimensione della finestra; la disposizione è "casuale" ma sempre la stessa.

const PRINCIPI = [
  ['Umanità', '#C8102E'], ['Imparzialità', '#1D4F91'], ['Neutralità', '#17664D'],
  ['Indipendenza', '#D9822B'], ['Volontariato', '#7A3FA8'], ['Unità', '#0E7C86'], ['Universalità', '#B8860B']
];

// Disegni stilizzati (viewBox 64×64): ambulanza, siringa, cerotto, benda, DAE, pallone AMBU, cannula di Guedel
const ATTREZZATURE = [
  "<g stroke=\"#1E1A1A\" stroke-width=\"2.5\" stroke-linejoin=\"round\" stroke-linecap=\"round\" transform=\"rotate(-40 32 32)\"><rect x=\"16\" y=\"25\" width=\"28\" height=\"14\" rx=\"3\" fill=\"#EAF6FD\"/><rect x=\"29\" y=\"28\" width=\"13\" height=\"8\" fill=\"#7CC4E8\" stroke=\"none\"/><path d=\"M21 25v5M26 25v5M31 25v5M36 25v5\"/><path d=\"M44 32h9M53 25v14\"/><path d=\"M16 32H5\"/><rect x=\"14\" y=\"27\" width=\"2\" height=\"10\" fill=\"#1E1A1A\"/></g>",
  "<g stroke=\"#1E1A1A\" stroke-width=\"2.5\" stroke-linejoin=\"round\" stroke-linecap=\"round\"><rect x=\"10\" y=\"8\" width=\"44\" height=\"48\" rx=\"8\" fill=\"#2BB673\"/><rect x=\"18\" y=\"4\" width=\"28\" height=\"7\" rx=\"3\" fill=\"#2BB673\"/><path d=\"M32 46s-13-8-13-17a7 7 0 0 1 13-3 7 7 0 0 1 13 3c0 9-13 17-13 17z\" fill=\"#FFFFFF\"/><path d=\"M34 24l-5 8h6l-4 8\" stroke=\"#C8102E\" stroke-width=\"2.5\" fill=\"none\"/></g>",
  "<g stroke=\"#1E1A1A\" stroke-width=\"2.5\" stroke-linejoin=\"round\" stroke-linecap=\"round\"><path d=\"M30 42h24a4 4 0 0 1 4 4v8H30\" fill=\"#FFFFFF\"/><circle cx=\"24\" cy=\"30\" r=\"16\" fill=\"#FFFFFF\"/><circle cx=\"24\" cy=\"30\" r=\"6\" fill=\"#E7E2E0\"/><path d=\"M13 22c4-3 8-4 12-4M10 32c1 5 4 9 9 11\" stroke-width=\"1.8\"/></g>",
  "<g stroke=\"#1E1A1A\" stroke-width=\"2.5\" stroke-linejoin=\"round\" stroke-linecap=\"round\" transform=\"rotate(30 32 32)\"><rect x=\"6\" y=\"22\" width=\"52\" height=\"20\" rx=\"10\" fill=\"#F2C9A0\"/><rect x=\"24\" y=\"24\" width=\"16\" height=\"16\" rx=\"3\" fill=\"#FBE8D6\"/><circle cx=\"13\" cy=\"29\" r=\"1\" fill=\"#1E1A1A\"/><circle cx=\"17\" cy=\"35\" r=\"1\" fill=\"#1E1A1A\"/><circle cx=\"47\" cy=\"29\" r=\"1\" fill=\"#1E1A1A\"/><circle cx=\"51\" cy=\"35\" r=\"1\" fill=\"#1E1A1A\"/></g>",
  "<g stroke=\"#1E1A1A\" stroke-width=\"2.5\" stroke-linejoin=\"round\" stroke-linecap=\"round\"><ellipse cx=\"24\" cy=\"34\" rx=\"17\" ry=\"12\" fill=\"#8FD3C1\"/><path d=\"M12 30c4-2 8-2 12 0M12 38c4 2 8 2 12 0\" stroke-width=\"1.8\"/><rect x=\"40\" y=\"29\" width=\"8\" height=\"10\" rx=\"2\" fill=\"#FFFFFF\"/><path d=\"M48 24l10-4v28l-10-4z\" fill=\"#BFE3F5\"/><path d=\"M4 34h3\"/></g>",
  "<g stroke-linecap=\"round\" fill=\"none\"><path d=\"M22 10v14c0 16 10 26 26 30\" stroke=\"#1E1A1A\" stroke-width=\"12\"/><path d=\"M22 10v14c0 16 10 26 26 30\" stroke=\"#F2B544\" stroke-width=\"7\"/><rect x=\"12\" y=\"6\" width=\"20\" height=\"7\" rx=\"2.5\" fill=\"#F2B544\" stroke=\"#1E1A1A\" stroke-width=\"2.5\"/></g>",
  "<g stroke=\"#1E1A1A\" stroke-width=\"2.5\" stroke-linejoin=\"round\" stroke-linecap=\"round\"><rect x=\"4\" y=\"20\" width=\"38\" height=\"26\" rx=\"4\" fill=\"#FFFFFF\"/><path d=\"M42 28h10l8 9v9H42z\" fill=\"#FFFFFF\"/><path d=\"M46 31h5l5 6H46z\" fill=\"#9CC9F0\"/><rect x=\"13\" y=\"14\" width=\"12\" height=\"6\" rx=\"2\" fill=\"#4A90E2\"/><path d=\"M23 26v14M16 33h14\" stroke=\"#C8102E\" stroke-width=\"5\"/><circle cx=\"15\" cy=\"47\" r=\"6\" fill=\"#4A4242\"/><circle cx=\"50\" cy=\"47\" r=\"6\" fill=\"#4A4242\"/></g>"
];

// Simboli caldi per le pagine interne (viewBox 24×24, solo contorno): croce, cuore, mani, stella,
// emblema nel cerchio, persone, cuore con croce, sole
const SIMBOLI = [
  '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
  '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
  '<path d="M7 11l3-3a2 2 0 0 1 3 0l1 1M3 13l4-4 3 3M21 13l-4-4-5 5a1.5 1.5 0 0 0 2 2l3-3M5 15l4 4a2 2 0 0 0 3 0"/>',
  '<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/>',
  '<circle cx="12" cy="12" r="9"/><path d="M10.5 7h3v3.5H17v3h-3.5V17h-3v-3.5H7v-3h3.5z"/>',
  '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 19c0-3 3-5 6-5s6 2 6 5M15 15c3 0 6 1.5 6 4"/>',
  '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/><path d="M12 9v6M9 12h6"/>',
  '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>'
];
const COLORI_CALDI = ['#C8102E', '#D9822B', '#B8860B', '#E0563B', '#C8102E', '#9E0C24'];

const ROTAZIONI = [-14, -10, -7, -4, 0, 3, 6, 9, 12, 15];

// generatore pseudo-casuale con seme: stessa disposizione a ogni apertura
function casuale(seme) {
  let s = seme >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}
const tra = (r, a, b) => a + Math.floor(r() * (b - a + 1));

function sacchetto(r, elementi) {
  let b = [];
  return () => {
    if (!b.length) { b = [...elementi]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } }
    return b.pop();
  };
}

// Parole grandi e marcate in basso, sempre più piccole salendo (la sfumatura è nel CSS)
function disegnaPrincipi(el) {
  const r = casuale(11), prossimo = sacchetto(r, PRINCIPI);
  const { W, H } = misura(el);
  const parti = [];
  let y = H - 6, sz = 40, op = 0.24;
  while (y > H * 0.3) {
    let x = -tra(r, 10, 40);
    while (x < W + 5) {
      const [parola, colore] = prossimo();
      const rot = ROTAZIONI[Math.floor(r() * ROTAZIONI.length)];
      parti.push(`<span style="left:${x}px;top:${Math.round(y - sz)}px;font-size:${sz.toFixed(1)}px;color:${colore};opacity:${op.toFixed(2)};transform:rotate(${rot}deg)">${parola}</span>`);
      x += parola.length * sz * 0.55 + sz * 0.35 + tra(r, 0, 8);
    }
    y -= Math.max(13, sz * 0.92); sz = Math.max(9, sz * 0.88); op = Math.max(0.09, op - 0.012);
  }
  el.innerHTML = parti.join('');
}

// Attrezzature sparse su tutta la pagina, ruotate a caso
function disegnaAttrezzature(el) {
  const r = casuale(9), prossimo = sacchetto(r, ATTREZZATURE);
  const { W, H } = misura(el);
  const parti = [];
  let y = -6, riga = 0;
  while (y < H + 10) {
    let x = -14 + (riga % 2 ? 30 : 0) + tra(r, -6, 6);
    while (x < W + 4) {
      const sz = tra(r, 40, 56), rot = tra(r, -40, 40);
      parti.push(`<svg width="${sz}" height="${sz}" viewBox="0 0 64 64" style="left:${x}px;top:${y + tra(r, -7, 7)}px;transform:rotate(${rot}deg)">${prossimo()}</svg>`);
      x += tra(r, 56, 68);
    }
    y += tra(r, 50, 58); riga++;
  }
  el.innerHTML = parti.join('');
}

// Area da riempire: almeno tutto lo schermo, così allargando o allungando la finestra lo sfondo è già pronto.
// La trama dei principi segue invece la finestra, perché deve partire dal fondo visibile.
function misura(el) {
  return el.classList.contains('principi')
    ? { W: el.clientWidth, H: el.clientHeight }
    : { W: Math.max(el.clientWidth, screen.width || 0), H: Math.max(el.clientHeight, screen.height || 0) };
}

// Simboli piccoli e radi, ruotati, molto tenui: danno calore senza disturbare la lettura
function disegnaSimboli(el) {
  const r = casuale(5), prossimo = sacchetto(r, SIMBOLI);
  const { W, H } = misura(el);
  const passo = W < 700 ? 78 : 96;
  const parti = [];
  for (let y = -10, riga = 0; y < H + 20; y += passo * 0.86, riga++) {
    for (let x = -20 + (riga % 2 ? passo / 2 : 0); x < W + 20; x += passo) {
      if (r() < 0.18) continue; // qualche vuoto, per non fare una griglia
      const sz = tra(r, 20, 34), rot = tra(r, -30, 30);
      const col = COLORI_CALDI[Math.floor(r() * COLORI_CALDI.length)];
      const op = (0.10 + r() * 0.08).toFixed(2);
      parti.push(`<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
        style="left:${Math.round(x + tra(r, -14, 14))}px;top:${Math.round(y + tra(r, -12, 12))}px;opacity:${op};transform:rotate(${rot}deg)">${prossimo()}</svg>`);
    }
  }
  el.innerHTML = parti.join('');
}

function monta(classe, disegna) {
  const el = document.createElement('div');
  el.className = 'sfondo ' + classe;
  el.setAttribute('aria-hidden', 'true');
  document.body.prepend(el);
  disegna(el);
  let t, larghezza = innerWidth, altezza = innerHeight, coperto = misura(el);
  // Ridisegna quando la finestra cambia davvero: larghezza diversa, oppure più alta della parte già riempita
  // (su telefono lo scroll fa variare di poco l'altezza per la barra degli indirizzi: quello si ignora)
  addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const piuGrande = innerWidth > coperto.W || innerHeight > coperto.H;
      const principiCambiati = classe === 'principi' && Math.abs(innerHeight - altezza) > 120;
      if (Math.abs(innerWidth - larghezza) > 20 || piuGrande || principiCambiati) {
        larghezza = innerWidth; altezza = innerHeight; disegna(el); coperto = misura(el);
      }
    }, 200);
  });
}

export const sfondoPrincipi = () => monta('principi', disegnaPrincipi);
export const sfondoAttrezzature = () => monta('attrezzature', disegnaAttrezzature);
export const sfondoSimboli = () => monta('simboli', disegnaSimboli);
