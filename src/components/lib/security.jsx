// ─────────────────────────────────────────────────────────────────────────────
// Security utilities — Ball Knowing Impostor
// ─────────────────────────────────────────────────────────────────────────────

// ── Production console suppression ───────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  console.log   = () => {};
  console.warn  = () => {};
  console.debug = () => {};
  // console.error intentionally kept active
}

// ── HTTPS enforcement ─────────────────────────────────────────────────────────
if (typeof window !== 'undefined' &&
    window.location.protocol === 'http:' &&
    window.location.hostname !== 'localhost') {
  window.location.replace('https:' + window.location.href.substring(5));
}

// ── Global error handlers ─────────────────────────────────────────────────────
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    console.error('Unhandled promise rejection:', event.reason);
  });

  window.addEventListener('error', (event) => {
    console.error('Global error:', event.message);
  });
}

// ── Ad visibility guard ───────────────────────────────────────────────────────
if (typeof window !== 'undefined') {
  window._adsEnabled = true;
  document.addEventListener('visibilitychange', () => {
    window._adsEnabled = !document.hidden;
  });
}

// ── Safe localStorage helpers ─────────────────────────────────────────────────
export const safeLocalStorageGet = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const safeLocalStorageSet = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage unavailable (private mode, full, etc.)
  }
};

// ── Input sanitization ────────────────────────────────────────────────────────
export const sanitizeInput = (input) => {
  return String(input)
    .replace(/[<>"'\/\\]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 50);
};

// ── API response validation ───────────────────────────────────────────────────
export const isValidAthleteUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  if (!url.startsWith('https')) return false;
  return /\.(jpg|jpeg|png|webp)(\?.*)?$/i.test(url);
};

export const isValidAthleteName = (name) => {
  return typeof name === 'string' && name.length > 0 && name.length < 100;
};

// ── Session token ─────────────────────────────────────────────────────────────
export const generateSessionToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Store token on module load
if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
  try {
    if (!sessionStorage.getItem('bki_session_token')) {
      sessionStorage.setItem('bki_session_token', generateSessionToken());
    }
  } catch {}
}

export const getSessionToken = () => {
  try {
    return sessionStorage.getItem('bki_session_token');
  } catch {
    return null;
  }
};

export const validateSessionToken = () => {
  try {
    return !!sessionStorage.getItem('bki_session_token');
  } catch {
    return false;
  }
};

// ── Ad click cooldown ─────────────────────────────────────────────────────────
let _lastAdInteraction = 0;

export const canInteractWithAd = () => {
  return Date.now() - _lastAdInteraction >= 1000;
};

export const recordAdInteraction = () => {
  _lastAdInteraction = Date.now();
};