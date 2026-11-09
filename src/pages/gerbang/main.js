import { setupPage } from '../../core/page-setup.js';
import { isCalmMode } from '../../core/calm-mode.js';
import { setupMagnetic } from '../../core/magnetic.js';
import data from '../../data/membran.json';
import { createPumpState } from './pump-state.js';
import './gerbang.css';

setupPage();

const $ = (id) => document.getElementById(id);
const pump = createPumpState();
const ui = { mode: 'struktur', playing: true, speed: 1 };
let viewer = null;

function renderStatic() {
  $('gate-intro').textContent = data.intro;
  $('pass-table').replaceChildren(
    ...data.table.map(([zat, cara]) => {
      const row = document.createElement('tr');
      const head = Object.assign(document.createElement('th'), { scope: 'row', textContent: zat });
      row.append(head, Object.assign(document.createElement('td'), { textContent: cara }));
      return row;
    })
  );
  $('carrier-note').textContent = data.carriers;
  $('gate-other').replaceChildren(
    ...data.other.map(({ title, text }) => {
      const block = document.createElement('div');
      block.append(Object.assign(document.createElement('h3'), { textContent: title }), Object.assign(document.createElement('p'), { textContent: text }));
      return block;
    })
  );
}

function renderChips() {
  $('gate-chips').replaceChildren(
    ...data.modes.map((mode) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'gate-chip';
      chip.setAttribute('role', 'tab');
      chip.dataset.mode = mode.id;
      chip.textContent = mode.label;
      chip.addEventListener('click', () => setMode(mode.id));
      return chip;
    })
  );
}

function renderPumpUi() {
  const { state } = pump;
  document.querySelectorAll('#pump-steps li').forEach((item, index) => item.classList.toggle('is-active', index === state.step));
  $('count-na').textContent = state.naOut;
  $('count-k').textContent = state.kIn;
  $('count-atp').textContent = state.atp;
  $('count-cycle').textContent = state.cycles;
  const bars = pump.bars();
  $('bar-na').style.width = `${bars.naOutside * 100}%`;
  $('bar-k').style.width = `${bars.kInside * 100}%`;
}

function setMode(id) {
  const mode = data.modes.find((item) => item.id === id);
  ui.mode = id;
  document.querySelectorAll('.gate-chip').forEach((chip) => chip.setAttribute('aria-selected', String(chip.dataset.mode === id)));
  $('mode-kind').textContent = mode.kind ?? 'Membran plasma';
  $('mode-title').textContent = mode.title;
  $('mode-text').textContent = mode.text;
  $('mode-legend').textContent = mode.legend ?? '';
  $('pump-steps').replaceChildren(...(mode.steps ?? []).map((text) => Object.assign(document.createElement('li'), { textContent: text })));
  $('pump-stats').hidden = id !== 'pompa';
  $('pump-note').textContent = mode.note ?? '';
  const link = $('mode-link');
  link.hidden = !mode.link;
  if (mode.link) Object.assign(link, { textContent: mode.link.text, href: mode.link.href });
  $('gate-controls').hidden = id === 'struktur';
  if (id === 'pompa') {
    pump.reset();
    renderPumpUi();
  }
  viewer?.setMode(id);
  setupMagnetic(document.querySelector('.gate-view'));
}

function setPlaying(playing) {
  ui.playing = playing;
  const button = $('ctrl-play');
  button.setAttribute('aria-pressed', String(playing));
  button.textContent = playing ? '⏸ Jeda' : '▶ Putar';
  viewer?.setPlaying(playing);
}

$('ctrl-play').addEventListener('click', () => setPlaying(!ui.playing));
$('ctrl-step').addEventListener('click', () => {
  setPlaying(false);
  if (ui.mode === 'pompa') {
    pump.nextStep();
    renderPumpUi();
  }
  viewer?.step();
});
$('ctrl-reset').addEventListener('click', () => {
  pump.reset();
  renderPumpUi();
  viewer?.reset();
  setPlaying(true);
});
$('ctrl-speed').addEventListener('input', (event) => {
  ui.speed = Number(event.target.value);
  viewer?.setSpeed(ui.speed);
});

let last = performance.now();
function tick(now) {
  const seconds = Math.min((now - last) / 1000, 0.1);
  last = now;
  if (ui.mode === 'pompa' && ui.playing) {
    pump.advance(seconds * ui.speed);
    renderPumpUi();
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

async function startViewer() {
  if (isCalmMode() || viewer) return;
  const { createMembraneViewer } = await import('./membrane-viewer.js');
  viewer = createMembraneViewer({ pump: pump.state });
  viewer?.setMode(ui.mode);
}

window.addEventListener('calmmodechange', (event) => {
  if (event.detail.on) {
    viewer?.dispose();
    viewer = null;
  } else startViewer();
});

renderStatic();
renderChips();
setMode('struktur');
startViewer();
