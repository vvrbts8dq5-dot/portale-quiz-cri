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

// Caratteri della trama calda: maiuscole, un carattere diverso a ogni parola
const CARATTERI = [
  { f: 'Figtree', w: 800, s: 'normal', k: 1.00 },
  { f: 'Bebas Neue', w: 400, s: 'normal', k: 1.32 },
  { f: 'Archivo Black', w: 400, s: 'normal', k: 0.92 },
  { f: 'DM Serif Display', w: 400, s: 'italic', k: 1.08 },
  { f: 'Zilla Slab', w: 700, s: 'normal', k: 1.08 }
];

// Versione "fitta" (prova): le parole si incastrano dal basso come in un muro a secco.
// Ogni parola viene misurata con il carattere vero e messa nel punto libero più basso, così restano pochi vuoti;
// grandi e marcate in basso, sempre più piccole e tenui salendo; qualcuna in verticale per chiudere i buchi.
async function disegnaPrincipiFitti(el, caldo = false) {
  try { await Promise.all((caldo ? CARATTERI : [CARATTERI[0]]).map(c => document.fonts.load(`${c.s} ${c.w} 24px "${c.f}"`, 'ÀÈ'))); } catch { /* caratteri di riserva */ }
  const r = casuale(23), prossimo = sacchetto(r, PRINCIPI);
  const { W, H } = misura(el);
  const ctx = document.createElement('canvas').getContext('2d');
  const larghezza = (parola, sz, c = CARATTERI[0]) => { ctx.font = `${c.s} ${c.w} ${sz}px "${c.f}", sans-serif`; return ctx.measureText(parola).width; };
  const carattere = sacchetto(r, CARATTERI);
  const CELLA = 4, BORDO = caldo ? 36 : 160;          // quanto le parole possono uscire dai lati
  const n = Math.ceil((W + 2 * BORDO) / CELLA);
  const cielo = new Array(n).fill(caldo ? H - 2 : H + 10); // per ogni colonna: fin dove è già pieno (dal basso)
  const piccolo = W < 600 ? 0.72 : 1;                 // sul telefono parole un po' più piccole
  const parti = [];
  for (let k = 0; k < 2500; k++) {
    let somma = 0; for (let c = Math.floor(BORDO / CELLA); c < n - Math.floor(BORDO / CELLA); c++) somma += cielo[c];
    const livello = somma / (n - 2 * Math.floor(BORDO / CELLA));
    if (livello < H * (caldo ? 0.12 : 0.06)) break;
    const t = Math.min(1, Math.max(0, (H - livello) / H));   // 0 in basso, 1 in alto
    const sz = caldo ? Math.max(9, (38 - 24 * Math.pow(t, 0.9)) * piccolo * (0.86 + r() * 0.28))
      : Math.max(9, (50 - 38 * Math.pow(t, 0.75)) * piccolo * (0.78 + r() * 0.44));
    const [nome, colore] = prossimo();
    const car = caldo ? carattere() : CARATTERI[0];
    const parola = caldo ? nome.toLocaleUpperCase('it') : nome;
    const szc = caldo ? sz * car.k : sz;                 // grandezza reale per quel carattere
    const verticale = sz > 15 && r() < (caldo ? 0.08 : 0.13);
    const lt = larghezza(parola, szc, car);
    const alto = caldo ? szc * 0.94 : sz * 0.95;          // in maiuscolo la riga può essere più stretta
    const w = verticale ? alto : lt, h = verticale ? lt : alto;
    const nc = Math.ceil(w / CELLA);
    // il punto più basso disponibile (con un po' di caso per non fare file regolari)
    let meglio = -Infinity, cx = 0, base = 0;
    for (let c = 0; c + nc <= n; c += 2) {
      let b = Infinity; for (let i = c; i < c + nc; i++) if (cielo[i] < b) b = cielo[i];
      // caldo: si preferiscono i punti con il "pavimento" piatto, così sotto la parola non restano buchi
      let vuoto = 0; if (caldo) for (let i = c; i < c + nc; i++) vuoto += cielo[i] - b;
      const punteggio = b - (caldo ? 1.4 * vuoto / nc : 0) + r() * sz * (caldo ? 0.35 : 0.6);
      if (punteggio > meglio) { meglio = punteggio; cx = c; base = b; }
    }
    const gap = 1 + sz * 0.06;
    const y = base - gap - h, x = cx * CELLA - BORDO;
    for (let i = cx; i < cx + nc; i++) cielo[i] = y;
    if (x > W || x + w < 0) continue;
    const rot = verticale ? 0 : tra(r, -3, 3);
    // caldo: parole bianche sul fondo acceso, qualcuna rosso scuro o ambra per dare profondità
    let col = colore, op = (0.30 - 0.20 * t);
    if (caldo) {
      const d = r();
      if (t < 0.45 && d < 0.16) { col = '#7E0A1E'; op = 0.16 + 0.22 * (1 - t); }
      else if (t < 0.55 && d < 0.27) { col = '#FFE2A8'; op = 0.60 + 0.35 * (1 - t); }
      else { col = '#FFFFFF'; op = 0.42 + 0.50 * (1 - t); }
    }
    const ritardo = caldo ? Math.round(t * 900 + r() * 250) : 0;
    const font = caldo ? `font-family:'${car.f}',sans-serif;font-weight:${car.w};font-style:${car.s};` : '';
    parti.push(`<span style="left:${Math.round(x)}px;top:${Math.round(y)}px;font-size:${szc.toFixed(1)}px;line-height:${caldo ? 0.94 : 1};${font}color:${col};--op:${op.toFixed(2)};opacity:${op.toFixed(2)};`
      + (ritardo ? `animation-delay:${ritardo}ms;` : '')
      + (verticale ? '--rot:rotate(180deg);writing-mode:vertical-rl;transform:rotate(180deg)' : `--rot:rotate(${rot}deg);transform:rotate(${rot}deg)`) + `">${parola}</span>`);
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
      const principiCambiati = classe.startsWith('principi') && Math.abs(innerHeight - altezza) > 120;
      if (Math.abs(innerWidth - larghezza) > 20 || piuGrande || principiCambiati) {
        larghezza = innerWidth; altezza = innerHeight; disegna(el); coperto = misura(el);
      }
    }, 200);
  });
}

