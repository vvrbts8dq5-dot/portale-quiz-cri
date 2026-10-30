// Analisi per il pannello istruttori: trasforma gli esiti (quiz, allenamenti e giochi) in risposte singole
// attribuite a un argomento, e da lì calcola andamenti, mappe e segnali. Nessuna dipendenza da Firebase.

const GIORNO = 86400e3;
export const SOGLIA = 70;
export const FONTI = { quiz: 'Quiz a tempo', allenamento: 'Allenamento e ripasso', gioco: 'Giochi' };
const ms = v => v?.toMillis ? v.toMillis() : (typeof v === 'number' ? v : 0);
export const pct = (ok, n) => n ? Math.round(ok / n * 100) : null;

// Una riga per ogni risposta data. testi: Map id domanda → { categoria, ... } (dai pacchetti pubblicati)
export function espandi(esiti, testi) {
  const out = [];
  for (const e of esiti) {
    const t = ms(e.timestamp);
    const mod = e.modalita || 'quiz';
    const fonte = mod === 'gioco' ? 'gioco' : mod === 'quiz' ? 'quiz' : 'allenamento';
    const catEsito = ['generale', 'giochi'].includes(e.categoria) ? null : e.categoria;
    for (const r of e.risposte || []) {
      const id = String(r.id);
      out.push({ t, uid: e.uid, nome: e.nome, cognome: e.cognome, corso: e.corso, esito: e.id,
        cat: r.cat || testi.get(id)?.categoria || catEsito || '?', id, esatta: !!r.esatta, scelta: r.scelta ?? null, det: r.det ?? null,
        fonte, gioco: e.gioco || null, edizione: e.edizione || '' });
    }
  }
  return out;
}

export function conta(righe, chiave) {
  const m = new Map();
  for (const r of righe) {
    const k = typeof chiave === 'function' ? chiave(r) : r[chiave];
    if (k === null || k === undefined) continue;
    const a = m.get(k) || { n: 0, ok: 0 };
    a.n++; if (r.esatta) a.ok++;
    m.set(k, a);
  }
  return m;
}

// Periodi del grafico: settimane (lunedì) fino a ~6 mesi, poi mesi
export function periodi(da, a) {
  const mensile = a - da > 190 * GIORNO;
  const inizio = t => {
    const d = new Date(t);
    if (mensile) return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
    const g = (d.getDay() + 6) % 7; // lunedì = 0
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() - g).getTime();
  };
  const prossimo = t => { const d = new Date(t); return mensile ? new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime() : new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7).getTime(); };
  const lista = [];
  for (let t = inizio(da); t <= a; t = prossimo(t)) lista.push(t);
  const etichetta = t => mensile ? new Date(t).toLocaleDateString('it-IT', { month: 'short', year: '2-digit' })
    : new Date(t).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
  return { lista, inizio, etichetta, mensile };
}

// Matrice argomento × periodo
export function matrice(righe, categorie, per) {
  const m = new Map(categorie.map(c => [c, new Map(per.lista.map(p => [p, { n: 0, ok: 0 }]))]));
  for (const r of righe) {
    const riga = m.get(r.cat); if (!riga) continue;
    const c = riga.get(per.inizio(r.t)); if (!c) continue;
    c.n++; if (r.esatta) c.ok++;
  }
  return m;
}

// Confronto tra gli ultimi `giorni` e i `giorni` precedenti (rispetto a `ora`)
export function tendenza(righe, ora, giorni = 14) {
  const a = ora - giorni * GIORNO, b = a - giorni * GIORNO;
  const rec = conta(righe.filter(r => r.t >= a), 'cat');
  const prec = conta(righe.filter(r => r.t >= b && r.t < a), 'cat');
  const out = new Map();
  for (const [cat, x] of rec) {
    const y = prec.get(cat);
    if (!y || x.n < 15 || y.n < 15) continue;
    out.set(cat, { ora: pct(x.ok, x.n), prima: pct(y.ok, y.n), delta: pct(x.ok, x.n) - pct(y.ok, y.n), n: x.n, nPrima: y.n });
  }
  return out;
}

