/*
 * CAPACITOR ADMOB SETUP REQUIRED FOR NATIVE BUILD
 * ─────────────────────────────────────────────────
 * When wrapping with Capacitor, install the AdMob plugin:
 *   npm install @capacitor-community/admob
 *   npx cap sync
 *
 * iOS — add to Info.plist:
 *   <key>GADApplicationIdentifier</key>
 *   <string>ca-app-pub-1818161492484327~8864224737</string>
 *
 * Android — add to AndroidManifest.xml:
 *   <meta-data
 *     android:name="com.google.android.gms.ads.APPLICATION_ID"
 *     android:value="ca-app-pub-1818161492484327~5393881452"/>
 *
 * Then replace the web ad calls in this file with:
 *   import { AdMob } from '@capacitor-community/admob';
 */

// ─────────────────────────────────────────────────────────────────────────────
// Ad Manager — AdMob integration (mobile-only)
// ─────────────────────────────────────────────────────────────────────────────
import { safeLocalStorageGet, safeLocalStorageSet, canInteractWithAd, recordAdInteraction } from './security';

const ATT_KEY = 'bki_att_consent';
const ATT_ASKED_KEY = 'bki_att_asked';

// ── Platform Detection ────────────────────────────────────────────────────────
export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

export function isMobileApp() {
  const ua = navigator.userAgent;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
  const isNative = !!(window.webkit?.messageHandlers || window.Android);
  return isMobile || isNative;
}

// Block all ads on desktop browsers
if (typeof window !== 'undefined') {
  if (!isMobileApp()) {
    console.log('Desktop environment detected — ads disabled');
    window._adsEnabled = false;
  }
}

// ── Ad Config — Full AdMob format for both platforms ─────────────────────────
function getAdConfig() {
  if (isIOS()) {
    return {
      appId:         'ca-app-pub-1818161492484327~8864224737',
      interstitialId:'ca-app-pub-1818161492484327/9165964299',
      rewardedId:    'ca-app-pub-1818161492484327/8535408902',
      rewardedClient:'ca-app-pub-1818161492484327~8864224737',
      bannerId:      'ca-app-pub-1818161492484327/9165964299',
    };
  } else {
    return {
      appId:         'ca-app-pub-1818161492484327~5393881452',
      interstitialId:'ca-app-pub-1818161492484327/4549575204',
      rewardedId:    'ca-app-pub-1818161492484327/4601546090',
      rewardedClient:'ca-app-pub-1818161492484327~5393881452',
      bannerId:      'ca-app-pub-1818161492484327/4549575204',
    };
  }
}

// ── App Tracking Transparency (iOS only) ─────────────────────────────────────
export function hasATTConsent() {
  return safeLocalStorageGet(ATT_KEY) === 'granted';
}

export function hasATTBeenAsked() {
  return safeLocalStorageGet(ATT_ASKED_KEY) === 'true';
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

  const granted = window.confirm(
    'Allow "Ball Knowing Imposter" to use your activity?\n\nYour data will be used to deliver personalized ads.'
  );

  safeLocalStorageSet(ATT_ASKED_KEY, 'true');
  safeLocalStorageSet(ATT_KEY, granted ? 'granted' : 'denied');
  onResult(granted);
}

function getNPA() {
  if (!isIOS()) return false;
  if (!hasATTBeenAsked()) return false;
  return safeLocalStorageGet(ATT_KEY) !== 'granted';
}

// ── Interstitial ad ───────────────────────────────────────────────────────────
// Only called from RevealScreen after the athlete stage.
export function showInterstitialAd({ onDone, roundDuration = 0 }) {
  // Guard: mobile-only, must be enabled
  if (!isMobileApp() || !window._adsEnabled) {
    onDone?.();
    return;
  }

  // Frequency cap: skip if round lasted < 30 seconds
  if (roundDuration < 30) {
    onDone();
    return;
  }

  // 5-second timeout failsafe
  const failTimer = setTimeout(() => {
    cleanup();
    onDone();
  }, 5000);

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

    const config = getAdConfig();

    container = document.createElement('div');
    container.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#000;display:flex;align-items:center;justify-content:center;';

    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', config.appId);
    ins.setAttribute('data-ad-slot', config.interstitialId);
    ins.setAttribute('data-ad-format', 'autorelaxed');
    ins.setAttribute('data-full-width-responsive', 'true');
    if (getNPA()) ins.setAttribute('data-npa', '1');

    container.appendChild(ins);
    document.body.appendChild(container);

    (window.adsbygoogle = window.adsbygoogle || []).push({});

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
// Only called from RewardedAdModal.
const _unlockedPacks = new Set();
export function isPackUnlocked(id) { return _unlockedPacks.has(id); }
export function unlockPack(id)     { _unlockedPacks.add(id); }

export function showRewardedAd(onRewardEarned) {
  // Guard: mobile-only, must be enabled and not in cooldown
  if (!isMobileApp() || !window._adsEnabled || !canInteractWithAd()) {
    onRewardEarned({ failed: true });
    return;
  }
  recordAdInteraction();

  const failTimer = setTimeout(() => {
    onRewardEarned({ failed: true });
  }, 5000);

  try {
    const config = getAdConfig();

    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', config.rewardedClient);
    ins.setAttribute('data-ad-slot', config.rewardedId);
    ins.setAttribute('data-ad-format', 'rewarded');
    ins.setAttribute('data-full-width-responsive', 'true');
    if (getNPA()) ins.setAttribute('data-npa', '1');
    document.body.appendChild(ins);

    (window.adsbygoogle = window.adsbygoogle || []).push({
      params: {
        google_ad_client: config.rewardedClient,
        google_ad_slot: config.rewardedId,
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

// ── Banner ad config ──────────────────────────────────────────────────────────
// Only used by BannerAd component on SetupScreen.
export function createBannerIns() {
  const config = getAdConfig();
  const npa = getNPA();
  return {
    adClient: config.appId,
    adSlot: config.bannerId,
    npa,
  };
}