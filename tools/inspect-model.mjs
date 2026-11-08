import { statSync } from 'node:fs';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';

const file = process.argv[2];
if (!file) {
  console.log('Pakai: node tools/inspect-model.mjs assets-src/nama.glb');
  process.exit(1);
}

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(file);
const root = doc.getRoot();

function countTriangles(mesh) {
  return mesh.listPrimitives().reduce((sum, prim) => {
    const indices = prim.getIndices();
    const count = indices ? indices.getCount() : prim.getAttribute('POSITION').getCount();
    return sum + count / 3;
  }, 0);
}

const meshes = root.listMeshes();
const triangles = meshes.reduce((sum, mesh) => sum + countTriangles(mesh), 0);

const materialUse = new Map();
for (const mesh of meshes) {
  for (const prim of mesh.listPrimitives()) {
    const name = prim.getMaterial()?.getName() || '(tanpa material)';
    materialUse.set(name, (materialUse.get(name) || 0) + 1);
  }
}

console.log(`File       : ${file}`);
console.log(`Ukuran     : ${(statSync(file).size / 1e6).toFixed(1)} MB`);
console.log(`Lisensi    : ${JSON.stringify(root.getAsset().extras ?? {})}`);
console.log(`Generator  : ${root.getAsset().generator ?? '-'}`);
console.log(`Node       : ${root.listNodes().length}`);
console.log(`Mesh       : ${meshes.length}`);
console.log(`Segitiga   : ${Math.round(triangles).toLocaleString('id-ID')}`);
console.log(`Tekstur    : ${root.listTextures().length}`);
console.log(`Material (${materialUse.size}) — nama : jumlah primitive`);
for (const [name, count] of materialUse) console.log(`  ${name} : ${count}`);
