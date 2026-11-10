// Mikroskop 2D: menggambar sel darah merah atau sel bawang merah di <canvas>,
// lalu menganimasikan perubahan sel setelah larutan diteteskan.
// Semua ukuran memakai "dunia" 600 × 600; canvas diperbesar sesuai devicePixelRatio.

const WORLD = 600;
const FIELD_RADIUS = WORLD / 2 - 6;
const DROP_SECONDS = 0.55;
const CHANGE_START = 0.5;
const CHANGE_SECONDS = 3.2;
const RBC_RADIUS = 46;
const PLANT_CELL = { w: 150, h: 58 };
const WATER_BLUE = '#1F5FC4';

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

function mixColor(a, b, t) {
  const pa = a.match(/\w\w/g).map((h) => parseInt(h, 16));
  const pb = b.match(/\w\w/g).map((h) => parseInt(h, 16));
  return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], t))).join(',')})`;
}

// Angka acak yang selalu sama setiap kali halaman dibuka (supaya susunan sel tetap).
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function layoutBloodCells() {
  const rand = seeded(7);
  const cells = [{ x: 0, y: 0, seed: 0.3 }];
  let tries = 0;
  while (cells.length < 12 && tries < 500) {
    tries += 1;
    const angle = rand() * Math.PI * 2;
    const dist = 120 + rand() * 150;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;
    if (cells.every((c) => Math.hypot(c.x - x, c.y - y) > RBC_RADIUS * 2.7)) cells.push({ x, y, seed: rand() * 6 });
  }
  return cells;
}

function layoutPlantCells() {
  const rand = seeded(11);
  const cells = [];
  for (let row = -6; row <= 6; row += 1) {
    const offset = row === 0 ? 0 : (row % 2 ? PLANT_CELL.w / 2 : 0) + (rand() - 0.5) * 50;
    const y = row * PLANT_CELL.h;
    for (let col = -4; col <= 4; col += 1) {
      cells.push({ x: col * PLANT_CELL.w + offset, y, shrink: 0.9 + rand() * 0.2, pull: (rand() - 0.5) * 0.5, seed: rand() * 6 });
    }
  }
  return cells;
}

const BLOOD = layoutBloodCells();
const PLANT = layoutPlantCells();

// Keadaan sel untuk progres p (0 = baru ditetesi, 1 = hasil akhir).
export function cellMetrics(cell, solution, p) {
  if (cell === 'hewan') {
    if (solution === 'hipotonik') {
      const swell = clamp01(p / 0.75);
      const burst = clamp01((p - 0.78) / 0.22);
      return { volume: 1 + 0.3 * swell, crenation: 0, pale: 1 - swell, burst };
    }
    if (solution === 'hipertonik') return { volume: 1 - 0.28 * p, crenation: p, pale: 1, burst: 0 };
    return { volume: 1, crenation: 0, pale: 1, burst: 0 };
  }
  const start = { fill: 0.93, turgor: 0.5 };
  const end = {
    hipotonik: { fill: 1, turgor: 0.95 },
    isotonik: { fill: 0.89, turgor: 0.2 },
    hipertonik: { fill: 0.52, turgor: 0 },
  }[solution] ?? start;
  return { fill: lerp(start.fill, end.fill, p), turgor: lerp(start.turgor, end.turgor, p) };
}

function bloodCellPath(ctx, x, y, radius, crenation, seed) {
  ctx.beginPath();
  const steps = 120;
  for (let i = 0; i <= steps; i += 1) {
    const a = (i / steps) * Math.PI * 2;
    const spikes = Math.pow(Math.max(0, Math.sin(a * 11 + seed)), 2);
    const wobble = 0.02 * Math.sin(a * 3 + seed);
    const r = radius * (1 + wobble + crenation * (0.16 * spikes - 0.05));
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawBlood(ctx, metrics, time) {
  const { volume, crenation, pale, burst } = metrics;
  ctx.fillStyle = mixColor('#F2EADB', '#F1D9CF', burst);
  ctx.fillRect(-WORLD / 2, -WORLD / 2, WORLD, WORLD);

  BLOOD.forEach((cell) => {
    const drift = 3 * Math.sin(time * 0.35 + cell.seed);
    const x = cell.x + drift;
    const y = cell.y + 3 * Math.cos(time * 0.3 + cell.seed * 2);
    const radius = RBC_RADIUS * volume;

    if (burst > 0) {
      // Hemoglobin keluar ke larutan, tinggal "hantu" membran yang pucat.
      const cloud = ctx.createRadialGradient(x, y, 0, x, y, radius * (1.1 + burst * 1.3));
      cloud.addColorStop(0, `rgba(196, 52, 52, ${0.32 * (1 - burst * 0.5)})`);
      cloud.addColorStop(1, 'rgba(196, 52, 52, 0)');
      ctx.fillStyle = cloud;
      ctx.beginPath();
      ctx.arc(x, y, radius * (1.1 + burst * 1.3), 0, Math.PI * 2);
      ctx.fill();
    }

    bloodCellPath(ctx, x, y, radius, crenation, cell.seed);
    const body = ctx.createRadialGradient(x, y, 0, x, y, radius);
    const center = mixColor('#C2423D', '#EAA79D', pale);
    body.addColorStop(0, center);
    body.addColorStop(0.5, mixColor('#B9363A', '#E39A91', pale * 0.8));
    body.addColorStop(1, '#9C1E27');
    ctx.globalAlpha = 1 - burst * 0.88;
    ctx.fillStyle = body;
    ctx.fill();
    ctx.globalAlpha = 1 - burst * 0.6;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(96, 12, 20, 0.55)';
    ctx.stroke();
    ctx.globalAlpha = 1;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawPlant(ctx, metrics) {
  const { fill } = metrics;
  ctx.fillStyle = '#7A5A43';
  ctx.fillRect(-WORLD / 2, -WORLD / 2, WORLD, WORLD);
  const { w, h } = PLANT_CELL;
  const wall = 4;
  PLANT.forEach((cell) => {
    const left = cell.x - w / 2 + wall / 2;
    const top = cell.y - h / 2 + wall / 2;
    const innerW = w - wall;
    const innerH = h - wall;
    ctx.fillStyle = '#F1E8E2';
    ctx.fillRect(left, top, innerW, innerH);

    // Protoplas (isi sel + vakuola ungu). Saat plasmolisis ia mengecil dan membulat.
    const amount = 1 - (1 - fill) * cell.shrink;
    const pw = innerW * amount;
    const ph = innerH * Math.min(1, amount + (1 - amount) * 0.35);
    const shift = (innerW - pw) * cell.pull;
    const px = cell.x - pw / 2 + shift;
    const py = cell.y - ph / 2;
    const roundness = 3 + (1 - amount) * 70;
    const pigment = clamp01((1 - amount) * 1.6);
    roundRect(ctx, px, py, pw, ph, roundness);
    ctx.fillStyle = `rgba(${Math.round(lerp(196, 120, pigment))}, ${Math.round(lerp(92, 30, pigment))}, ${Math.round(lerp(150, 104, pigment))}, ${lerp(0.5, 0.82, pigment)})`;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(90, 30, 70, 0.45)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(px + pw * 0.28, cell.y + ph * 0.12, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(70, 60, 70, 0.55)';
    ctx.fill();
  });
}

function arrow(ctx, fromX, fromY, toX, toY, alpha) {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = WATER_BLUE;
  ctx.fillStyle = WATER_BLUE;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX - Math.cos(angle) * 8, toY - Math.sin(angle) * 8);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - Math.cos(angle - 0.5) * 16, toY - Math.sin(angle - 0.5) * 16);
  ctx.lineTo(toX - Math.cos(angle + 0.5) * 16, toY - Math.sin(angle + 0.5) * 16);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
}

// Panah biru = arah air. "in" masuk sel, "out" keluar sel, "both" seimbang.
function drawWater(ctx, cell, direction, alpha, time) {
  if (!direction || alpha <= 0) return;
  const rx = cell === 'hewan' ? RBC_RADIUS + 18 : PLANT_CELL.w / 2 + 6;
  const ry = cell === 'hewan' ? RBC_RADIUS + 18 : PLANT_CELL.h / 2 + 6;
  const length = 38;
  const pulse = (time * 0.9) % 1;
  const angles = cell === 'hewan' ? [0, 1, 2, 3, 4, 5].map((i) => (i / 6) * Math.PI * 2 + 0.3) : [0, Math.PI, -Math.PI / 2, Math.PI / 2];
  angles.forEach((a, index) => {
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    const near = [cos * rx, sin * ry];
    const far = [cos * (rx + length), sin * (ry + length)];
    const travel = (pulse * 6) % 6;
    const fade = alpha * (0.75 + 0.25 * Math.sin(time * 3 + index));
    if (direction === 'in') arrow(ctx, far[0], far[1], near[0] + cos * travel, near[1] + sin * travel, fade);
    else if (direction === 'out') arrow(ctx, near[0], near[1], far[0] + cos * travel, far[1] + sin * travel, fade);
    else {
      const side = [-sin * 9, cos * 9];
      arrow(ctx, far[0] + side[0], far[1] + side[1], near[0] + side[0], near[1] + side[1], fade);
      arrow(ctx, near[0] - side[0], near[1] - side[1], far[0] - side[0], far[1] - side[1], fade);
    }
  });
}

function drawDrop(ctx, solution, since) {
  if (since < 0 || since > DROP_SECONDS + 1.1) return;
  const tint = { hipotonik: '120, 176, 240', isotonik: '150, 190, 210', hipertonik: '70, 110, 190' }[solution];
  if (since <= DROP_SECONDS) {
    const t = since / DROP_SECONDS;
    const y = lerp(-FIELD_RADIUS, 0, t * t);
    ctx.fillStyle = `rgba(${tint}, 0.75)`;
    ctx.beginPath();
    ctx.moveTo(0, y - 26);
    ctx.bezierCurveTo(12, y - 8, 16, y + 4, 0, y + 14);
    ctx.bezierCurveTo(-16, y + 4, -12, y - 8, 0, y - 26);
    ctx.fill();
    return;
  }
  const ripple = (since - DROP_SECONDS) / 1.1;
  [0, 0.18].forEach((delay) => {
    const t = clamp01(ripple - delay);
    if (t <= 0 || t >= 1) return;
    ctx.strokeStyle = `rgba(${tint}, ${0.7 * (1 - t)})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, t * FIELD_RADIUS * 0.9, 0, Math.PI * 2);
    ctx.stroke();
  });
}

