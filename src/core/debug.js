import { DURATION } from './motion.js';
import { applyCssSettings, settings } from './settings.js';

const COLORS = ['--c-coral', '--c-lagoon', '--c-cream', '--c-lab'];

export async function setupDebug() {
  if (!import.meta.env.DEV) return;
  if (!new URLSearchParams(window.location.search).has('debug')) return;

  const { default: GUI } = await import('lil-gui');
  const gui = new GUI({ title: 'SEL debug' });
  const root = document.documentElement;
  const css = getComputedStyle(root);

  const motion = gui.addFolder('Motion token');
  motion.add(DURATION, 'fast', 0.05, 0.6, 0.01).onChange((v) => root.style.setProperty('--dur-fast', `${v}s`));
  motion.add(DURATION, 'base', 0.1, 1.2, 0.01).onChange((v) => root.style.setProperty('--dur-base', `${v}s`));
  motion.add(DURATION, 'slow', 0.3, 2, 0.01).onChange((v) => root.style.setProperty('--dur-slow', `${v}s`));
  const ease = { out: css.getPropertyValue('--ease-out').trim() };
  motion.add(ease, 'out').name('--ease-out (CSS)').onFinishChange((v) => root.style.setProperty('--ease-out', v));

  const colors = gui.addFolder('Warna');
  COLORS.forEach((name) => {
    const holder = { value: css.getPropertyValue(name).trim() };
    colors.addColor(holder, 'value').name(name).onChange((v) => root.style.setProperty(name, v));
  });

  const effects = gui.addFolder('Kekuatan efek');
  effects.add(settings, 'rippleScale', 0, 3, 0.05).name('Riak judul');
  effects.add(settings, 'magnetStrength', 0, 0.6, 0.01).name('Magnet tombol');
  effects.add(settings, 'cursorHoverScale', 2, 8, 0.1).name('Kursor membesar');
  effects.add(settings, 'grainOpacity', 0, 0.2, 0.005).name('Grain').onChange(applyCssSettings);
  effects.add(settings, 'vignette', 0, 0.8, 0.01).name('Vignette').onChange(applyCssSettings);
}
