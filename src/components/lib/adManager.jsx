// ─────────────────────────────────────────────────────────────────────────────
// Ad Manager — AdMob / AdSense integration
// ─────────────────────────────────────────────────────────────────────────────

const AD_CLIENT = 'ca-pub-1818161492484327';
const INTERSTITIAL_SLOT = '4549575204';
const ATT_KEY = 'bki_att_consent';
const ATT_ASKED_KEY = 'bki_att_asked';

// ── App Tracking Transparency (iOS only) ─────────────────────────────────────
export function isIOS() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

export function hasATTConsent() {
  return localStorage.getItem(ATT_KEY) === 'granted';
}

export function hasATTBeenAsked() {
  return localStorage.getItem(ATT_ASKED_KEY) === 'true';
}

export function requestATTConsent(onResult) {
  if (!isIOS() || hasATTBeenAsked()) {
    onResult(true);
    return;
  }

  // Show native-style prompt
  const granted = window.confirm(
    'Allow "Ball Knowing Imposter" to use your activity?\n\nYour data will be used to deliver personalized ads.'
  );

  localStorage.setItem(ATT_ASKED_KEY, 'true');
  localStorage.setItem(ATT_KEY, granted ? 'granted' : 'denied');
  onResult(granted);
}

function getNPA() {
  if (!isIOS()) return false;
  if (!hasATTBeenAsked()) return false;
  return localStorage.getItem(ATT_KEY) !== 'granted';
}

// ── Inject AdSense script once ────────────────────────────────────────────────
let scriptInjected = false;
export function injectAdScript() {
  if (scriptInjected || document.querySelector(`script[data-ad-client="${AD_CLIENT}"]`)) {
    scriptInjected = true;
    return;
  }
  try {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`;
    s.crossOrigin = 'anonymous';
    s.dataset.adClient = AD_CLIENT;
    document.head.appendChild(s);
    scriptInjected = true;
  } catch (e) {
    // fail silently
  }
}

// ── Interstitial ad ───────────────────────────────────────────────────────────
export function showInterstitialAd({ onDone, roundDuration = 0 }) {
  // Frequency cap: skip if round lasted < 60 seconds
  if (roundDuration < 60) {
    onDone();
    return;
  }

  // 3-second timeout failsafe
  const failTimer = setTimeout(() => {
    cleanup();
    onDone();
  }, 3000);

  let cleaned = false;
  function cleanup() {
    if (cleaned) return;
    cleaned = true;
    clearTimeout(failTimer);
    try { container && document.body.removeChild(container); } catch (e) {}
  }

  let container;
  try {
    if (!window.adsbygoogle) {
      onDone();
      return;
    }

    container = document.createElement('div');
    container.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#000;display:flex;align-items:center;justify-content:center;';

    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', AD_CLIENT);
    ins.setAttribute('data-ad-slot', INTERSTITIAL_SLOT);
    ins.setAttribute('data-ad-format', 'autorelaxed');
    ins.setAttribute('data-full-width-responsive', 'true');
    if (getNPA()) ins.setAttribute('data-npa', '1');

    container.appendChild(ins);
    document.body.appendChild(container);

    (window.adsbygoogle = window.adsbygoogle || []).push({});

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      cleanup();
      onDone();
    }, 5000);

  } catch (e) {
    cleanup();
    onDone();
  }
}

// ── Banner ad element ─────────────────────────────────────────────────────────
export function createBannerIns() {
  const npa = getNPA();
  return {
    adClient: AD_CLIENT,
    adSlot: INTERSTITIAL_SLOT,
    npa,
  };
}