// Service worker del Portale Formazione: rende più veloci le aperture successive.
// - Librerie Firebase, font e librerie esterne (indirizzi con versione, non cambiano mai): dalla cache.
// - Immagini del portale: dalla cache, aggiornate in background.
// - Pagine, stili e script del portale: sempre dalla rete (così gli aggiornamenti arrivano subito),
//   con la copia in cache solo se la rete manca.
// - I dati (Firestore, accesso) non passano mai da qui.
const CACHE = 'portale-v1';
const ESTERNI = ['https://www.gstatic.com/firebasejs/', 'https://fonts.googleapis.com/', 'https://fonts.gstatic.com/', 'https://cdnjs.cloudflare.com/'];

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', ev => ev.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
  await self.clients.claim();
})()));

self.addEventListener('fetch', ev => {
  const req = ev.request;
  if (req.method !== 'GET') return;
  const url = req.url;
  if (ESTERNI.some(p => url.startsWith(p))) return ev.respondWith(primaCache(req));
  if (new URL(url).origin !== self.location.origin) return; // Firestore, autenticazione, ecc.
  if (/\/img\//.test(url)) return ev.respondWith(cacheEAggiorna(req, ev));
  ev.respondWith(primaRete(req));
});

async function primaCache(req) {
  const c = await caches.open(CACHE);
  const salvata = await c.match(req);
  if (salvata) return salvata;
  const r = await fetch(req);
  if (r.ok || r.type === 'opaque') c.put(req, r.clone());
  return r;
}
async function cacheEAggiorna(req, ev) {
  const c = await caches.open(CACHE);
  const salvata = await c.match(req);
  const rete = fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => salvata);
  if (salvata) { ev.waitUntil(rete); return salvata; }
  return rete;
}
async function primaRete(req) {
  const c = await caches.open(CACHE);
  try {
    const r = await fetch(req, { cache: 'no-cache' });
    if (r.ok) c.put(req, r.clone());
    return r;
  } catch {
    return (await c.match(req, { ignoreSearch: false })) || (await c.match(req, { ignoreSearch: true })) || Response.error();
  }
}
