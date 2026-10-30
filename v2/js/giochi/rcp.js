// Ritmo RCP: 30 tocchi come 30 compressioni. Si misura la frequenza (obiettivo 100-120/min) e la regolarità.
import { vibra } from './comune.js';
import { argomentoRcp } from './catalogo.js';

export const ripeti = true;
const N = 30, MIN = 100, MAX = 120;
export const regole = `<ul>
  <li>Tocca il cerchio <strong>${N} volte</strong>, come se fossero ${N} compressioni toraciche.</li>
  <li>L'obiettivo è una frequenza tra <strong>${MIN} e ${MAX} al minuto</strong>, con un ritmo regolare.</li>
  <li>Con il <strong>metronomo</strong> ti alleni a sentire il ritmo (partita di prova, non salvata). Senza metronomo la partita conta.</li>
  <li>Punti = percentuale di compressioni nel ritmo giusto, +20 se la frequenza media è corretta.</li></ul>`;

const bpm = ms => 60000 / ms;
const mediana = a => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

export function gioca({ campo, hud, categorie }) {
  const cat = argomentoRcp(categorie);
  return new Promise(risolvi => {
    campo.innerHTML = `<div class="card rcp-area">
        <div class="schede" role="tablist" style="max-width:360px;margin:0 auto 10px">
          <button type="button" class="attiva" id="rcpSenza">Senza aiuti</button><button type="button" id="rcpCon">Con metronomo</button></div>
        <p class="nota" id="rcpNota">Comincia a toccare quando sei pronto: il tempo parte dal primo tocco.</p>
        <button class="rcp-bottone" type="button" id="rcpBtn" aria-label="Compressione"><span class="conta" id="rcpConta">0</span><span>di ${N}</span></button>
        <div class="tachimetro"><div class="ago" id="rcpAgo" style="left:0%"></div></div>
        <div class="tachimetro-scala"><span>60</span><span>100</span><span>120</span><span>180</span></div>
        <div class="bpm" id="rcpBpm">–</div><div class="nota" id="rcpConsiglio">compressioni al minuto</div></div>`;
    const $ = s => campo.querySelector(s);
    let tocchi = [], metronomo = false, audio = null, tick = null;
    hud.aggiorna({ extraLab: 'Compressioni', extra: `0/${N}` });
    const scegli = m => {
      if (tocchi.length) return;
      metronomo = m;
      $('#rcpCon').classList.toggle('attiva', m); $('#rcpSenza').classList.toggle('attiva', !m);
      $('#rcpNota').textContent = m ? 'Segui il bip (110 al minuto). Questa partita è di prova e non viene salvata.' : 'Comincia a toccare quando sei pronto: il tempo parte dal primo tocco.';
      clearInterval(tick); tick = null;
      if (m) avviaMetronomo();
    };
    function avviaMetronomo() {
      try {
        audio = audio || new (window.AudioContext || window.webkitAudioContext)();
        const bip = () => { const o = audio.createOscillator(), g = audio.createGain(); o.frequency.value = 880; g.gain.value = .15;
          o.connect(g); g.connect(audio.destination); o.start(); o.stop(audio.currentTime + .05); };
        bip(); tick = setInterval(bip, 60000 / 110);
      } catch { $('#rcpNota').textContent = 'Audio non disponibile su questo dispositivo.'; }
    }
    $('#rcpSenza').onclick = () => scegli(false);
    $('#rcpCon').onclick = () => scegli(true);
    const btn = $('#rcpBtn');
    const premi = ev => {
      ev.preventDefault();
      if (tocchi.length >= N) return;
      tocchi.push(performance.now());
      vibra(15);
      btn.classList.add('premuto'); setTimeout(() => btn.classList.remove('premuto'), 70);
      $('#rcpConta').textContent = tocchi.length;
      hud.aggiorna({ extra: `${tocchi.length}/${N}` });
      if (tocchi.length >= 3) {
        const ult = tocchi.slice(-5), iv = ult.slice(1).map((t, i) => t - ult[i]);
        const f = Math.round(bpm(iv.reduce((s, x) => s + x, 0) / iv.length));
        $('#rcpBpm').textContent = f;
        $('#rcpAgo').style.left = Math.max(0, Math.min(100, (f - 60) / 120 * 100)) + '%';
        $('#rcpConsiglio').textContent = f < MIN ? 'Più veloce!' : f > MAX ? 'Più lento!' : 'Ritmo giusto';
        $('#rcpConsiglio').style.color = f < MIN || f > MAX ? 'var(--red)' : 'var(--green)';
      }
      if (tocchi.length === N) termina();
    };
    btn.addEventListener('pointerdown', premi);
    btn.addEventListener('keydown', ev => { if (ev.key === ' ' || ev.key === 'Enter') premi(ev); });
    function termina() {
      clearInterval(tick);
      const iv = tocchi.slice(1).map((t, i) => t - tocchi[i]);
      const freq = Math.round(bpm(mediana(iv)));
      const nelRitmo = iv.filter(x => bpm(x) >= MIN && bpm(x) <= MAX).length;
      const pct = Math.round(nelRitmo / iv.length * 100);
      const media = iv.reduce((s, x) => s + x, 0) / iv.length;
      const cv = Math.round(Math.sqrt(iv.reduce((s, x) => s + (x - media) ** 2, 0) / iv.length) / media * 100);
      const freqOk = freq >= MIN && freq <= MAX, regolare = pct >= 70;
      const punti = pct + (freqOk ? 20 : 0);
      const risposte = metronomo ? [] : [
        { id: 'g:rcp:frequenza', scelta: null, esatta: freqOk, cat, det: freq },
        { id: 'g:rcp:regolarita', scelta: null, esatta: regolare, cat, det: pct }
      ];
      const ripasso = [];
      if (!freqOk) ripasso.push({ testo: 'Frequenza delle compressioni', tua: `La tua frequenza: ${freq}/min (${freq < MIN ? 'troppo lenta' : 'troppo veloce'})`, giusta: `Obiettivo: ${MIN}-${MAX}/min`,
        spieg: 'Un trucco: molti usano il ritmo di una canzone a circa 110 battiti, oppure si allenano con il metronomo.' });
      if (!regolare) ripasso.push({ testo: 'Regolarità del ritmo', tua: `Solo il ${pct}% delle compressioni era nel ritmo giusto (variabilità ${cv}%)`, giusta: 'Obiettivo: almeno il 70% delle compressioni tra 100 e 120/min' });
      setTimeout(() => risolvi({ risposte, punti, ripasso, nonSalvare: metronomo,
        titolo: freqOk ? `Frequenza media ${freq}/min: ottimo!` : `Frequenza media ${freq}/min`, nota: `${pct}% delle compressioni nel ritmo giusto` }), 400);
    }
  });
}