// Trama calda: righe giustificate da bordo a bordo (nessun vuoto, nessuna parola tagliata),
// maiuscole con caratteri e colori misti, più piccole e tenui salendo.
async function disegnaPrincipiCaldi(el) {
  try { await Promise.all(CARATTERI.map(c => document.fonts.load(`${c.s} ${c.w} 24px "${c.f}"`, 'ÀÈ'))); } catch { /* caratteri di riserva */ }
  const r = casuale(31), prossimo = sacchetto(r, PRINCIPI), carattere = sacchetto(r, CARATTERI);
  const { W, H } = misura(el);
  const ctx = document.createElement('canvas').getContext('2d');
  const misuraTesto = (testo, sz, c) => { ctx.font = `${c.s} ${c.w} ${sz}px "${c.f}", sans-serif`; return ctx.measureText(testo).width; };
  const piccolo = W < 600 ? 0.62 : 1;
  const MARGINE = 6, parti = [];
  let y = H - 4;
  while (y > H * 0.1) {
    const t = Math.min(1, Math.max(0, (H - y) / H));               // 0 in basso, 1 in alto
    const base = Math.max(9, (36 - 23 * Math.pow(t, 0.85)) * piccolo);
    const gapMin = base * 0.32;
    // riempi la riga finché c'è posto
    const riga = []; let usato = 0;
    for (let tentativi = 0; tentativi < 40; tentativi++) {
      const [nome] = prossimo(), car = carattere();
      const testo = nome.toLocaleUpperCase('it'), sz = base * car.k;
      const w = misuraTesto(testo, sz, car);
      const serve = (riga.length ? gapMin : 0) + w;
      if (usato + serve > W - 2 * MARGINE) { if (riga.length >= 2) break; else continue; }
      riga.push({ testo, sz, car, w }); usato += serve;
    }
    // prima si ingrandisce un poco la riga (max +18%), poi lo spazio avanzato si divide tra le parole
    const somma = riga.reduce((s, p) => s + p.w, 0);
    const f = Math.min(1.18, (W - 2 * MARGINE - gapMin * (riga.length - 1)) / somma);
    if (f > 1) { riga.forEach(p => { p.sz *= f; p.w *= f; }); usato = somma * f + gapMin * (riga.length - 1); }
    const alto = base * 0.98 * Math.max(1, f);
    const avanzo = W - 2 * MARGINE - usato;
    const gap = gapMin + (riga.length > 1 ? avanzo / (riga.length - 1) : 0);
    let x = MARGINE + (riga.length > 1 ? 0 : avanzo / 2);
    for (const p of riga) {
      const d = r();
      let col, op;
      if (t < 0.45 && d < 0.14) { col = '#7E0A1E'; op = 0.18 + 0.22 * (1 - t); }
      else if (t < 0.55 && d < 0.25) { col = '#FFE2A8'; op = 0.62 + 0.33 * (1 - t); }
      else { col = '#FFFFFF'; op = 0.42 + 0.50 * (1 - t); }
      const ritardo = Math.round(t * 900 + r() * 250);
      parti.push(`<span style="left:${Math.round(x)}px;top:${Math.round(y - alto)}px;font:${p.car.s} ${p.car.w} ${p.sz.toFixed(1)}px/${(alto / p.sz).toFixed(2)} '${p.car.f}',sans-serif;`
        + `color:${col};--op:${op.toFixed(2)};opacity:${op.toFixed(2)};animation-delay:${ritardo}ms;--rot:rotate(0deg)">${p.testo}</span>`);
      x += p.w + gap;
    }
    y -= alto + base * 0.16;
  }
  el.innerHTML = parti.join('');
}

