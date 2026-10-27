// Piccola cache nel browser per risparmiare letture su Firestore.
// Se l'archiviazione non è disponibile (navigazione privata, spazio pieno) tutto continua a funzionare, solo senza cache.
const PREF = 'cri.';

function leggi(area, chiave) {
  try { const v = area.getItem(PREF + chiave); return v ? JSON.parse(v) : null; } catch { return null; }
}
function scrivi(area, chiave, valore) {
  try { area.setItem(PREF + chiave, JSON.stringify(valore)); return true; }
  catch {
    // spazio pieno: libera i pacchetti più vecchi e riprova una volta
    try { svuotaPacchetti(); area.setItem(PREF + chiave, JSON.stringify(valore)); return true; } catch { return false; }
  }
}
const ora = () => Date.now();

// Valori con scadenza. sessione:true usa sessionStorage (dura finché la scheda è aperta).
export function prendi(chiave, { maxEta = Infinity, sessione = false } = {}) {
  const v = leggi(sessione ? sessionStorage : localStorage, chiave);
  return v && ora() - v.t <= maxEta ? v.d : null;
}
export function metti(chiave, dati, { sessione = false } = {}) {
  return scrivi(sessione ? sessionStorage : localStorage, chiave, { t: ora(), d: dati });
}
export function togli(chiave, { sessione = false } = {}) {
  try { (sessione ? sessionStorage : localStorage).removeItem(PREF + chiave); } catch { /* niente */ }
}

// Timestamp di Firestore → millisecondi (per poterli salvare in JSON) e ritorno
export const aMs = v => v?.toMillis ? v.toMillis() : (typeof v === 'number' ? v : null);

function svuotaPacchetti() {
  try { Object.keys(localStorage).filter(k => k.startsWith(PREF + 'pk.')).forEach(k => localStorage.removeItem(k)); } catch { /* niente */ }
}

// Pulizia al logout: tutto ciò che riguarda l'utente
export function svuotaTutto() {
  try { Object.keys(localStorage).filter(k => k.startsWith(PREF)).forEach(k => localStorage.removeItem(k)); } catch { /* niente */ }
  try { sessionStorage.clear(); } catch { /* niente */ }
}
