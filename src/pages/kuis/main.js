import { setupPage } from '../../core/page-setup.js';
import { createPractice } from './practice.js';
import { createExam } from './exam.js';
import './kuis.css';

setupPage();

const practice = createPractice();
const exam = createExam({
  onWeakPractice: (topicId) => {
    setMode('latihan');
    practice.startTopic(topicId);
  },
});

function setMode(mode) {
  if (mode === 'latihan' && exam.isRunning()) {
    // Ujian sedang berjalan: jangan biarkan pindah mode tanpa sengaja.
    if (!window.confirm('Ujian sedang berjalan. Pindah ke Mode Latihan? Jawabanmu tidak akan disimpan.')) return;
    exam.abort();
  }
  document.getElementById('latihan').hidden = mode !== 'latihan';
  document.getElementById('ujian').hidden = mode !== 'ujian';
  document.querySelectorAll('.quiz-mode .segmented__item').forEach((item) => item.setAttribute('aria-checked', String(item.dataset.mode === mode)));
  if (mode === 'ujian') exam.showStart();
}

document.querySelectorAll('.quiz-mode .segmented__item').forEach((item) => item.addEventListener('click', () => setMode(item.dataset.mode)));
