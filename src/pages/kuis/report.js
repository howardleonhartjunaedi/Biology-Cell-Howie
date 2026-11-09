// Laporan ujian: nilai, predikat, batang per topik, kelebihan, topik lemah, pembahasan,
// dan tombol unduh kartu nilai (PNG digambar sendiri di <canvas>, tanpa library).
import { TOPICS, element, formatTime, gradeFor } from './quiz-core.js';

const STRONG_AT = 80;
const WEAK_BELOW = 60;
const WEAK_PRACTICE = { sel: 'sel-organel', organel: 'sel-organel', membran: 'membran', osmosis: 'osmosis' };

function topicStats(items) {
  const stats = {};
  Object.keys(TOPICS).forEach((id) => (stats[id] = { id, total: 0, correct: 0, missed: [] }));
  items.forEach((item) => {
    const entry = stats[item.source.topik];
    entry.total += 1;
    if (item.chosen === item.correct) entry.correct += 1;
    else if (!entry.missed.includes(item.source.konsep)) entry.missed.push(item.source.konsep);
  });
  return Object.values(stats).map((entry) => ({ ...entry, percent: entry.total ? Math.round((entry.correct / entry.total) * 100) : 0 }));
}

function drawCard(summary) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  const font = (weight, size) => `${weight} ${size}px Montserrat, system-ui, sans-serif`;
  ctx.fillStyle = '#0E1116';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#7F8E9A';
  ctx.font = font(500, 28);
  ctx.fillText('SEL · KUIS · MODE UJIAN', 96, 140);
  ctx.fillStyle = '#FFF4D6';
  ctx.font = font(800, 220);
  ctx.fillText(`${summary.correct}/${summary.total}`, 88, 380);
  ctx.font = font(600, 44);
  ctx.fillText(`Nilai ${summary.score} · Predikat ${summary.grade}`, 96, 470);
  ctx.fillStyle = '#D3D9DE';
  ctx.font = font(400, 32);
  ctx.fillText(`Benar ${summary.correct} · Salah ${summary.wrong} · Kosong ${summary.empty} · Waktu ${summary.time}`, 96, 530);

  summary.topics.forEach((topic, index) => {
    const y = 660 + index * 130;
    ctx.fillStyle = '#FFF4D6';
    ctx.font = font(600, 34);
    ctx.fillText(TOPICS[topic.id].label, 96, y);
    ctx.textAlign = 'right';
    ctx.fillText(`${topic.correct}/${topic.total}`, 984, y);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#26303A';
    ctx.fillRect(96, y + 28, 888, 16);
    ctx.fillStyle = topic.percent >= STRONG_AT ? '#4CC38A' : topic.percent < WEAK_BELOW ? '#E5534B' : '#F2B544';
    ctx.fillRect(96, y + 28, 888 * (topic.percent / 100), 16);
  });

  ctx.fillStyle = '#7F8E9A';
  ctx.font = font(400, 26);
  ctx.fillText(`${summary.date} · Kelompok 4 XI-A5 · Kolese Kanisius`, 96, 1250);
  return canvas;
}

