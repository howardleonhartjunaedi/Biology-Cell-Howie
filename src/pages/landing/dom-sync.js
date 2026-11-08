const PARTS_START = 0.12;
const PARTS_END = 0.95;

const scaleSteps = document.querySelectorAll('#terumbu .scale-steps li');
const animalTerms = document.querySelectorAll('#sel-hewan .term-list dt');
const plantTerms = document.querySelectorAll('#sel-tumbuhan .term-list dt');

function highlight(items, activeIndex) {
  items.forEach((item, index) => item.classList.toggle('is-active', index === activeIndex));
}

export function stepIndex(progress, count) {
  return Math.min(count - 1, Math.floor(progress * count));
}

export function activePart(progress, count) {
  if (progress < PARTS_START) return -1;
  const t = Math.min(1, (progress - PARTS_START) / (PARTS_END - PARTS_START));
  return stepIndex(t, count);
}

export function syncDom(state) {
  const { sectionId, sectionT, scene, sceneProgress } = state;
  highlight(scaleSteps, sectionId === 'terumbu' ? stepIndex(sectionT, scaleSteps.length) : -1);
  highlight(animalTerms, scene === 'animalCell' ? activePart(sceneProgress, animalTerms.length) : -1);
  highlight(plantTerms, scene === 'plantCell' ? activePart(sceneProgress, plantTerms.length) : -1);
}
