import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DURATION, EASE, prefersReducedMotion } from './motion.js';
import { isCalmMode } from './calm-mode.js';

gsap.registerPlugin(ScrollTrigger);

const TARGETS = 'main h1, main h2, main .poetic, main .section__lead, main .quote__text';
const SKIP = '#permukaan, [data-word-reveal], [data-no-reveal]';
const LINE_STAGGER = 0.09;

function wrapWords(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((node) => {
    const fragment = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach((part) => {
      if (!part.trim()) {
        fragment.append(part);
        return;
      }
      const mask = document.createElement('span');
      mask.className = 'line-mask';
      const word = document.createElement('span');
      word.className = 'line-mask__word';
      word.textContent = part;
      mask.append(word);
      fragment.append(mask);
    });
    node.replaceWith(fragment);
  });

  return [...element.querySelectorAll('.line-mask__word')];
}

function lineIndexes(words) {
  const tops = [];
  return words.map((word) => {
    const top = Math.round(word.parentElement.offsetTop);
    let index = tops.indexOf(top);
    if (index === -1) index = tops.push(top) - 1;
    return index;
  });
}

function reveal(element) {
  if (element.querySelector('a, button') || !element.textContent.trim()) return;
  const accessible = document.createElement('span');
  accessible.className = 'visually-hidden';
  accessible.textContent = element.textContent;
  const visual = document.createElement('span');
  visual.setAttribute('aria-hidden', 'true');
  visual.append(...element.childNodes);
  element.append(accessible, visual);
  const words = wrapWords(visual);
  const lines = lineIndexes(words);
  gsap.set(words, { yPercent: 110 });
  gsap.to(words, {
    yPercent: 0,
    duration: DURATION.slow,
    ease: EASE.out,
    delay: (index) => lines[index] * LINE_STAGGER,
    scrollTrigger: { trigger: element, start: 'top 88%', once: true },
  });
}

export function setupTextReveal() {
  if (prefersReducedMotion() || isCalmMode()) return;
  document.querySelectorAll(TARGETS).forEach((element) => {
    if (element.closest(SKIP)) return;
    reveal(element);
  });
}
