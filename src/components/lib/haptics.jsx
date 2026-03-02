export const haptic = (pattern) => {
  try {
    if (navigator.vibrate) { navigator.vibrate(pattern || [30]); return; }
    if (window.Capacitor?.Plugins?.Haptics) {
      window.Capacitor.Plugins.Haptics.impact({ style: 'medium' });
    }
  } catch {}
};