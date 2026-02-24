/**
 * Sound System — Web Audio API synthesized sounds, no external files.
 * All sounds are generated procedurally so there's zero load time.
 */

let ctx = null;
let soundEnabled = true;

const getCtx = () => {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch {}
  }
  return ctx;
};

export const setSoundEnabled = (v) => { soundEnabled = v; };
export const isSoundEnabled = () => soundEnabled;

const play = (fn) => {
  if (!soundEnabled) return;
  const c = getCtx();
  if (!c) return;
  if (c.state === 'suspended') c.resume();
  try { fn(c); } catch {}
};

// ─── Primitive builders ────────────────────────────────────────────────────

const osc = (c, type, freq, start, duration, gainVal = 0.3, endFreq = null) => {
  const o = c.createOscillator();
  const g = c.createGain();
  o.connect(g); g.connect(c.destination);
  o.type = type;
  o.frequency.setValueAtTime(freq, start);
  if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, start + duration);
  g.gain.setValueAtTime(gainVal, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + duration);
  o.start(start); o.stop(start + duration + 0.05);
};

const noise = (c, start, duration, gainVal = 0.15) => {
  const bufSize = c.sampleRate * duration;
  const buf = c.createBuffer(1, bufSize, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const g = c.createGain();
  src.connect(g); g.connect(c.destination);
  g.gain.setValueAtTime(gainVal, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + duration);
  src.start(start); src.stop(start + duration + 0.05);
};

// ─── Sport-specific sounds ─────────────────────────────────────────────────

// MLB — crack of a bat
export const playBatCrack = () => play((c) => {
  const t = c.currentTime;
  noise(c, t, 0.08, 0.4);
  osc(c, 'sine', 200, t, 0.12, 0.2, 80);
  osc(c, 'square', 120, t + 0.01, 0.15, 0.1, 60);
});

// MLB — ballpark organ sting (ascending chord)
export const playOrganSting = () => play((c) => {
  const t = c.currentTime;
  [523, 659, 784, 1047].forEach((f, i) => {
    osc(c, 'sine', f, t + i * 0.08, 0.5, 0.12);
  });
});

// NBA — swish
export const playSwish = () => play((c) => {
  const t = c.currentTime;
  noise(c, t, 0.18, 0.18);
  osc(c, 'sine', 1800, t, 0.15, 0.05, 400);
});

// NBA — sneaker squeak
export const playSneakerSqueak = () => play((c) => {
  const t = c.currentTime;
  osc(c, 'sawtooth', 800, t, 0.09, 0.07, 1400);
  osc(c, 'sine', 600, t + 0.03, 0.07, 0.06, 900);
});

// NFL — referee whistle
export const playWhistle = () => play((c) => {
  const t = c.currentTime;
  osc(c, 'sine', 2200, t, 0.12, 0.1, 2200);
  osc(c, 'sine', 2400, t + 0.06, 0.15, 0.18, 2100);
  osc(c, 'sine', 2200, t + 0.22, 0.1, 0.08, 2300);
});

// NFL — crowd roar build
export const playCrowdRoar = () => play((c) => {
  const t = c.currentTime;
  for (let i = 0; i < 3; i++) {
    noise(c, t + i * 0.1, 0.4 + i * 0.15, 0.05 + i * 0.06);
  }
  osc(c, 'sine', 80, t, 0.7, 0.4, 120);
});

// NFL — deep stadium thud
export const playThud = () => play((c) => {
  const t = c.currentTime;
  osc(c, 'sine', 80, t, 0.18, 0.35, 30);
  noise(c, t, 0.06, 0.2);
});

// NHL — puck hitting boards
export const playPuckHit = () => play((c) => {
  const t = c.currentTime;
  noise(c, t, 0.1, 0.35);
  osc(c, 'sine', 300, t, 0.1, 0.15, 100);
});

// NHL — horn blast
export const playHorn = () => play((c) => {
  const t = c.currentTime;
  osc(c, 'sawtooth', 220, t, 0.55, 0.22, 220);
  osc(c, 'square', 330, t, 0.55, 0.10, 330);
  osc(c, 'sine', 110, t, 0.55, 0.18, 110);
});

// NHL — skating transition
export const playSkate = () => play((c) => {
  const t = c.currentTime;
  for (let i = 0; i < 4; i++) {
    noise(c, t + i * 0.06, 0.05, 0.12);
  }
});

// Generic — success chime
export const playSuccess = () => play((c) => {
  const t = c.currentTime;
  [523, 659, 784].forEach((f, i) => osc(c, 'sine', f, t + i * 0.1, 0.35, 0.15));
});

// Generic — buzzer (impostor escaped)
export const playBuzzer = () => play((c) => {
  const t = c.currentTime;
  osc(c, 'square', 180, t, 0.3, 0.18, 160);
  osc(c, 'sawtooth', 90, t + 0.05, 0.3, 0.12, 80);
});

// Generic — button tap
export const playTap = () => play((c) => {
  const t = c.currentTime;
  osc(c, 'sine', 440, t, 0.06, 0.08, 300);
});

// Generic — card reveal pop
export const playPop = () => play((c) => {
  const t = c.currentTime;
  osc(c, 'sine', 700, t, 0.08, 0.12, 500);
  osc(c, 'sine', 1000, t + 0.04, 0.06, 0.08, 800);
});

// ─── Sport-adaptive helpers ────────────────────────────────────────────────

export const getLeague = (leagues = []) => {
  if (leagues.length === 1) return leagues[0];
  return 'MULTI';
};

export const playConfirmation = (leagues) => {
  const league = getLeague(leagues);
  if (league === 'MLB') return playBatCrack();
  if (league === 'NBA') return playSwish();
  if (league === 'NFL') return playThud();
  if (league === 'NHL') return playPuckHit();
  return playSuccess();
};

export const playTransition = (leagues) => {
  const league = getLeague(leagues);
  if (league === 'MLB') return playOrganSting();
  if (league === 'NBA') return playSneakerSqueak();
  if (league === 'NFL') return playWhistle();
  if (league === 'NHL') return playSkate();
  return playTap();
};

export const playImpostorReveal = (leagues) => {
  const league = getLeague(leagues);
  if (league === 'NHL') return playHorn();
  if (league === 'NFL') return playCrowdRoar();
  return playBuzzer();
};