// Domande dei quiz: errore frequente e "convinzione sbagliata" (tutti sbagliano allo stesso modo)
export function domandeCritiche(righe, testi, min = 5) {
  const m = new Map();
  for (const r of righe) {
    if (r.id.startsWith('g:')) continue;
    const a = m.get(r.id) || { id: r.id, n: 0, err: 0, scelte: {}, fonti: {} };
    a.n++;
    if (!r.esatta) { a.err++; const k = r.scelta === null ? '–' : r.scelta; a.scelte[k] = (a.scelte[k] || 0) + 1; a.fonti[r.fonte] = (a.fonti[r.fonte] || 0) + 1; }
    m.set(r.id, a);
  }
  return [...m.values()].filter(a => a.n >= min && a.err > 0).map(a => {
    const top = Object.entries(a.scelte).sort((x, y) => y[1] - x[1])[0];
    const q = testi.get(a.id);
    return { ...a, p: pct(a.err, a.n), cat: q?.categoria || null, q,
      sbagliataTop: top ? (top[0] === '–' ? 'nessuna risposta' : q?.opzioni?.[+top[0]] ?? '?') : '',
      quotaTop: top ? Math.round(top[1] / a.err * 100) : 0 };
  }).sort((x, y) => y.p - x.p || y.n - x.n);
}

// Elementi propri dei giochi, per tipo
export function analisiGiochi(righe) {
  const g = righe.filter(r => r.id.startsWith('g:'));
  const per = tipo => g.filter(r => r.id.startsWith(`g:${tipo}:`));
  // Sequenze: passaggi messi fuori posto (det = posizioni corrette dei passi spostati, da 1)
  const seq = new Map();
  for (const r of per('ordina')) {
    const id = r.id.split(':')[2];
    const s = seq.get(id) || { id, n: 0, ok: 0, passi: {} };
    s.n++; if (r.esatta) s.ok++;
    String(r.det || '').split(',').filter(Boolean).forEach(p => s.passi[p] = (s.passi[p] || 0) + 1);
    seq.set(id, s);
  }
  // Triage: per ramo dell'algoritmo, con il codice sbagliato più scelto
  const tri = new Map();
  for (const r of per('triage')) {
    const ramo = r.id.split(':')[2];
    const t = tri.get(ramo) || { ramo, n: 0, ok: 0, scelte: {} };
    t.n++; if (r.esatta) t.ok++; else if (r.scelta) t.scelte[r.scelta] = (t.scelte[r.scelta] || 0) + 1;
    tri.set(ramo, t);
  }
  // RCP: frequenze misurate
  const freq = per('rcp').filter(r => r.id === 'g:rcp:frequenza' && r.det !== null).map(r => +r.det).filter(Number.isFinite);
  const rcp = freq.length ? { n: freq.length, media: Math.round(freq.reduce((s, x) => s + x, 0) / freq.length),
    lente: freq.filter(x => x < 100).length, giuste: freq.filter(x => x >= 100 && x <= 120).length, veloci: freq.filter(x => x > 120).length } : null;
  // Elementi singoli (anatomia, caso, completa, abbina): tasso di errore
  const elementi = [...conta(g.filter(r => !r.id.startsWith('g:rcp') && !r.id.startsWith('g:triage') && !r.id.startsWith('g:ordina')), 'id')]
    .map(([id, a]) => ({ id, ...a, p: pct(a.n - a.ok, a.n) })).filter(x => x.n >= 3 && x.p > 0).sort((a, b) => b.p - a.p);
  // Partite per gioco
  return { seq: [...seq.values()], tri: [...tri.values()], rcp, elementi };
}

