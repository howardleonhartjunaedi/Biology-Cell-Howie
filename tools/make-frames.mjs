// Memotong walkthrough.mp4 menjadi gambar WebP untuk scroll-scrub Beranda.
// Pakai: node tools/make-frames.mjs [assets-src/walkthrough.mp4]
// Hasil: public/seq/f_0001.webp … dan src/data/seq.json (jumlah frame, fps, ukuran).
import { spawnSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';

const INPUT = process.argv[2] ?? 'assets-src/walkthrough.mp4';
const OUT_DIR = 'public/seq';
const FPS = 10;
const WIDTH = 1280;
const QUALITY = 55;
const BUDGET_MB = 18;

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const result = spawnSync('ffmpeg', [
  '-y', '-loglevel', 'error', '-i', INPUT,
  '-vf', `fps=${FPS},scale=${WIDTH}:-2`,
  '-c:v', 'libwebp', '-quality', String(QUALITY), '-compression_level', '6',
  `${OUT_DIR}/f_%04d.webp`,
], { stdio: ['ignore', 'ignore', 'inherit'] });
if (result.status !== 0) process.exit(result.status ?? 1);

const files = readdirSync(OUT_DIR).filter((name) => name.endsWith('.webp')).sort();
const bytes = files.reduce((sum, name) => sum + statSync(`${OUT_DIR}/${name}`).size, 0);

writeFileSync('src/data/seq.json', `${JSON.stringify({ count: files.length, fps: FPS, width: WIDTH, height: Math.round((WIDTH * 9) / 16) }, null, 2)}\n`);
const megabytes = bytes / 1e6;
console.log(`${files.length} frame, ${megabytes.toFixed(1)} MB total${megabytes > BUDGET_MB ? `  ⚠ melebihi target ${BUDGET_MB} MB` : ''}`);
