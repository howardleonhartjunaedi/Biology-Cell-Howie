import * as THREE from 'three';

const point = new THREE.Vector3();

export function createPins(container, onSelect) {
  let buttons = [];

  function set(parts) {
    container.replaceChildren();
    buttons = parts.map((part, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'detail-pin';
      button.textContent = String(index + 1);
      button.dataset.cursorLabel = 'Bagian';
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => onSelect(button.getAttribute('aria-pressed') === 'true' ? null : part.id));
      container.append(button);
      return { button, part };
    });
  }

  function select(partId) {
    buttons.forEach(({ button, part }) => {
      button.setAttribute('aria-pressed', String(part.id === partId));
    });
  }

  function update(parts, group, camera) {
    if (!buttons.length) return;
    const rect = container.getBoundingClientRect();
    group.updateWorldMatrix(true, false);
    buttons.forEach(({ button, part }) => {
      point.copy(part.anchor).applyMatrix4(group.matrixWorld).project(camera);
      const x = ((point.x + 1) / 2) * window.innerWidth - rect.left;
      const y = ((1 - point.y) / 2) * window.innerHeight - rect.top;
      button.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    });
  }

  return { set, select, update };
}

