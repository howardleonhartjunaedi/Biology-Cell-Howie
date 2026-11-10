// Mencetak, untuk setiap material: nama node yang memakainya, warna dasar, jumlah segitiga,
// dan kotak batas (pusat + ukuran). Dipakai untuk memetakan material → organel di docs/ASSETS.md.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';
import { getBounds } from '@gltf-transform/functions';

const file = process.argv[2];
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'draco3d.decoder': await draco3d.createDecoderModule() });
const doc = await io.read(file);
const scene = doc.getRoot().getDefaultScene() ?? doc.getRoot().listScenes()[0];
const groups = new Map();

scene.traverse((node) => {
  const mesh = node.getMesh();
  if (!mesh) return;
  for (const prim of mesh.listPrimitives()) {
    const name = prim.getMaterial()?.getName() || '(tanpa material)';
    if (!groups.has(name)) groups.set(name, { material: prim.getMaterial(), nodes: [], triangles: 0, boxes: [] });
    const group = groups.get(name);
    group.nodes.push(node.getName());
    const indices = prim.getIndices();
    group.triangles += (indices ? indices.getCount() : prim.getAttribute('POSITION').getCount()) / 3;
    group.boxes.push(getBounds(node));
  }
});

const round = (v) => v.map((n) => Number(n.toFixed(2)));
for (const [name, g] of groups) {
  const min = [0, 1, 2].map((i) => Math.min(...g.boxes.map((b) => b.min[i])));
  const max = [0, 1, 2].map((i) => Math.max(...g.boxes.map((b) => b.max[i])));
  const color = g.material?.getBaseColorFactor().slice(0, 3).map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('');
  const center = round(min.map((v, i) => (v + max[i]) / 2));
  const size = round(max.map((v, i) => v - min[i]));
  const sample = [...new Set(g.nodes)].slice(0, 3).join(', ');
  console.log(`${name} | #${color} | node ${g.nodes.length} (${sample}) | segitiga ${Math.round(g.triangles)} | pusat ${center} | ukuran ${size}`);
}
