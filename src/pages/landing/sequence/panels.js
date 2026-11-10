// Membuat panel teks Beranda dari src/data/landing-beats.json (isi dari KONTEN-MATERI §1).
// Setiap blok (judul, paragraf, daftar) adalah satu "baris" yang dibuka dengan efek masker.
const element = (tag, className, html) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
};

const BUILDERS = {
  title: (block) => element('h2', 'beat__title', block.text),
  lead: (block) => element('p', 'beat__lead', block.html ?? block.text),
  poetic: (block) => element('p', 'beat__poetic', block.html ?? block.text),
  fact: (block) => element('p', 'beat__fact', block.html ?? block.text),
  note: (block) => element('p', 'beat__note', block.text),
  quote: (block) => {
    const figure = element('figure', 'beat__quote');
    figure.append(element('blockquote', 'beat__quote-text', block.text), element('figcaption', 'beat__quote-by', block.by));
    return figure;
  },
  // Skala dalam satu baris: 30 cm › 1 cm › 1 mm › 20 µm
  scale: (block) => {
    const list = element('ol', 'beat__scale');
    list.setAttribute('aria-label', block.label);
    block.steps.forEach((step) => list.append(element('li', '', step)));
    return list;
  },
  terms: (block) => {
    const list = element('dl', 'beat__terms');
    block.items.forEach(([term, meaning]) => list.append(element('dt', '', term), element('dd', '', meaning)));
    return list;
  },
};

export function buildBeat(beat) {
  const article = element('article', 'beat');
  article.dataset.beat = beat.id;
  article.setAttribute('aria-label', beat.label);
  beat.blocks.forEach((block) => {
    const line = BUILDERS[block.type](block);
    line.classList.add('beat__line');
    article.append(line);
  });
  return article;
}
