import chapters from '../../data/landing-chapters.json';

const VEIL_ZONE = 0.12;
const SMOOTHING = 5;

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const lerp = (a, b, t) => a + (b - a) * t;

function measureSections() {
  const ids = [...new Set(chapters.map((chapter) => chapter.section))];
  return ids.map((id) => {
    const element = document.getElementById(id);
    const rect = element.getBoundingClientRect();
    return { id, top: rect.top + window.scrollY, height: rect.height };
  });
}

function veilAmount(chapter, local) {
  if (chapter.veilIn && local < VEIL_ZONE) return { amount: 1 - local / VEIL_ZONE, color: chapter.veilIn };
  if (chapter.veilOut && local > 1 - VEIL_ZONE) return { amount: (local - (1 - VEIL_ZONE)) / VEIL_ZONE, color: chapter.veilOut };
  return { amount: 0, color: '#000000' };
}

export function createConductor() {
  let sections = measureSections();
  let smoothY = window.scrollY;

  function resolve(scrollY) {
    const focusY = scrollY + window.innerHeight * 0.5;
    let section = sections[0];
    for (const candidate of sections) {
      if (focusY >= candidate.top) section = candidate;
    }
    const sectionT = clamp01((focusY - section.top) / section.height);
    const chapter = chapters.find(
      (item) => item.section === section.id && sectionT >= item.from && sectionT <= item.to
    );
    const local = clamp01((sectionT - chapter.from) / (chapter.to - chapter.from));
    const sceneProgress = lerp(chapter.sceneStart, chapter.sceneEnd, local);
    return { sectionId: section.id, sectionT, scene: chapter.scene, sceneProgress, veil: veilAmount(chapter, local) };
  }

  function update(dt, reduceMotion) {
    const target = window.scrollY;
    smoothY = reduceMotion ? target : lerp(smoothY, target, 1 - Math.exp(-SMOOTHING * dt));
    return resolve(smoothY);
  }

  function remeasure() {
    sections = measureSections();
  }

  return { update, remeasure, exact: () => resolve(window.scrollY) };
}
