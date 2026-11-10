import data from '../../data/organel.json';

const $ = (id) => document.getElementById(id);

export function organelleOf(id) {
  return data.organelles[id];
}

export function detailTarget(id) {
  const organelle = organelleOf(id);
  return organelle.detailOf ? { id: organelle.detailOf, part: organelle.part } : { id, part: null };
}

export function renderList(cellId, onSelect, onHover) {
  const list = $('organelle-items');
  list.replaceChildren();
  data.cells[cellId].organelles.forEach((id) => {
    const organelle = organelleOf(id);
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'organelle-button';
    button.dataset.organelle = id;
    button.innerHTML = `<span></span><span class="organelle-button__meta"></span>`;
    button.firstChild.textContent = organelle.name;
    button.lastChild.textContent = organelle.detail === 'full' ? 'Detail' : '';
    button.addEventListener('click', () => onSelect(id));
    button.addEventListener('pointerenter', () => onHover(id));
    button.addEventListener('focus', () => onHover(id));
    button.addEventListener('pointerleave', () => onHover(null));
    button.addEventListener('blur', () => onHover(null));
    item.append(button);
    list.append(item);
  });
}

export function markActive(id) {
  document.querySelectorAll('.organelle-button').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.organelle === id);
  });
}

function fillList(element, items) {
  element.replaceChildren(...items.map((text) => Object.assign(document.createElement('li'), { textContent: text })));
}

export function showDetail({ cellId, organelleId, partId, onPart }) {
  const organelle = organelleOf(organelleId);
  const parts = organelle.parts ?? [];
  const partIndex = parts.findIndex((part) => part.id === partId);
  const part = parts[partIndex];
  const cell = data.cells[cellId];

  $('detail-eyebrow').textContent = part ? `BAGIAN ${partIndex + 1} DARI ${parts.length}` : organelle.membrane.toUpperCase();
  $('detail-title').textContent = part ? part.name : organelle.name;
  $('detail-meta').textContent = part ? `Bagian dari ${organelle.name}` : organelle.membrane;
  $('detail-desc').textContent = part ? part.deskripsi ?? '—' : organelle.deskripsi ?? organelle.short;
  fillList($('detail-func'), part ? [part.fungsi] : organelle.fungsi ?? [organelle.short]);

  const fact = $('detail-fact');
  fact.hidden = !organelle.tahukahKamu || Boolean(part);
  fact.textContent = organelle.tahukahKamu ? `Tahukah kamu? ${organelle.tahukahKamu}` : '';

  const chips = $('detail-parts');
  chips.replaceChildren();
  parts.forEach((item, index) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'part-chip';
    chip.textContent = `${index + 1}. ${item.name}`;
    chip.setAttribute('aria-pressed', String(item.id === partId));
    chip.addEventListener('click', () => onPart(item.id === partId ? null : item.id));
    chips.append(chip);
  });

  const crumbs = [cell.breadcrumb, organelle.name, part?.name].filter(Boolean);
  $('detail-breadcrumb').replaceChildren(...crumbs.map((text) => Object.assign(document.createElement('li'), { textContent: text })));
}

export function neighbours(cellId, organelleId) {
  const ids = data.cells[cellId].organelles.filter((id) => !organelleOf(id).detailOf || id === 're-kasar');
  const index = Math.max(0, ids.findIndex((id) => id === organelleId || (organelleId === 're' && id === 're-kasar')));
  return { prev: ids[index - 1] ?? null, next: ids[index + 1] ?? null };
}

export { data };
