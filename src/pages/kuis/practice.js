// Mode Latihan: pilih topik dan jumlah, jawab, langsung lihat benar/salah + penjelasan.
import { PRACTICE_TOPICS, TOPICS, practiceSet, prepare, renderOptions, element } from './quiz-core.js';

const COUNTS = [5, 10, 15];
const $ = (id) => document.getElementById(id);

export function createPractice() {
  const state = { topic: 'semua', count: 10, items: [], index: 0, correct: 0, wrong: [] };

  function chipGroup(container, list, current, onPick) {
    container.replaceChildren(
      ...list.map(({ id, label }) => {
        const chip = element('button', { type: 'button', className: 'chip', textContent: label });
        chip.setAttribute('role', 'radio');
        chip.setAttribute('aria-checked', String(id === current));
        chip.addEventListener('click', () => {
          onPick(id);
          container.querySelectorAll('.chip').forEach((other) => other.setAttribute('aria-checked', String(other === chip)));
        });
        return chip;
      })
    );
  }

  function show(panel) {
    ['practice-setup', 'practice-play', 'practice-end'].forEach((id) => ($(id).hidden = id !== panel));
  }

  function start(items) {
    Object.assign(state, { items, index: 0, correct: 0, wrong: [] });
    show('practice-play');
    renderQuestion();
  }

  function renderQuestion() {
    const item = state.items[state.index];
    const total = state.items.length;
    $('practice-progress').textContent = `Soal ${state.index + 1} / ${total}`;
    $('practice-score').textContent = `Benar ${state.correct}`;
    $('practice-bar').style.width = `${(state.index / total) * 100}%`;
    $('practice-topic').textContent = TOPICS[item.source.topik].label;
    $('practice-question').textContent = item.source.soal;
    $('practice-feedback').hidden = true;
    $('practice-next').hidden = true;
    renderOptions($('practice-options'), item, answer);
    $('practice-options').querySelector('button')?.focus({ preventScroll: true });
  }

  function answer(index) {
    const item = state.items[state.index];
    if (item.chosen !== null) return;
    item.chosen = index;
    const right = index === item.correct;
    if (right) state.correct += 1;
    else state.wrong.push(item.source);
    $('practice-options').querySelectorAll('.option').forEach((button, i) => {
      button.disabled = true;
      if (i === item.correct) button.dataset.result = 'benar';
      else if (i === index) button.dataset.result = 'salah';
    });
    $('practice-verdict').textContent = right ? '✓ Benar' : `✗ Belum tepat. Jawaban: ${item.options[item.correct]}`;
    $('practice-verdict').dataset.result = right ? 'benar' : 'salah';
    $('practice-explain').textContent = item.source.penjelasan;
    $('practice-link').href = `/${item.source.halaman}`;
    $('practice-feedback').hidden = false;
    $('practice-score').textContent = `Benar ${state.correct}`;
    const last = state.index === state.items.length - 1;
    $('practice-next').textContent = last ? 'Lihat hasil' : 'Soal berikutnya';
    $('practice-next').hidden = false;
    $('practice-next').focus({ preventScroll: true });
  }

  function next() {
    if (state.index < state.items.length - 1) {
      state.index += 1;
      renderQuestion();
      return;
    }
    const total = state.items.length;
    $('practice-final').textContent = `${state.correct}/${total}`;
    $('practice-message').textContent =
      state.wrong.length === 0 ? 'Semua benar. Coba Mode Ujian untuk menguji semua topik.' : `Ada ${state.wrong.length} soal yang salah. Ulangi agar konsepnya makin kuat.`;
    $('practice-retry').hidden = state.wrong.length === 0;
    show('practice-end');
  }

  chipGroup($('topic-chips'), PRACTICE_TOPICS, state.topic, (id) => (state.topic = id));
  chipGroup($('count-chips'), COUNTS.map((n) => ({ id: n, label: `${n} soal` })), state.count, (id) => (state.count = id));
  $('practice-start').addEventListener('click', () => start(practiceSet(state.topic, state.count)));
  $('practice-next').addEventListener('click', next);
  $('practice-retry').addEventListener('click', () => start(state.wrong.map(prepare)));
  $('practice-change').addEventListener('click', () => show('practice-setup'));

  return {
    // Dipakai laporan ujian: "Latihan Topik Lemah".
    startTopic(topicId) {
      chipGroup($('topic-chips'), PRACTICE_TOPICS, topicId, (id) => (state.topic = id));
      state.topic = topicId;
      start(practiceSet(topicId, 10));
    },
  };
}