export function buildReport(container, items, usedSeconds, { onRetry, onWeakPractice }) {
  const total = items.length;
  const correct = items.filter((item) => item.chosen === item.correct).length;
  const empty = items.filter((item) => item.chosen === null).length;
  const wrong = total - correct - empty;
  const score = Math.round((correct / total) * 100);
  const grade = gradeFor(score);
  const topics = topicStats(items);
  const strong = topics.filter((topic) => topic.percent >= STRONG_AT);
  const weak = topics.filter((topic) => topic.percent < WEAK_BELOW).sort((a, b) => a.percent - b.percent);
  const summary = { total, correct, wrong, empty, score, grade, topics, time: formatTime(usedSeconds), date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) };

  const heading = element('h3', { className: 'report__score', tabIndex: -1, textContent: `${correct}/${total}` });
  const facts = element('dl', { className: 'report__facts' }, [
    ['Nilai', score],
    ['Predikat', grade],
    ['Waktu', summary.time],
    ['Benar', correct],
    ['Salah', wrong],
    ['Kosong', empty],
  ].map(([label, value]) => element('div', {}, [element('dt', { textContent: label }), element('dd', { textContent: value })])));

  const bars = element(
    'div',
    { className: 'report__bars' },
    topics.map((topic) => {
      const fill = element('span', { className: 'topic-bar__fill' });
      fill.style.width = `${topic.percent}%`;
      fill.dataset.level = topic.percent >= STRONG_AT ? 'good' : topic.percent < WEAK_BELOW ? 'bad' : 'mid';
      return element('div', { className: 'topic-bar' }, [
        element('span', { className: 'topic-bar__label', textContent: TOPICS[topic.id].label }),
        element('span', { className: 'topic-bar__track' }, [fill]),
        element('span', { className: 'topic-bar__value', textContent: `${topic.correct}/${topic.total}` }),
      ]);
    })
  );

  const strongBlock = element('div', { className: 'report__block' }, [
    element('p', { className: 'quiz-label', textContent: 'Kelebihan' }),
    strong.length
      ? element('ul', {}, strong.map((topic) => element('li', { textContent: `${TOPICS[topic.id].label} (${topic.percent}%)` })))
      : element('p', { textContent: 'Belum ada topik dengan skor 80% ke atas. Tetap semangat.' }),
  ]);

  const weakBlock = element('div', { className: 'report__block' }, [
    element('p', { className: 'quiz-label', textContent: 'Perlu dipelajari lagi' }),
    weak.length
      ? element(
          'ul',
          {},
          weak.map((topic) =>
            element('li', {}, [
              element('strong', { textContent: `${TOPICS[topic.id].label} (${topic.percent}%)` }),
              element('span', { textContent: ` — konsep yang terlewat: ${topic.missed.join(', ')}. ` }),
              element('a', { className: 'text-link', href: `/${TOPICS[topic.id].page}`, textContent: `Buka ${TOPICS[topic.id].pageLabel} →` }),
            ])
          )
        )
      : element('p', { textContent: 'Tidak ada topik di bawah 60%.' }),
  ]);

  const review = element(
    'ol',
    { className: 'review' },
    items.map((item) => {
      const status = item.chosen === null ? 'kosong' : item.chosen === item.correct ? 'benar' : 'salah';
      const yours = item.chosen === null ? '(kosong)' : item.options[item.chosen];
      const entry = element('li', { className: 'review__item' }, [
        element('p', { className: 'review__status', textContent: status }),
        element('p', { className: 'review__question', textContent: item.source.soal }),
        element('p', { textContent: `Jawabanmu: ${yours}` }),
        element('p', { textContent: `Jawaban benar: ${item.options[item.correct]}` }),
        element('p', { className: 'note', textContent: item.source.penjelasan }),
      ]);
      entry.dataset.status = status;
      return entry;
    })
  );

  const retry = element('button', { type: 'button', className: 'button', textContent: 'Ulangi Ujian' });
  retry.addEventListener('click', onRetry);
  const practiceWeak = element('button', { type: 'button', className: 'button button--ghost', textContent: 'Latihan Topik Lemah' });
  const weakest = weak[0] ?? [...topics].sort((a, b) => a.percent - b.percent)[0];
  practiceWeak.addEventListener('click', () => onWeakPractice(WEAK_PRACTICE[weakest.id]));
  const download = element('button', { type: 'button', className: 'button button--ghost', textContent: 'Unduh Report Card' });
  download.addEventListener('click', () => {
    drawCard(summary).toBlob((blob) => {
      const link = element('a', { href: URL.createObjectURL(blob), download: `report-card-kuis-sel-${score}.png` });
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    }, 'image/png');
  });

  container.replaceChildren(
    element('div', { className: 'quiz-card report' }, [
      element('p', { className: 'quiz-label', textContent: 'Laporan ujian' }),
      heading,
      facts,
      element('p', { className: 'quiz-label', textContent: 'Nilai per topik' }),
      bars,
      element('div', { className: 'report__split' }, [strongBlock, weakBlock]),
      element('div', { className: 'button-row' }, [retry, practiceWeak, download]),
    ]),
    element('section', { className: 'report__review', ariaLabel: 'Pembahasan' }, [element('h3', { className: 'section__title', textContent: 'Pembahasan' }), review])
  );

  return { correct, score, grade };
}
