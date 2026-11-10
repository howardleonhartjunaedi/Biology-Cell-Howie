// Alat bersama untuk Mode Latihan dan Mode Ujian: acak soal, acak opsi, nama topik.
import bank from '../../data/soal.json';

export const TOPICS = {
  sel: { label: 'Sel & jenisnya', page: 'rangkuman.html#rangkuman-sel', pageLabel: 'Rangkuman: Sel' },
  organel: { label: 'Organel & bagiannya', page: 'sel.html', pageLabel: 'Lab Sel' },
  membran: { label: 'Membran & transpor', page: 'gerbang-sel.html', pageLabel: 'Gerbang Sel' },
  osmosis: { label: 'Osmosis', page: 'lab-osmosis.html', pageLabel: 'Lab Osmosis' },
};

// Pilihan topik di Mode Latihan → saringan soal.
export const PRACTICE_TOPICS = [
  { id: 'semua', label: 'Semua', filter: () => true },
  { id: 'sel-organel', label: 'Sel & Organel', filter: (q) => q.topik === 'sel' || q.topik === 'organel' },
  { id: 'hewan-tumbuhan', label: 'Sel Hewan vs Tumbuhan', filter: (q) => q.konsep === 'hewan-vs-tumbuhan' },
  { id: 'membran', label: 'Membran & Transpor', filter: (q) => q.topik === 'membran' },
  { id: 'osmosis', label: 'Osmosis', filter: (q) => q.topik === 'osmosis' },
];

export const EXAM_SPLIT = { sel: 4, organel: 8, membran: 7, osmosis: 6 };
export const EXAM_SECONDS = 30 * 60;
export const GRADE_LIMITS = [
  { grade: 'A', min: 85 },
  { grade: 'B', min: 70 },
  { grade: 'C', min: 55 },
  { grade: 'D', min: 0 },
];

export const LETTERS = ['A', 'B', 'C', 'D'];

// Fisher–Yates: setiap urutan punya peluang yang sama.
export function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Satu soal yang siap ditampilkan: opsinya diacak, posisi jawaban benar dihitung ulang.
export function prepare(question) {
  const order = shuffle(question.opsi.map((_, index) => index));
  return {
    source: question,
    options: order.map((index) => question.opsi[index]),
    correct: order.indexOf(question.jawaban),
    chosen: null,
    flagged: false,
  };
}

export function practiceSet(topicId, count) {
  const topic = PRACTICE_TOPICS.find((item) => item.id === topicId);
  return shuffle(bank.filter(topic.filter)).slice(0, count).map(prepare);
}

export function examSet() {
  const picked = Object.entries(EXAM_SPLIT).flatMap(([topik, count]) => shuffle(bank.filter((q) => q.topik === topik)).slice(0, count));
  return shuffle(picked).map(prepare);
}

export function gradeFor(score) {
  return GRADE_LIMITS.find((item) => score >= item.min).grade;
}

export function formatTime(seconds) {
  const safe = Math.max(0, Math.round(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
}

export function element(tag, props = {}, children = []) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
}

// Tombol opsi A–D. onPick dipanggil dengan nomor opsi.
export function renderOptions(container, item, onPick, { role = 'button' } = {}) {
  container.replaceChildren(
    ...item.options.map((text, index) => {
      const button = element('button', { type: 'button', className: 'option' }, [
        element('span', { className: 'option__letter', textContent: LETTERS[index] }),
        element('span', { className: 'option__text', textContent: text }),
      ]);
      if (role === 'radio') {
        button.setAttribute('role', 'radio');
        button.setAttribute('aria-checked', String(item.chosen === index));
      }
      button.addEventListener('click', () => onPick(index));
      return button;
    })
  );
}
