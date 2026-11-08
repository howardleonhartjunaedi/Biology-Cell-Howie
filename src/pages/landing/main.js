import { setupPage } from '../../core/page-setup.js';
import { setupSmoothScroll } from '../../core/smooth-scroll.js';
import { isCalmMode } from '../../core/calm-mode.js';
import { setupWordReveal } from './word-reveal.js';
import { createStage } from './stage.js';
import './landing.css';
import './hero.css';

const HERO_PASSED_AT = 0.65;

setupPage();
setupSmoothScroll();
setupWordReveal();

const hero = document.getElementById('permukaan');

function updateNavOverHero() {
  const overHero = window.scrollY < hero.offsetHeight * HERO_PASSED_AT;
  document.body.classList.toggle('nav-over-hero', overHero);
}

window.addEventListener('scroll', updateNavOverHero, { passive: true });
window.addEventListener('resize', updateNavOverHero);
updateNavOverHero();

let stage = null;

function startStage() {
  if (stage || isCalmMode()) return;
  stage = createStage();
  document.documentElement.classList.toggle('webgl-on', Boolean(stage));
  document.fonts.ready.then(() => stage?.resize());
}

function stopStage() {
  stage?.dispose();
  stage = null;
  document.documentElement.classList.remove('webgl-on');
}

window.addEventListener('calmmodechange', (event) => (event.detail.on ? stopStage() : startStage()));
window.addEventListener('pagehide', stopStage);
startStage();