// Trama "che sale": i Principi partono dal fondo, salgono lentamente e svaniscono in alto.
// Grandi = vicine (piene, più veloci); piccole = lontane (tenui, più lente). Due caratteri, in maiuscolo.
const CARATTERI_SALITA = [
  { f: 'Archivo Black', w: 400, s: 'normal', k: 0.9 },
  { f: 'DM Serif Display', w: 400, s: 'italic', k: 1.12 }
];
function disegnaPrincipiSalita(el) {
  const r = casuale(41), prossimo = sacchetto(r, PRINCIPI), carattere = sacchetto(r, CARATTERI_SALITA);
  const { W, H } = misura(el);
  const telefono = W < 600;
  const quante = Math.round(Math.min(38, Math.max(16, W * H / (telefono ? 17000 : 30000))));
  // corsie: ogni parola parte da una posizione orizzontale diversa, mescolate
  const corsie = Array.from({ length: quante }, (_, i) => (i + r() * 0.8) / quante);
  for (let i = corsie.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [corsie[i], corsie[j]] = [corsie[j], corsie[i]]; }
  const parti = [];
  for (let i = 0; i < quante; i++) {
    const vicino = Math.pow(r(), 2.1);                        // 0 lontano … 1 vicino (poche parole vicine)
    const car = carattere(), [nome] = prossimo();
    const sz = (telefono ? 13 + 30 * vicino : 17 + 50 * vicino) * car.k;
    const durata = (34 - 16 * vicino) * (0.9 + r() * 0.2);   // secondi per attraversare lo schermo
    const d = r();
    let col = '#FFFFFF', op = 0.38 + 0.55 * vicino;
    if (d < 0.14) { col = '#7E0A1E'; op = 0.22 + 0.25 * vicino; } else if (d < 0.30) col = '#FFE2A8';
    const x = Math.round(corsie[i] * (W + 80) - 80);
    const rot = tra(r, -4, 4);
    parti.push(`<span style="left:${x}px;font:${car.s} ${car.w} ${sz.toFixed(1)}px/1 '${car.f}',sans-serif;color:${col};`
      + `--op:${op.toFixed(2)};--rot:${rot}deg;--da:${Math.round(H + 20)}px;--a:${Math.round(H * 0.08)}px;z-index:${Math.round(vicino * 10)};`
      + `animation-duration:${durata.toFixed(1)}s;animation-delay:-${(r() * durata).toFixed(1)}s">${nome.toLocaleUpperCase('it')}</span>`);
  }
  el.innerHTML = `<div class="flusso">${parti.join('')}</div>`;
}

