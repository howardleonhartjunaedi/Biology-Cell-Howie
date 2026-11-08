const STORAGE_KEY = 'sel:mode-tenang';

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function isCalmMode() {
  const stored = readStored();
  if (stored !== null) return stored === 'on';
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function setCalmMode(on) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    // storage blocked: setting only lasts for this page
  }
  document.documentElement.classList.toggle('calm', on);
  window.dispatchEvent(new CustomEvent('calmmodechange', { detail: { on } }));
}

export function applyCalmMode() {
  document.documentElement.classList.toggle('calm', isCalmMode());
}
