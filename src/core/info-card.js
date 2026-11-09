const CARD_OFFSET = { x: 72, y: -96 };
const CARD_WIDTH = 260;

export function createInfoCard({ onDetail } = {}) {
  const layer = document.createElement('div');
  layer.className = 'info-card-layer';
  layer.hidden = true;
  layer.innerHTML = `
    <svg aria-hidden="true"><line class="info-card__line" /><circle class="info-card__pin" r="6" /></svg>
    <div class="info-card" role="status">
      <p class="info-card__name"></p>
      <p class="info-card__text"></p>
      <button class="info-card__link" type="button">Lihat detail →</button>
    </div>`;
  document.body.append(layer);

  const line = layer.querySelector('line');
  const pin = layer.querySelector('circle');
  const card = layer.querySelector('.info-card');
  let currentId = null;

  const link = layer.querySelector('.info-card__link');
  link.hidden = !onDetail;
  link.addEventListener('click', () => currentId && onDetail?.(currentId));

  function show(id, { name, short }, x, y) {
    currentId = id;
    layer.hidden = false;
    layer.querySelector('.info-card__name').textContent = name;
    layer.querySelector('.info-card__text').textContent = short;
    const flip = x + CARD_OFFSET.x + CARD_WIDTH > window.innerWidth - 16;
    const cardX = flip ? x - CARD_OFFSET.x - CARD_WIDTH : x + CARD_OFFSET.x;
    const cardY = Math.max(80, y + CARD_OFFSET.y);
    card.style.transform = `translate(${cardX}px, ${cardY}px)`;
    pin.setAttribute('cx', x);
    pin.setAttribute('cy', y);
    line.setAttribute('x1', x);
    line.setAttribute('y1', y);
    line.setAttribute('x2', flip ? cardX + CARD_WIDTH : cardX);
    line.setAttribute('y2', cardY + 24);
  }

  function hide() {
    currentId = null;
    layer.hidden = true;
  }

  return { show, hide, element: layer, dispose: () => layer.remove() };
}