// Muro che sale: un "nastro" di Principi incastrati liberamente (niente righe) che scorre lentamente verso l'alto
// senza fine. Il nastro è un blocco ripetuto due volte: in basso parte piatto e in alto viene chiuso con parole
// più piccole, così la giuntura tra le due copie non lascia buchi.
async function disegnaMuroCheSale(el) {
  try { await Promise.all(CARATTERI.map(c => document.fonts.load(`${c.s} ${c.w} 24px "${c.f}"`, 'ÀÈ'))); } catch { /* caratteri di riserva */ }
  const r = casuale(57), prossimo = sacchetto(r, PRINCIPI), carattere = sacchetto(r, CARATTERI);
  const { W, H } = misura(el);
  const telefono = W < 600;
  const B = Math.round(Math.max(H, 600) * 1.15);             // altezza del blocco che si ripete
  const ctx = document.createElement('canvas').getContext('2d');
  const largo = (t, sz, c) => { ctx.font = `${c.s} ${c.w} ${sz}px "${c.f}", sans-serif`; return ctx.measureText(t).width; };
  const CELLA = 3, n = Math.ceil(W / CELLA);
  const cielo = new Array(n).fill(B);                        // per colonna: fin dove è pieno, dal basso del blocco
  const [MIN, MAX] = telefono ? [12, 28] : [17, 40];
  const parti = [];
  const metti = (c0, nc, base, h, w, testo, sz, car) => {
    for (let i = c0; i < c0 + nc; i++) cielo[i] = base - h - sz * 0.07;
    const d = r(); let col = '#FFFFFF', op = 0.50 + r() * 0.42;
    if (d < 0.14) { col = '#7E0A1E'; op = 0.22 + r() * 0.2; } else if (d < 0.27) { col = '#FFE2A8'; op = 0.7 + r() * 0.25; }
    parti.push(`<span style="left:${Math.round(c0 * CELLA)}px;top:${Math.round(base - h)}px;font:${car.s} ${car.w} ${sz.toFixed(1)}px/0.94 '${car.f}',sans-serif;color:${col};opacity:${op.toFixed(2)}">${testo}</span>`);
  };
  // trova il punto più basso con il "pavimento" più piatto per una parola larga nc colonne
  const cerca = (nc, sz) => {
    let meglio = -Infinity, cx = -1, base = 0;
    for (let c = 0; c + nc <= n; c++) {
      let b = Infinity, v = 0;
      for (let i = c; i < c + nc; i++) if (cielo[i] < b) b = cielo[i];
      for (let i = c; i < c + nc; i++) v += cielo[i] - b;
      const p = b - 1.6 * v / nc + r() * sz * 0.3;
      if (p > meglio) { meglio = p; cx = c; base = b; }
    }
    return { cx, base };
  };
  // 1) riempimento: parole di grandezza mista finché il blocco è quasi pieno
  for (let k = 0; k < 4000; k++) {
    const media = cielo.reduce((s, x) => s + x, 0) / n;
    if (media < MAX * 1.6) break;
    const [nome] = prossimo(), car = carattere(), testo = nome.toLocaleUpperCase('it');
    const sz = (MIN + (MAX - MIN) * Math.pow(r(), 1.3)) * car.k;
    const w = largo(testo, sz, car), h = sz * 0.94, nc = Math.min(n, Math.ceil(w / CELLA));
    const { cx, base } = cerca(nc, sz);
    if (cx < 0 || base - h < 0) continue;
    metti(cx, nc, base, h, w, testo, sz, car);
  }
  // 2) chiusura in alto: si cerca la colonna con più spazio libero e la si riempie con una parola su misura,
  //    finché restano solo fessure di pochi pixel (così la giuntura tra le due copie non si vede)
  for (let k = 0; k < 6000; k++) {
    let c0 = 0; for (let c = 1; c < n; c++) if (cielo[c] > cielo[c0]) c0 = c;
    if (cielo[c0] < 9) break;
    const [nome] = prossimo(), car = carattere(), testo = nome.toLocaleUpperCase('it');
    let sz = Math.min(MAX * car.k, (cielo[c0] - 1) / 1.01), fatto = false;
    for (let giro = 0; giro < 4 && sz >= 8; giro++) {
      const w = largo(testo, sz, car), nc = Math.min(n, Math.ceil(w / CELLA));
      // tra le posizioni che coprono la colonna c0, quella con il pavimento più basso
      let base = -Infinity, cx = -1;
      for (let c = Math.max(0, c0 - nc + 1); c <= Math.min(c0, n - nc); c++) {
        let b = Infinity; for (let i = c; i < c + nc; i++) if (cielo[i] < b) b = cielo[i];
        if (b > base) { base = b; cx = c; }
      }
      const h = sz * 0.94;
      if (cx >= 0 && base - h - sz * 0.07 >= -1) { metti(cx, nc, base, h, w, testo, sz, car); fatto = true; break; }
      sz = Math.min(sz * 0.8, (base - 1) / 1.01);
    }
    if (!fatto) cielo[c0] = Math.min(cielo[c0], 8); // qui non entra niente: si lascia la fessura
  }
  const blocco = parti.join('');
  const durata = Math.round(B / (telefono ? 9 : 11));         // pochi pixel al secondo: movimento lento
  el.innerHTML = `<div class="flusso"><div class="nastro" style="height:${2 * B}px;--b:${B}px;animation-duration:${durata}s">`
    + `<div class="blocco" style="height:${B}px">${blocco}</div><div class="blocco" style="height:${B}px;top:${B}px">${blocco}</div></div></div>`;
}

