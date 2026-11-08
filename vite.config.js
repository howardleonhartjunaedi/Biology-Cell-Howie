import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const pages = ['index', 'sel', 'gerbang-sel', 'lab-osmosis', 'kuis', 'rangkuman'];

const input = Object.fromEntries(
  pages.map((name) => [name, resolve(import.meta.dirname, `${name}.html`)])
);

export default defineConfig({
  build: {
    rollupOptions: { input },
  },
});
