// Merakit video walkthrough sementara (Beranda) dari klip Pexels + render sel Lab Sel.
// Hasil: assets-src/walkthrough.mp4 (1280×720, 30 fps). Pakai: node tools/make-walkthrough.mjs
// Jika Howard sudah punya walkthrough.mp4 hasil edit DaVinci, alat ini tidak perlu dijalankan.
import { spawnSync } from 'node:child_process';

const DIR = 'assets-src/candidates';
const OUT = 'assets-src/walkthrough.mp4';
const FADE = 1;
const SIZE = '1280:720';

// Urutan cerita: permukaan → ikan → sel hewan → karang → lamun → sel tumbuhan (foto + render) → dasar laut
const SEGMENTS = [
  { input: ['-ss', '2', '-t', '5', '-i', `${DIR}/01-surface.mp4`], duration: 5 },
  { input: ['-ss', '5', '-t', '6', '-i', `${DIR}/02-fish.mp4`], duration: 6 },
  { input: ['-framerate', '10', '-i', `${DIR}/cell-hewan/f_%03d.png`], duration: 5 },
  { input: ['-ss', '8', '-t', '6', '-i', `${DIR}/03-coral.mp4`], duration: 6 },
  { input: ['-ss', '4', '-t', '6', '-i', `${DIR}/04-seagrass.mp4`], duration: 6 },
  { input: ['-loop', '1', '-t', '3.5', '-i', `${DIR}/05-plant-cells.jpg`], duration: 3.5, photo: true },
  { input: ['-framerate', '10', '-i', `${DIR}/cell-tumbuhan/f_%03d.png`], duration: 5 },
  { input: ['-ss', '10', '-t', '5', '-i', `${DIR}/06-seabed.mp4`], duration: 5 },
];

// Grade seragam: sedikit kurang jenuh, bayangan ke arah teal, kontras naik sedikit.
const GRADE = 'eq=saturation=0.88:contrast=1.06:brightness=-0.02,colorbalance=rs=-0.06:gs=0.02:bs=0.05:rm=-0.03:bm=0.03';

const prepare = (segment, i) => {
  const fit = segment.photo
    ? `scale=2560:-2,crop=2560:1440,zoompan=z='1+0.0012*on':d=${Math.round(segment.duration * 30)}:s=1280x720:fps=30`
    : `scale=${SIZE}:force_original_aspect_ratio=increase,crop=${SIZE},fps=30`;
  return `[${i}:v]${fit},trim=duration=${segment.duration},setpts=PTS-STARTPTS,format=yuv420p,setsar=1,${GRADE},settb=AVTB[v${i}]`;
};

const filters = SEGMENTS.map(prepare);
let last = 'v0';
let offset = 0;
SEGMENTS.slice(1).forEach((segment, index) => {
  offset += SEGMENTS[index].duration - FADE;
  const label = `x${index + 1}`;
  filters.push(`[${last}][v${index + 1}]xfade=transition=fade:duration=${FADE}:offset=${offset.toFixed(2)}[${label}]`);
  last = label;
});

const args = [
  '-y',
  ...SEGMENTS.flatMap((segment) => segment.input),
  '-filter_complex', filters.join(';'),
  '-map', `[${last}]`,
  '-an', '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p',
  OUT,
];

const result = spawnSync('ffmpeg', args, { stdio: 'inherit' });
process.exit(result.status ?? 1);
