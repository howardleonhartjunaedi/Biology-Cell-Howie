import { setupPage } from '../../core/page-setup.js';
import { isCalmMode } from '../../core/calm-mode.js';
import { setupMagnetic } from '../../core/magnetic.js';
import { data, detailTarget, markActive, neighbours, organelleOf, renderList, showDetail } from './organelle-ui.js';
import './lab.css';
import './detail.css';

setupPage();

const CELL_ORDER = ['hewan', 'tumbuhan'];
const state = { cell: 'hewan', organelle: null, part: null };
const cellView = document.getElementById('layar-sel');
const detailView = document.getElementById('layar-detail');
let viewer = null;

function setCell(cellId) {
  state.cell = cellId;
  document.getElementById('cell-title').textContent = data.cells[cellId].title;
  document.querySelectorAll('.cell-switch__item').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.cell === cellId));
  });
  renderList(cellId, openOrganelle, (id) => {
    markActive(id);
    viewer?.highlight(id);
  });
  setupMagnetic(cellView);
  viewer?.setCell(cellId);
}

function stepCell(direction) {
  const index = CELL_ORDER.indexOf(state.cell);
  setCell(CELL_ORDER[(index + direction + CELL_ORDER.length) % CELL_ORDER.length]);
}

function renderDetail() {
  showDetail({
    cellId: state.cell,
    organelleId: state.organelle,
    partId: state.part,
    onPart: (partId) => {
      state.part = partId;
      renderDetail();
      viewer?.selectPart(partId);
    },
  });
  const { prev, next } = neighbours(state.cell, state.organelle);
  const prevButton = document.getElementById('detail-prev');
  const nextButton = document.getElementById('detail-next');
  prevButton.textContent = prev ? `‹ ${organelleOf(prev).name}` : '';
  nextButton.textContent = next ? `${organelleOf(next).name} ›` : '';
  prevButton.onclick = prev ? () => openOrganelle(prev) : null;
  nextButton.onclick = next ? () => openOrganelle(next) : null;
  setupMagnetic(detailView);
}

async function openOrganelle(id) {
  const target = detailTarget(id);
  state.organelle = target.id;
  state.part = target.part;
  if (viewer && !cellView.hidden) await viewer.flyTo(id);
  cellView.hidden = true;
  detailView.hidden = false;
  renderDetail();
  viewer?.showDetail(target.id, target.part);
  history.replaceState(null, '', `#${id}`);
  document.getElementById('detail-title').focus({ preventScroll: true });
}

function closeDetail() {
  detailView.hidden = true;
  cellView.hidden = false;
  window.scrollTo(0, 0);
  viewer?.showCell();
  history.replaceState(null, '', window.location.pathname);
  document.querySelector(`.organelle-button[data-organelle]`)?.focus({ preventScroll: true });
}

document.getElementById('detail-title').tabIndex = -1;
document.getElementById('detail-back').addEventListener('click', closeDetail);
document.getElementById('cell-prev').addEventListener('click', () => stepCell(-1));
document.getElementById('cell-next').addEventListener('click', () => stepCell(1));
document.querySelectorAll('.cell-switch__item').forEach((button) => {
  button.addEventListener('click', () => setCell(button.dataset.cell));
});
window.addEventListener('keydown', (event) => {
  if (cellView.hidden || event.target.closest('input, textarea')) return;
  if (event.key === 'ArrowLeft') stepCell(-1);
  if (event.key === 'ArrowRight') stepCell(1);
});

async function startViewer() {
  if (isCalmMode() || viewer) return;
  const { createLabViewer } = await import('./lab-viewer.js');
  viewer = createLabViewer({
    onPick: openOrganelle,
    onHover: markActive,
    onSwipe: stepCell,
    onPartPick: (partId) => {
      state.part = partId;
      renderDetail();
      viewer?.selectPart(partId);
    },
  });
  viewer?.setCell(state.cell);
}

window.addEventListener('calmmodechange', (event) => {
  if (event.detail.on) {
    viewer?.dispose();
    viewer = null;
  } else startViewer();
});

setCell('hewan');
const hashId = decodeURIComponent(window.location.hash.slice(1));
if (hashId && data.organelles[hashId]) {
  const cellHas = (cell) => data.cells[cell].organelles.includes(hashId);
  if (!cellHas('hewan') && cellHas('tumbuhan')) setCell('tumbuhan');
  openOrganelle(hashId);
}
startViewer().then(() => {
  if (!detailView.hidden) viewer?.showDetail(state.organelle, state.part);
});
document.getElementById('lab-loader').hidden = true;