// Trama bianca: i Principi nei loro colori, in maiuscolo con caratteri misti, incastrati a caso dal basso
// (grandezze simili, pochi vuoti, niente parole tagliate) e sempre più tenui salendo, fino a sparire.
async function disegnaPrincipiBianchi(el) {
  try { await Promise.all(CARATTERI.map(c => document.fonts.load(`${c.s} ${c.w} 24px "${c.f}"`, 'ÀÈ'))); } catch { /* caratteri di riserva */ }
  const r = casuale(73), prossimo = sacchetto(r, PRINCIPI), carattere = sacchetto(r, CARATTERI);
  const { W, H } = misura(el);
  const telefono = W < 600;
  const ctx = document.createElement('canvas').getContext('2d');
  const largo = (t, sz, c) => { ctx.font = `${c.s} ${c.w} ${sz}px "${c.f}", sans-serif`; return ctx.measureText(t).width; };
  const CELLA = 3, n = Math.ceil(W / CELLA);
  const cielo = new Array(n).fill(H - 2);
  const parti = [];
  let ultimoColore = null;
  const sotto = new Array(n).fill('');                         // ultima parola posata in ogni colonna
  for (let k = 0; k < 5000; k++) {
    const media = cielo.reduce((s, x) => s + x, 0) / n;
    if (media < H * 0.08) break;
    const t = Math.min(1, Math.max(0, (H - media) / H));        // 0 in basso, 1 in alto
    let [nome, colore] = prossimo();
    if (colore === ultimoColore) [nome, colore] = prossimo();  // due colori uguali di fila: si cambia
    ultimoColore = colore;
    const car = carattere(), testo = nome.toLocaleUpperCase('it');
    const sz = Math.max(9, ((telefono ? 26 : 36) - (telefono ? 15 : 21) * Math.pow(t, 0.9)) * (0.85 + r() * 0.3)) * car.k;
    const verticale = sz > 16 && r() < 0.04;
    const lt = largo(testo, sz, car), alto = sz * 0.94;
    const w = verticale ? alto : lt, h = verticale ? lt : alto;
    const nc = Math.min(n, Math.ceil(w / CELLA));
    // punto più basso con il "pavimento" più piatto, con un po' di caso; mai sopra la stessa parola
    let meglio = -Infinity, cx = -1, base = 0;
    for (let c = 0; c + nc <= n; c++) {
      let b = Infinity, v = 0, uguali = 0;
      for (let i = c; i < c + nc; i++) if (cielo[i] < b) b = cielo[i];
      for (let i = c; i < c + nc; i++) { v += cielo[i] - b; if (sotto[i] === nome) uguali++; }
      const p = b - 1.5 * v / nc + r() * sz * 0.35 - (uguali / nc) * sz * 2.5;
      if (p > meglio) { meglio = p; cx = c; base = b; }
    }
    if (cx < 0) break;
    const y = base - h - sz * 0.06;
    for (let i = cx; i < cx + nc; i++) { cielo[i] = y; sotto[i] = nome; }
    const op = 0.30 + 0.62 * Math.pow(1 - t, 1.2);              // accese in basso, tenui salendo
    const ritardo = Math.round(t * 700 + r() * 200);
    parti.push(`<span style="left:${Math.round(cx * CELLA)}px;top:${Math.round(y)}px;font:${car.s} ${car.w} ${sz.toFixed(1)}px/0.94 '${car.f}',sans-serif;`
      + `color:${colore};--op:${op.toFixed(2)};opacity:${op.toFixed(2)};animation-delay:${ritardo}ms;`
      + (verticale ? '--rot:rotate(180deg);writing-mode:vertical-rl;transform:rotate(180deg)' : `--rot:rotate(${tra(r, -2, 2)}deg);transform:rotate(0deg)`) + `">${testo}</span>`);
  }
  el.innerHTML = parti.join('');
}

