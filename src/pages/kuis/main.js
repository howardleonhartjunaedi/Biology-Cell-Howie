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
  // Mode tersimpan di alamat (kuis.html?mode=ujian), jadi bisa dibagikan atau dibuka langsung.
  const url = new URL(window.location.href);
  if (mode === 'ujian') url.searchParams.set('mode', 'ujian');
  else url.searchParams.delete('mode');
  history.replaceState(null, '', url);
}

document.querySelectorAll('.quiz-mode .segmented__item').forEach((item) => item.addEventListener('click', () => setMode(item.dataset.mode)));
if (new URLSearchParams(window.location.search).get('mode') === 'ujian') setMode('ujian');
