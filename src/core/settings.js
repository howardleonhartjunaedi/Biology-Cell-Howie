export const settings = {
  magnetStrength: 0.25,
  cursorHoverScale: 5,
  rippleScale: 1,
  grainOpacity: 0.05,
  vignette: 0.22,
};

export function applyCssSettings() {
  const root = document.documentElement.style;
  root.setProperty('--grain-opacity', settings.grainOpacity);
  root.setProperty('--vignette', settings.vignette);
}
