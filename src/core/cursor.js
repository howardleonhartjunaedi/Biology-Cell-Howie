import { gsap } from 'gsap';
import { DURATION, EASE, prefersReducedMotion } from './motion.js';
import { settings } from './settings.js';

const INTERACTIVE = 'a, button, summary, [role="button"], [data-cursor]';
const DEFAULT_LABEL = 'Lihat';

export function setupCursor() {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!finePointer || prefersReducedMotion()) return;

  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<span class="cursor__label"></span>';
  document.body.append(cursor);
  document.documentElement.classList.add('has-cursor');

  const label = cursor.querySelector('.cursor__label');
  const moveX = gsap.quickTo(cursor, 'x', { duration: DURATION.fast * 2, ease: EASE.out });
  const moveY = gsap.quickTo(cursor, 'y', { duration: DURATION.fast * 2, ease: EASE.out });
  let hovered = null;

  function grow(target) {
    hovered = target;
    label.textContent = target.dataset.cursorLabel ?? DEFAULT_LABEL;
    gsap.to(cursor, { scale: settings.cursorHoverScale, duration: DURATION.base, ease: EASE.out });
    gsap.to(label, { opacity: 1, scale: 1 / settings.cursorHoverScale, duration: DURATION.base });
  }

  function shrink() {
    hovered = null;
    gsap.to(cursor, { scale: 1, duration: DURATION.base, ease: EASE.out });
    gsap.to(label, { opacity: 0, duration: DURATION.fast });
  }

  window.addEventListener('pointermove', (event) => {
    moveX(event.clientX);
    moveY(event.clientY);
    const target = event.target.closest?.(INTERACTIVE);
    if (target && target !== hovered && !target.disabled) grow(target);
    if (!target && hovered) shrink();
  }, { passive: true });

  document.addEventListener('pointerleave', () => gsap.to(cursor, { opacity: 0, duration: DURATION.fast }));
  document.addEventListener('pointerenter', () => gsap.to(cursor, { opacity: 1, duration: DURATION.fast }));
}