function drawEyepiece(ctx) {
  const shade = ctx.createRadialGradient(0, 0, FIELD_RADIUS * 0.62, 0, 0, FIELD_RADIUS);
  shade.addColorStop(0, 'rgba(0, 0, 0, 0)');
  shade.addColorStop(1, 'rgba(0, 0, 0, 0.82)');
  ctx.fillStyle = shade;
  ctx.fillRect(-WORLD / 2, -WORLD / 2, WORLD, WORLD);
}

export function drawField(ctx, size, { cell, solution, progress, since = 99, time = 0, water = null }) {
  const scale = size / WORLD;
  ctx.setTransform(scale, 0, 0, scale, size / 2, size / 2);
  ctx.clearRect(-WORLD / 2, -WORLD / 2, WORLD, WORLD);
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, FIELD_RADIUS, 0, Math.PI * 2);
  ctx.clip();
  const metrics = cellMetrics(cell, solution, progress);
  if (cell === 'hewan') drawBlood(ctx, metrics, time);
  else drawPlant(ctx, metrics);
  const arrowsVisible = cell === 'hewan' && metrics.burst > 0.5 ? 1 - metrics.burst : 1;
  drawWater(ctx, cell, water, clamp01(progress * 3) * arrowsVisible, time);
  drawDrop(ctx, solution, since);
  drawEyepiece(ctx);
  ctx.restore();
  return metrics;
}

