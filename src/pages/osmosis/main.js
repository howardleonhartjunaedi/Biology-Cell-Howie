import { setupPage } from '../../core/page-setup.js';
import { setupMagnetic } from '../../core/magnetic.js';
import { prefersReducedMotion } from '../../core/motion.js';
import data from '../../data/osmosis.json';
import { createMicroscope, renderStill } from './microscope.js';
import './osmosis.css';

setupPage();

const $ = (id) => document.getElementById(id);
const ui = { cell: 'hewan', solution: null };

const scope = createMicroscope($('scope-canvas'), {
  reduceMotion: prefersReducedMotion(),
  onChange: updateMeters,
});

function element(tag, props = {}, children = []) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
}

function renderCellSwitch() {
  $('cell-switch').replaceChildren(
    ...Object.entries(data.cells).map(([id, cell]) => {
      const button = element('button', { type: 'button', className: 'segmented__item', textContent: cell.label });
      button.setAttribute('role', 'radio');
      button.dataset.cell = id;
      button.addEventListener('click', () => setCell(id));
      return button;
    })
  );
}

function renderSolutions() {
  $('solutions').replaceChildren(
    ...data.solutions.map((solution) => {
      const button = element('button', { type: 'button', className: 'solution' }, [
        element('span', { className: `solution__drop solution__drop--${solution.id}` }),
        element('span', { className: 'solution__name', textContent: solution.label }),
        element('span', { className: 'solution__hint', textContent: solution.hint }),
      ]);
      button.dataset.solution = solution.id;
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => dropSolution(solution.id));
      return button;
    })
  );
}

function setCell(id) {
  ui.cell = id;
  ui.solution = null;
  scope.setCell(id);
  document.querySelectorAll('.segmented__item').forEach((item) => item.setAttribute('aria-checked', String(item.dataset.cell === id)));
  document.querySelectorAll('.solution').forEach((item) => item.setAttribute('aria-pressed', 'false'));
  $('scope-label').textContent = data.cells[id].sample;
  $('row-turgor').hidden = id !== 'tumbuhan';
  $('scope-canvas').setAttribute('aria-label', `Pandangan mikroskop: ${data.cells[id].short}, belum ditetesi larutan.`);
  showResult(null);
}

function dropSolution(id) {
  ui.solution = id;
  const state = data.states[ui.cell][id];
  scope.drop(id, state.water);
  document.querySelectorAll('.solution').forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.solution === id)));
  $('scope-canvas').setAttribute('aria-label', `Pandangan mikroskop: ${data.cells[ui.cell].short} di larutan ${id}. Keadaan akhir: ${state.name}.`);
  showResult(null, true);
}

function showResult(state, waiting = false) {
  $('result-grid').hidden = !state;
  $('result-empty').hidden = Boolean(state);
  if (!state) {
    $('result-name').textContent = waiting ? 'Mengamati…' : 'Belum ada larutan';
    return;
  }
  $('result-name').textContent = state.name;
  $('result-arah').textContent = state.arah;
  $('result-mengapa').textContent = state.mengapa;
  $('result-contoh').textContent = state.contoh;
}

let shownFor = null;
function updateMeters(metrics) {
  const isAnimal = ui.cell === 'hewan';
  const volume = isAnimal ? metrics.volume : metrics.fill / 0.93;
  const burst = isAnimal && metrics.burst > 0.3;
  $('meter-volume').style.width = burst ? '0%' : `${Math.min(100, (volume / 1.3) * 100)}%`;
  $('value-volume').textContent = burst ? 'pecah' : `${Math.round(volume * 100)}%`;
  if (!isAnimal) {
    $('meter-turgor').style.width = `${metrics.turgor * 100}%`;
    $('value-turgor').textContent = `${Math.round(metrics.turgor * 100)}%`;
  }
  const key = `${ui.cell}:${ui.solution}`;
  if (ui.solution && metrics.progress > 0.85 && shownFor !== key) {
    shownFor = key;
    showResult(data.states[ui.cell][ui.solution]);
  }
  if (!ui.solution) shownFor = null;
}

function renderTable() {
  $('state-table').replaceChildren(
    ...data.solutions.map((solution) =>
      element('tr', {}, [
        element('th', { scope: 'row', textContent: `${solution.label} (${solution.hint})` }),
        element('td', {}, [element('strong', { textContent: data.states.hewan[solution.id].name })]),
        element('td', {}, [element('strong', { textContent: data.states.tumbuhan[solution.id].name })]),
      ])
    )
  );
  $('remember-text').textContent = data.ingat;
}

function renderGuesses() {
  const items = data.tebak.map((item, index) => {
    const canvas = element('canvas', { className: 'guess__canvas' });
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', `Gambar soal ${index + 1}: ${data.cells[item.cell].short}`);
    const feedback = element('p', { className: 'guess__feedback' });
    feedback.setAttribute('aria-live', 'polite');
    const options = element(
      'div',
      { className: 'guess__options' },
      item.options.map((label, optionIndex) => {
        const button = element('button', { type: 'button', className: 'pill-button', textContent: label });
        button.addEventListener('click', () => {
          const correct = optionIndex === item.answer;
          options.querySelectorAll('button').forEach((other, i) => {
            other.dataset.result = i === item.answer ? 'benar' : i === optionIndex ? 'salah' : '';
          });
          feedback.textContent = `${correct ? 'Benar.' : `Belum tepat. Jawabannya ${item.options[item.answer]}.`} ${item.why}`;
          feedback.dataset.result = correct ? 'benar' : 'salah';
        });
        return button;
      })
    );
    const caption = element('p', { className: 'note', textContent: data.cells[item.cell].sample });
    return { node: element('li', { className: 'guess' }, [canvas, element('div', { className: 'guess__body' }, [caption, options, feedback])]), canvas, item };
  });
  $('guess-list').replaceChildren(...items.map((entry) => entry.node));
  const draw = () => items.forEach(({ canvas, item }) => renderStill(canvas, item.cell, item.solution));
  requestAnimationFrame(draw);
  window.addEventListener('resize', draw);
}

renderCellSwitch();
renderSolutions();
renderTable();
renderGuesses();
setCell('hewan');
setupMagnetic(document.querySelector('.osmo-lab'));