export function partitePerGioco(esiti) {
  const m = new Map();
  for (const e of esiti) {
    if (e.modalita !== 'gioco') continue;
    const a = m.get(e.gioco) || { gioco: e.gioco, partite: 0, giocatori: new Set(), punti: 0, n: 0, ok: 0 };
    a.partite++; a.giocatori.add(e.uid); a.punti += e.punti || 0; a.n += e.numeroDomande || 0; a.ok += e.corrette || 0;
    m.set(e.gioco, a);
  }
  return [...m.values()].map(a => ({ ...a, giocatori: a.giocatori.size, mediaPunti: Math.round(a.punti / a.partite), p: pct(a.ok, a.n) }))
    .sort((a, b) => b.partite - a.partite);
}

// Volontari × argomenti
export function mappaVolontari(righe) {
  const m = new Map();
  for (const r of righe) {
    const v = m.get(r.uid) || { uid: r.uid, nome: r.nome, cognome: r.cognome, n: 0, ok: 0, cat: new Map(), ultimo: 0, fonti: new Set() };
    v.n++; if (r.esatta) v.ok++; v.ultimo = Math.max(v.ultimo, r.t); v.fonti.add(r.fonte);
    const c = v.cat.get(r.cat) || { n: 0, ok: 0 }; c.n++; if (r.esatta) c.ok++; v.cat.set(r.cat, c);
    m.set(r.uid, v);
  }
  return [...m.values()].map(v => ({ ...v, p: pct(v.ok, v.n),
    deboli: [...v.cat].filter(([, c]) => c.n >= 8 && pct(c.ok, c.n) < 60).map(([k]) => k) }));
}

