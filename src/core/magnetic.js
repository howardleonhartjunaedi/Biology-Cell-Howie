import { gsap } from 'gsap';
import { DURATION, EASE, prefersReducedMotion } from './motion.js';
import { settings } from './settings.js';

const MAGNETIC = '.button, .pill-button, .round-button, .toggle, .cell-switch__item, .part-chip, [data-magnetic]';
const PRESS_SCALE = 0.96;

function attach(element) {
  if (element.dataset.magnetBound) return;
  element.dataset.magnetBound = 'true';
  const moveX = gsap.quickTo(element, 'x', { duration: DURATION.base, ease: EASE.out });
  const moveY = gsap.quickTo(element, 'y', { duration: DURATION.base, ease: EASE.out });

  element.addEventListener('pointermove', (event) => {
    if (element.disabled) return;
    const rect = element.getBoundingClientRect();
    moveX((event.clientX - rect.left - rect.width / 2) * settings.magnetStrength);
    moveY((event.clientY - rect.top - rect.height / 2) * settings.magnetStrength);
  });
  element.addEventListener('pointerleave', () => {
    moveX(0);
    moveY(0);
  });
  element.addEventListener('pointerdown', () => gsap.to(element, { scale: PRESS_SCALE, duration: DURATION.fast }));
  ['pointerup', 'pointerleave'].forEach((type) =>
    element.addEventListener(type, () => gsap.to(element, { scale: 1, duration: DURATION.base, ease: EASE.out }))
  );
}

export function setupMagnetic(root = document) {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!finePointer || prefersReducedMotion()) return;
  root.querySelectorAll(MAGNETIC).forEach(attach);
}
