// ─────────────────────────────────────────────────────────────────────────────
// Ad Manager — AdMob / AdSense integration
// ─────────────────────────────────────────────────────────────────────────────

const ATT_KEY = 'bki_att_consent';
const ATT_ASKED_KEY = 'bki_att_asked';

// ── Platform Detection & Ad Config ────────────────────────────────────────────
export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function getAdConfig() {
  const iosMode = isIOS();
  return {
    appId: iosMode 
      ? 'ca-app-pub-1818161492484327~8864224737' 
      : 'ca-pub-1818161492484327',
    interstitialId: iosMode 
      ? 'ca-app-pub-1818161492484327/9165964299' 
      : '4549575204',
    rewardedId: iosMode 
      ? 'ca-app-pub-1818161492484327/8535408902' 
      : '4601546090',
    rewardedClient: iosMode
      ? 'ca-app-pub-1818161492484327~8864224737'
      : 'ca-app-pub-1818161492484327~5393881452'
  };
}

// Log platform & ad config on app load for testing
if (typeof window !== 'undefined') {
  const config = getAdConfig();
  console.log('Platform detected:', isIOS() ? 'iOS' : 'Android');
  console.log('Using ad config:', config);
}

// ── App Tracking Transparency (iOS only) ─────────────────────────────────────

export function hasATTConsent() {
  return localStorage.getItem(ATT_KEY) === 'granted';
}

export function hasATTBeenAsked() {
  return localStorage.getItem(ATT_ASKED_KEY) === 'true';
}

export function requestATTConsent(onResult) {
  // ATT prompt is iOS-only; skip entirely on Android
  if (!isIOS()) {
    onResult(true);
    return;
  }

  if (hasATTBeenAsked()) {
    onResult(true);
    return;
  }

  // Show native-style prompt (iOS only)
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
  if (scriptInjected) return;

  try {
    const config = getAdConfig();
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.appId}`;
    s.crossOrigin = 'anonymous';
    s.dataset.adClient = config.appId;
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

// ── Rewarded ad ───────────────────────────────────────────────────────────────
const REWARDED_CLIENT = 'ca-app-pub-1818161492484327~5393881452';
const REWARDED_SLOT   = '4601546090';

// Session cache: set of unlocked pack/league IDs
const _unlockedPacks = new Set();
export function isPackUnlocked(id) { return _unlockedPacks.has(id); }
export function unlockPack(id)     { _unlockedPacks.add(id); }

export function showRewardedAd(onRewardEarned) {
  // 5-second failsafe — unlock anyway if ad never loads
  const failTimer = setTimeout(() => {
    onRewardEarned({ failed: true });
  }, 5000);

  try {
    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', REWARDED_CLIENT);
    ins.setAttribute('data-ad-slot', REWARDED_SLOT);
    ins.setAttribute('data-ad-format', 'rewarded');
    ins.setAttribute('data-full-width-responsive', 'true');
    if (getNPA()) ins.setAttribute('data-npa', '1');
    document.body.appendChild(ins);

    (window.adsbygoogle = window.adsbygoogle || []).push({
      params: {
        google_ad_client: REWARDED_CLIENT,
        google_ad_slot: REWARDED_SLOT,
        google_rewards_earned_callback: () => {
          clearTimeout(failTimer);
          try { document.body.removeChild(ins); } catch (e) {}
          onRewardEarned({ failed: false });
        },
      },
    });
  } catch (e) {
    clearTimeout(failTimer);
    onRewardEarned({ failed: true });
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