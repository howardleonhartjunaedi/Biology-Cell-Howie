import { setupPage } from '../../core/page-setup.js';
import { setupSmoothScroll } from '../../core/smooth-scroll.js';
import { isCalmMode } from '../../core/calm-mode.js';
import { setupWordReveal } from './word-reveal.js';
import { createStage } from './stage.js';
import './landing.css';

setupPage();
setupSmoothScroll();
setupWordReveal();

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
