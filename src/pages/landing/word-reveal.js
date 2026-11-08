import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isCalmMode } from '../../core/calm-mode.js';
import { EASE } from '../../core/motion.js';

const START_OPACITY = 0.3;
const SCROLL_START = 'top 75%';
const SCROLL_END = 'bottom 45%';

gsap.registerPlugin(ScrollTrigger);

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
      const word = document.createElement('span');
      word.className = 'reveal-word';
      word.textContent = part;
      fragment.append(word);
    });
    node.replaceWith(fragment);
  });

  return element.querySelectorAll('.reveal-word');
}

export function setupWordReveal() {
  document.querySelectorAll('[data-word-reveal]').forEach((element) => {
    const words = wrapWords(element);
    if (isCalmMode()) return;

    gsap.fromTo(
      words,
      { opacity: START_OPACITY },
      {
        opacity: 1,
        ease: EASE.out,
        stagger: 0.1,
        scrollTrigger: { trigger: element, start: SCROLL_START, end: SCROLL_END, scrub: 1 },
      }
    );
  });
}