// Segnali automatici: cosa merita l'attenzione dell'istruttore
// nomi: Map argomento → nome; descr: funzione id elemento gioco → descrizione
export function segnali({ righe, categorie, nomi, testi, ora, descr }) {
  const out = [];
  const nome = c => nomi.get(c) || c;
  const perCat = conta(righe, 'cat');
  const tot = righe.length;
  if (!tot) return out;

  // 1. argomenti sotto soglia
  const sotto = categorie.map(c => ({ c, ...(perCat.get(c) || { n: 0, ok: 0 }) })).filter(x => x.n >= 20 && pct(x.ok, x.n) < SOGLIA)
    .sort((a, b) => pct(a.ok, a.n) - pct(b.ok, b.n));
  for (const x of sotto.slice(0, 3)) out.push({ livello: pct(x.ok, x.n) < 55 ? 'alto' : 'medio', cat: x.c,
    titolo: `${nome(x.c)}: ${pct(x.ok, x.n)}% di risposte giuste`, testo: `Sotto la soglia del ${SOGLIA}% su ${x.n} risposte. È un buon candidato per una lezione di ripasso.` });

  // 2. andamenti: peggioramenti e miglioramenti nelle ultime due settimane
  for (const [c, t] of tendenza(righe, ora)) {
    if (t.delta <= -8) out.push({ livello: 'alto', cat: c, titolo: `${nome(c)} in calo: da ${t.prima}% a ${t.ora}%`,
      testo: `Confronto tra le ultime due settimane (${t.n} risposte) e le due precedenti (${t.nPrima}).` });
    else if (t.delta >= 8) out.push({ livello: 'buono', cat: c, titolo: `${nome(c)} in crescita: da ${t.prima}% a ${t.ora}%`,
      testo: 'Le ultime due settimane vanno meglio delle due precedenti.' });
  }

  // 3. convinzioni sbagliate: tanti errori tutti sulla stessa risposta
  const crit = domandeCritiche(righe, testi).filter(d => d.p >= 40 && d.quotaTop >= 60 && d.err >= 4 && d.sbagliataTop !== 'nessuna risposta');
  for (const d of crit.slice(0, 3)) out.push({ livello: 'alto', cat: d.cat, idDomanda: d.id,
    titolo: `Convinzione sbagliata diffusa (${d.p}% di errori)`,
    testo: `«${(d.q?.testo || '').slice(0, 140)}» — il ${d.quotaTop}% di chi sbaglia risponde «${d.sbagliataTop}». Vale la pena chiarirlo in aula (o verificare che la domanda sia corretta).` });

  // 4. giochi: passaggi delle sequenze e rami del triage
  const g = analisiGiochi(righe);
  for (const s of g.seq) {
    if (s.n < 4) continue;
    const [passo, volte] = Object.entries(s.passi).sort((a, b) => b[1] - a[1])[0] || [];
    if (passo && volte / s.n >= 0.35) out.push({ livello: 'medio', titolo: `Sequenza: un passaggio messo spesso fuori posto`,
      testo: `${descr('g:ordina:' + s.id)} — il passo n° ${passo} è fuori posto nel ${Math.round(volte / s.n * 100)}% dei tentativi (${s.n}).`, passo: { seq: s.id, n: +passo } });
  }
  for (const t of g.tri) {
    if (t.n >= 4 && pct(t.ok, t.n) < 60) out.push({ livello: 'medio', titolo: `Triage START: ${pct(t.ok, t.n)}% di codici giusti in un ramo`,
      testo: `${descr('g:triage:' + t.ramo)}. Codice sbagliato più assegnato: ${Object.entries(t.scelte).sort((a, b) => b[1] - a[1])[0]?.[0] || '–'}.` });
  }
  if (g.rcp && g.rcp.n >= 5) {
    const fuori = g.rcp.lente + g.rcp.veloci;
    if (fuori / g.rcp.n >= 0.4) out.push({ livello: 'medio', titolo: `Ritmo RCP: ${Math.round(fuori / g.rcp.n * 100)}% fuori frequenza`,
      testo: `Frequenza media ${g.rcp.media}/min su ${g.rcp.n} prove: ${g.rcp.lente} troppo lente, ${g.rcp.veloci} troppo veloci.` });
  }

  // 5. volontari da seguire
  const vol = mappaVolontari(righe).filter(v => v.deboli.length >= 2 || (v.n >= 20 && v.p < 60));
  if (vol.length) out.push({ livello: 'medio', titolo: `${vol.length === 1 ? '1 volontario da seguire' : vol.length + ' volontari da seguire'}`,
    testo: vol.slice(0, 6).map(v => `${v.cognome} ${v.nome} (${v.p}%)`).join(', ') + (vol.length > 6 ? '…' : '') + '. Sotto il 60% in almeno due argomenti o in generale.', volontari: vol.map(v => v.uid) });

  // 6. argomenti poco allenati
  if (categorie.length >= 3 && tot >= 60) {
    const poco = categorie.filter(c => (perCat.get(c)?.n || 0) < tot * 0.04);
    if (poco.length) out.push({ livello: 'info', titolo: `Argomenti poco allenati`,
      testo: `${poco.map(nome).join(', ')}: meno del 4% delle risposte del periodo. Potresti invitare i volontari a esercitarsi qui.` });
  }

  // 7. effetto dei giochi: chi gioca va meglio nei quiz?
  const giocatori = new Set(righe.filter(r => r.fonte === 'gioco').map(r => r.uid));
  const quiz = righe.filter(r => r.fonte === 'quiz');
  const qG = quiz.filter(r => giocatori.has(r.uid)), qN = quiz.filter(r => !giocatori.has(r.uid));
  if (qG.length >= 30 && qN.length >= 30) {
    const d = pct(qG.filter(r => r.esatta).length, qG.length) - pct(qN.filter(r => r.esatta).length, qN.length);
    if (Math.abs(d) >= 5) out.push({ livello: d > 0 ? 'buono' : 'info', titolo: d > 0 ? `Chi usa i giochi va meglio nei quiz (+${d} punti)` : `Chi usa i giochi non va meglio nei quiz (${d} punti)`,
      testo: `Percentuale di risposte giuste nei quiz a tempo: volontari che hanno giocato (${giocatori.size}) a confronto con gli altri. È una correlazione, non per forza un effetto dei giochi.` });
  }
  const ordine = { alto: 0, medio: 1, info: 2, buono: 3 };
  return out.sort((a, b) => ordine[a.livello] - ordine[b.livello]);
}
