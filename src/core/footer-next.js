import pages from '../data/pages.json';

function createDots(currentIndex) {
  const list = document.createElement('ol');
  list.className = 'progress-dots';
  list.setAttribute('aria-label', `Halaman ${currentIndex + 1} dari ${pages.length}`);
  pages.forEach((page, index) => {
    const dot = document.createElement('li');
    dot.className = 'progress-dots__dot';
    if (index <= currentIndex) dot.classList.add('progress-dots__dot--done');
    dot.title = page.label;
    list.append(dot);
  });
  return list;
}

function createMainLink(nextPage, isLast) {
  const link = document.createElement('a');
  link.className = 'footer-next__main';
  link.href = `/${nextPage.file}`;

  const title = document.createElement('span');
  title.className = 'footer-next__title';
  title.textContent = isLast ? '↺ Selam lagi dari awal' : `Lanjut: ${nextPage.label} →`;

  const preview = document.createElement('span');
  preview.className = 'footer-next__preview';
  preview.textContent = nextPage.preview;

  link.append(title, preview);
  return link;
}

export function renderFooterNext(currentId) {
  const currentIndex = pages.findIndex((page) => page.id === currentId);
  const isLast = currentIndex === pages.length - 1;
  const nextPage = pages[isLast ? 0 : currentIndex + 1];
  const prevPage = pages[currentIndex - 1];

  const footer = document.createElement('footer');
  footer.className = 'footer-next';

  const inner = document.createElement('div');
  inner.className = 'footer-next__inner';

  const row = document.createElement('div');
  row.className = 'footer-next__row';
  if (prevPage) {
    const prev = document.createElement('a');
    prev.className = 'footer-next__prev';
    prev.href = `/${prevPage.file}`;
    prev.textContent = `← Sebelumnya: ${prevPage.label}`;
    row.append(prev);
  } else {
    row.append(document.createElement('span'));
  }
  row.append(createDots(currentIndex));

  inner.append(createMainLink(nextPage, isLast), row);
  footer.append(inner);
  document.body.append(footer);
}