// Trama obliqua: come la trama di sempre (parole sparse e inclinate che sfumano salendo), ma piena.
// Metodo "nuvola di parole": si posano prima le parole grandi (in basso), poi sempre più piccole che riempiono
// i buchi; ogni parola ha la sua inclinazione e non tocca le altre (controllo su una griglia di pixel).
async function disegnaTramaObliqua(el) {
  try { await Promise.all(CARATTERI.map(c => document.fonts.load(`${c.s} ${c.w} 24px "${c.f}"`, 'ÀÈ'))); } catch { /* caratteri di riserva */ }
  const r = casuale(91), prossimo = sacchetto(r, PRINCIPI), carattere = sacchetto(r, CARATTERI);
  const { W, H } = misura(el);
  const telefono = W < 600, scala = telefono ? 0.7 : 1;
  const ctx = document.createElement('canvas').getContext('2d');
  const largo = (t, sz, c) => { ctx.font = `${c.s} ${c.w} ${sz}px "${c.f}", sans-serif`; return ctx.measureText(t).width; };
  const G = 3, gw = Math.ceil(W / G), gh = Math.ceil(H / G);
  const occupato = new Uint8Array(gw * gh);
  const ALTO = H * 0.12;                                       // sopra questa quota non si mette niente
  // grandezza massima consentita a una certa altezza: grandi in basso, piccole in alto
  const massimo = y => (14 + 34 * Math.pow(Math.max(0, (y - ALTO) / (H - ALTO)), 1.4)) * scala;
  const angolo = () => { const d = r(); return d < 0.07 ? (r() < 0.5 ? -90 : 90) : d < 0.22 ? (r() < 0.5 ? -1 : 1) * (28 + r() * 14) : -20 + r() * 40; };
  // celle coperte da un rettangolo ruotato (centro cx,cy; lati w,h; angolo a), con un piccolo margine
  const celle = (cx, cy, w, h, a) => {
    const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180), m = 1.5;
    const ex = Math.abs(c) * w / 2 + Math.abs(s) * h / 2 + m, ey = Math.abs(s) * w / 2 + Math.abs(c) * h / 2 + m;
    const x0 = Math.max(0, Math.floor((cx - ex) / G)), x1 = Math.min(gw - 1, Math.ceil((cx + ex) / G));
    const y0 = Math.max(0, Math.floor((cy - ey) / G)), y1 = Math.min(gh - 1, Math.ceil((cy + ey) / G));
    const L = [];
    for (let gy = y0; gy <= y1; gy++) for (let gx = x0; gx <= x1; gx++) {
      const dx = gx * G + G / 2 - cx, dy = gy * G + G / 2 - cy;
      const u = dx * c + dy * s, v = -dx * s + dy * c;            // coordinate nel sistema della parola
      if (Math.abs(u) <= w / 2 + m && Math.abs(v) <= h / 2 + m) L.push(gy * gw + gx);
    }
    return L;
  };
  const parti = [];
  // grandezze dalla più grande alla più piccola; per ciascuna molti tentativi in posizioni a caso
  const GRANDEZZE = [46, 38, 32, 27, 23, 19, 16, 13, 11, 9];
  const uso = Object.fromEntries(PRINCIPI.map(([p]) => [p, 0]));
  for (const g of GRANDEZZE) {
    const sz0 = g * scala;
    const tentativi = Math.round((W * H) / (sz0 * sz0 * 0.35));
    // la stessa parola riprova in più punti prima di passare alla successiva: così i sette Principi
    // restano bilanciati (altrimenti le parole corte, che entrano ovunque, diventano troppe)
    // si sceglie sempre il Principio usato meno finora (le parole lunghe, se non entrano, si restringono un po')
    let attuale = null, prove = 0;
    const esauriti = new Set();
    for (let k = 0; k < tentativi; k++) {
      if (!attuale || prove >= 160) {
        if (attuale) esauriti.add(attuale[0]);
        const minTutti = Math.min(...PRINCIPI.map(([p]) => uso[p]));
        // tetto: nessun Principio può superare di molto quello usato meno
        const liberi = PRINCIPI.filter(([p]) => !esauriti.has(p) && uso[p] <= minTutti * 1.35 + 3);
        if (!liberi.length) break;
        const min = Math.min(...liberi.map(([p]) => uso[p]));
        const candidati = liberi.filter(([p]) => uso[p] === min);
        attuale = [...candidati[Math.floor(r() * candidati.length)], carattere()]; prove = 0;
      }
      prove++;
      const cy = ALTO + r() * (H - ALTO + sz0 * 0.3);
      if (sz0 > massimo(cy) * 1.08) continue;                     // troppo grande per quell'altezza
      const cx = -sz0 + r() * (W + 2 * sz0);
      const [nome, colore, car] = attuale;
      const testo = nome.toLocaleUpperCase('it'), sz = sz0 * car.k * (0.92 + r() * 0.16) * (1 - 0.3 * Math.min(1, prove / 120));
      const w = largo(testo, sz, car), h = sz * 0.8, a = angolo();
      const L = celle(cx, cy, w, h, a);
      if (!L.length || L.some(i => occupato[i])) continue;
      // la parola deve stare quasi tutta nello schermo (si accettano piccoli tagli ai bordi)
      const ex = Math.abs(Math.cos(a * Math.PI / 180)) * w / 2 + Math.abs(Math.sin(a * Math.PI / 180)) * h / 2;
      if (cx - ex < -w * 0.2 || cx + ex > W + w * 0.2 || cy > H + 2) continue;
      L.forEach(i => { occupato[i] = 1; });
      uso[nome]++; attuale = null;
      const t = Math.min(1, Math.max(0, (H - cy) / (H - ALTO)));  // 0 in basso, 1 in alto
      const op = 0.20 + 0.52 * Math.pow(1 - t, 1.1);
      const rot = `translate(-50%,-50%) rotate(${a.toFixed(1)}deg)`;
      parti.push(`<span style="left:${Math.round(cx)}px;top:${Math.round(cy)}px;font:${car.s} ${car.w} ${sz.toFixed(1)}px/1 '${car.f}',sans-serif;`
        + `color:${colore};--op:${op.toFixed(2)};opacity:${op.toFixed(2)};--rot:${rot};transform:${rot};animation-delay:${Math.round(t * 700 + r() * 200)}ms">${testo}</span>`);
    }
  }
  el.innerHTML = parti.join('');
}

export const sfondoPrincipi = (stile) => stile === 'trama'
  ? monta('principi trama', disegnaTramaObliqua)
  : stile === 'bianco'
  ? monta('principi bianco', disegnaPrincipiBianchi)
  : stile === 'muro'
  ? (document.body.classList.add('accesso-caldo'), monta('principi salita muro', disegnaMuroCheSale))
  : stile === 'salita'
  ? (document.body.classList.add('accesso-caldo'), monta('principi salita', disegnaPrincipiSalita))
  : stile === 'caldo'
  ? (document.body.classList.add('accesso-caldo'), monta('principi caldo', disegnaPrincipiCaldi))
  : monta(stile === 'fitti' ? 'principi fitti' : 'principi', stile === 'fitti' ? disegnaPrincipiFitti : disegnaPrincipi);
export const sfondoAttrezzature = () => monta('attrezzature', disegnaAttrezzature);
export const sfondoSimboli = () => monta('simboli', disegnaSimboli);
