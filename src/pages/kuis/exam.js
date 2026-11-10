// Mode Ujian: 25 soal acak, timer 30 menit, navigator nomor soal, lalu laporan nilai.
import { EXAM_SECONDS, TOPICS, examSet, formatTime, renderOptions } from './quiz-core.js';
import { buildReport } from './report.js';

const $ = (id) => document.getElementById(id);
const HISTORY_KEY = 'sel:kuis-riwayat';
const WARN_AT = 10 * 60;
const DANGER_AT = 5 * 60;

function readHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveHistory(entry) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...readHistory()].slice(0, 5)));
  } catch {
    /* penyimpanan diblokir: riwayat dilewati */
  }
}

export function createExam({ onWeakPractice }) {
  const state = { items: [], index: 0, endsAt: 0, startedAt: 0, timer: null, running: false };

  function show(panel) {
    ['exam-start', 'exam-run', 'exam-report'].forEach((id) => ($(id).hidden = id !== panel));
  }

  function renderHistory() {
    const list = readHistory();
    $('exam-history').replaceChildren(
      ...(list.length
        ? list.map((entry) => {
            const item = document.createElement('li');
            item.textContent = `${entry.tanggal} · ${entry.benar}/${entry.total} · nilai ${entry.nilai} (${entry.predikat}) · ${entry.waktu}`;
            return item;
          })
        : [Object.assign(document.createElement('li'), { textContent: 'Belum ada. Hasil ujianmu akan tersimpan di perangkat ini.' })])
    );
  }

  function begin() {
    Object.assign(state, { items: examSet(), index: 0, startedAt: Date.now(), endsAt: Date.now() + EXAM_SECONDS * 1000, running: true });
    renderGrid();
    renderQuestion();
    show('exam-run');
    tick();
    state.timer = setInterval(tick, 250);
    window.addEventListener('beforeunload', guardLeave);
  }

  function guardLeave(event) {
    if (state.running) event.preventDefault();
  }

  function tick() {
    const left = (state.endsAt - Date.now()) / 1000;
    const timer = $('exam-timer');
    timer.textContent = formatTime(left);
    timer.dataset.level = left <= DANGER_AT ? 'danger' : left <= WARN_AT ? 'warn' : '';
    if (left <= 0) submit();
  }

  function renderGrid() {
    $('exam-grid').replaceChildren(
      ...state.items.map((item, index) => {
        const cell = document.createElement('li');
        const button = Object.assign(document.createElement('button'), { type: 'button', className: 'nav-cell', textContent: index + 1 });
        button.addEventListener('click', () => go(index));
        cell.append(button);
        return cell;
      })
    );
    updateGrid();
  }

  function updateGrid() {
    $('exam-grid').querySelectorAll('.nav-cell').forEach((button, index) => {
      const item = state.items[index];
      button.dataset.status = item.flagged ? 'flag' : item.chosen !== null ? 'done' : '';
      button.setAttribute('aria-current', index === state.index ? 'step' : 'false');
      const status = item.flagged ? 'ragu-ragu' : item.chosen !== null ? 'dijawab' : 'kosong';
      button.setAttribute('aria-label', `Soal ${index + 1}, ${status}`);
    });
  }

  function renderQuestion() {
    const item = state.items[state.index];
    $('exam-progress').textContent = `Soal ${state.index + 1} dari ${state.items.length}`;
    $('exam-topic').textContent = TOPICS[item.source.topik].label;
    $('exam-question').textContent = item.source.soal;
    renderOptions($('exam-options'), item, pick, { role: 'radio' });
    $('exam-prev').disabled = state.index === 0;
    $('exam-next').disabled = state.index === state.items.length - 1;
    $('exam-flag').setAttribute('aria-pressed', String(item.flagged));
    $('exam-flag').textContent = item.flagged ? 'Hapus tanda ragu-ragu' : 'Tandai ragu-ragu';
    updateGrid();
  }

  function pick(index) {
    state.items[state.index].chosen = index;
    $('exam-options').querySelectorAll('.option').forEach((button, i) => button.setAttribute('aria-checked', String(i === index)));
    updateGrid();
  }

  function go(index) {
    state.index = Math.min(Math.max(index, 0), state.items.length - 1);
    renderQuestion();
  }

  function askSubmit() {
    const empty = state.items.filter((item) => item.chosen === null).length;
    const flagged = state.items.filter((item) => item.flagged).length;
    const notes = [];
    if (empty) notes.push(`${empty} soal masih kosong`);
    if (flagged) notes.push(`${flagged} soal ditandai ragu-ragu`);
    $('confirm-text').textContent = notes.length ? `${notes.join(' dan ')}. Jawaban kosong dihitung salah.` : 'Semua soal sudah dijawab.';
    $('exam-confirm').showModal();
  }

  function submit() {
    if (!state.running) return;
    state.running = false;
    clearInterval(state.timer);
    window.removeEventListener('beforeunload', guardLeave);
    if ($('exam-confirm').open) $('exam-confirm').close();
    const usedSeconds = Math.min(EXAM_SECONDS, (Date.now() - state.startedAt) / 1000);
    const report = buildReport($('exam-report'), state.items, usedSeconds, {
      onRetry: begin,
      onWeakPractice,
    });
    saveHistory({
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      benar: report.correct,
      total: state.items.length,
      nilai: report.score,
      predikat: report.grade,
      waktu: formatTime(usedSeconds),
    });
    renderHistory();
    show('exam-report');
    $('exam-report').querySelector('h3')?.focus();
    window.scrollTo({ top: 0 });
  }

  $('exam-begin').addEventListener('click', begin);
  $('exam-prev').addEventListener('click', () => go(state.index - 1));
  $('exam-next').addEventListener('click', () => go(state.index + 1));
  $('exam-flag').addEventListener('click', () => {
    const item = state.items[state.index];
    item.flagged = !item.flagged;
    renderQuestion();
  });
  $('exam-submit').addEventListener('click', askSubmit);
  $('confirm-yes').addEventListener('click', submit);
  $('confirm-no').addEventListener('click', () => $('exam-confirm').close());

  renderHistory();

  return {
    isRunning: () => state.running,
    abort: () => {
      state.running = false;
      clearInterval(state.timer);
      window.removeEventListener('beforeunload', guardLeave);
      show('exam-start');
    },
    showStart: () => {
      if (!state.running) show('exam-start');
    },
  };
}