function fitCanvas(canvas) {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const size = Math.round(canvas.clientWidth * ratio);
  if (canvas.width !== size) {
    canvas.width = size;
    canvas.height = size;
  }
  return size;
}

export function renderStill(canvas, cell, solution) {
  const size = fitCanvas(canvas);
  drawField(canvas.getContext('2d'), size, { cell, solution, progress: 1, time: 1.2 });
}

export function createMicroscope(canvas, { onChange, reduceMotion }) {
  const ctx = canvas.getContext('2d');
  const view = { cell: 'hewan', solution: null, water: null, droppedAt: null };
  let visible = true;
  let running = true;
  const startedAt = performance.now();

  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);
    if (!visible) return;
    const size = fitCanvas(canvas);
    const time = reduceMotion ? 0 : (now - startedAt) / 1000;
    const since = view.droppedAt === null ? 99 : (now - view.droppedAt) / 1000;
    const progress = view.solution === null ? 0 : reduceMotion ? 1 : easeInOut(clamp01((since - CHANGE_START) / CHANGE_SECONDS));
    const metrics = drawField(ctx, size, { cell: view.cell, solution: view.solution, progress, since: reduceMotion ? 99 : since, time, water: view.water });
    onChange?.({ ...metrics, progress, done: progress >= 1 });
  }

  const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
  observer.observe(canvas);
  requestAnimationFrame(frame);

  return {
    setCell(cell) {
      view.cell = cell;
      view.solution = null;
      view.water = null;
      view.droppedAt = null;
    },
    drop(solution, water) {
      view.solution = solution;
      view.water = water;
      view.droppedAt = performance.now();
    },
    dispose() {
      running = false;
      observer.disconnect();
    },
  };
}
