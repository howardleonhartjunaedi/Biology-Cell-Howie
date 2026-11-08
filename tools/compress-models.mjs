import { execFileSync } from 'node:child_process';
import { readdirSync, mkdirSync } from 'node:fs';

const SOURCE_DIR = 'assets-src';
const OUTPUT_DIR = 'public/models';
const TEXTURE_SIZE = '1024';

mkdirSync(OUTPUT_DIR, { recursive: true });

const files = readdirSync(SOURCE_DIR).filter((name) => name.endsWith('.glb'));

for (const name of files) {
  const input = `${SOURCE_DIR}/${name}`;
  const output = `${OUTPUT_DIR}/${name}`;
  console.log(`Mengompres ${input} -> ${output}`);
  execFileSync(
    'npx',
    ['gltf-transform', 'optimize', input, output,
      '--compress', 'meshopt',
      '--texture-compress', 'webp',
      '--texture-size', TEXTURE_SIZE],
    { stdio: 'inherit', shell: true }
  );
}
