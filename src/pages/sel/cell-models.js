import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { partMaterial, stackedArcs } from '../landing/scenes/cell-parts.js';
import { seededRandom } from '../landing/scenes/shared.js';

export const CUT_PLANE = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.15);
export const SHELL_IDS = ['membran-plasma', 'sitoplasma', 'dinding-sel'];

function shellMaterial(color, opacity, side = THREE.DoubleSide) {
  return new THREE.MeshPhysicalMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0,
    roughness: 0.3,
    clearcoat: 0.6,
    transparent: true,
    opacity,
    side,
    depthWrite: false,
    clippingPlanes: [CUT_PLANE],
  });
}

function tag(object, id) {
  object.traverse((child) => {
    if (child.isMesh) child.userData.organelle = id;
  });
  object.userData.organelle = id;
  return object;
}

function addTagged(group, object, id) {
  group.add(tag(object, id));
  return object;
}

function place(group, mesh, [x, y, z], rotation = [0, 0, 0]) {
  mesh.position.set(x, y, z);
  mesh.rotation.set(...rotation);
  group.add(mesh);
  return mesh;
}

// Nukleus terpotong: membran inti dua lapis, pori nukleus, nukleoplasma, kromatin, dan nukleolus.
function nucleus(position, scale = 1) {
  const group = new THREE.Group();
  const cut = { clippingPlanes: [CUT_PLANE], side: THREE.DoubleSide };
  const outer = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), partMaterial('#3D7FC4', cut));
  const inner = new THREE.Mesh(new THREE.SphereGeometry(0.93, 64, 48), partMaterial('#5A9BDB', cut));
  const plasm = new THREE.Mesh(new THREE.SphereGeometry(0.9, 48, 32), partMaterial('#21466F', { ...cut, transparent: true, opacity: 0.55, depthWrite: false }));

  const random = seededRandom(5);
  const poreCount = 46;
  const pores = new THREE.InstancedMesh(new THREE.TorusGeometry(0.06, 0.022, 8, 18), partMaterial('#B8F1EC', cut), poreCount);
  const matrix = new THREE.Matrix4();
  const up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < poreCount; i += 1) {
    const dir = new THREE.Vector3(random() - 0.5, random() - 0.5, -random() * 0.9 - 0.1).normalize();
    matrix.lookAt(new THREE.Vector3(), dir, up).setPosition(dir.multiplyScalar(1.005));
    pores.setMatrixAt(i, matrix);
  }

  const points = [];
  // Kromatin = benang tipis yang kusut, jadi titik jalurnya diacak di dalam nukleus.
  const point = new THREE.Vector3(0, 0, -0.3);
  for (let i = 0; i < 90; i += 1) {
    point.add(new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).multiplyScalar(0.32));
    if (point.length() > 0.72) point.multiplyScalar(0.6);
    point.z = Math.min(point.z, 0.05);
    points.push(point.clone());
  }
  const chromatin = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 540, 0.012, 5), partMaterial('#E0B060', { roughness: 0.6 }));

  const nucleolus = new THREE.Mesh(new THREE.IcosahedronGeometry(0.32, 4), partMaterial('#1E3F66', { roughness: 0.7 }));
  nucleolus.position.set(0.18, 0.1, -0.15);
  group.add(outer, inner, plasm, pores, chromatin, nucleolus);
  group.position.copy(position);
  group.scale.setScalar(scale);
  return group;
}

// Mitokondria: membran luar tembus pandang, di dalamnya krista (lipatan membran dalam) terlihat.
const MITO = {
  outer: new THREE.CapsuleGeometry(0.2, 0.55, 12, 28),
  matrix: new THREE.CapsuleGeometry(0.16, 0.5, 10, 24),
  cristae: (() => {
    const folds = [];
    for (let i = 0; i < 6; i += 1) {
      const fold = new THREE.CapsuleGeometry(0.025, 0.16, 4, 10);
      fold.rotateX(Math.PI / 2);
      fold.scale(1, 1, 2.2);
      fold.translate(0, -0.3 + i * 0.12, i % 2 ? 0.05 : -0.05);
      folds.push(fold);
    }
    return mergeGeometries(folds);
  })(),
};

function mitochondrion(materials) {
  const group = new THREE.Group();
  group.add(new THREE.Mesh(MITO.outer, materials.outer), new THREE.Mesh(MITO.matrix, materials.matrix), new THREE.Mesh(MITO.cristae, materials.cristae));
  group.scale.set(1, 1, 0.85);
  return group;
}

// Lisosom: kantong bermembran berisi butiran enzim hidrolitik.
function lysosome(materials, random) {
  const group = new THREE.Group();
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 20), materials.shell));
  for (let i = 0; i < 7; i += 1) {
    const grain = new THREE.Mesh(new THREE.IcosahedronGeometry(0.035, 1), materials.grain);
    grain.position.set((random() - 0.5) * 0.2, (random() - 0.5) * 0.2, (random() - 0.5) * 0.2);
    group.add(grain);
  }
  return group;
}

// Peroksisom: kantong bermembran dengan inti kristal (enzim katalase).
function peroxisome(materials) {
  const group = new THREE.Group();
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.08), materials.core);
  core.scale.set(1, 1.3, 1);
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.17, 32, 20), materials.shell), core);
  return group;
}

// Sentriol: tabung dari 9 triplet mikrotubulus (sesuai KONTEN §3.2), sepasang dan saling tegak lurus.
function centrioleGeometry() {
  const tubes = [];
  for (let i = 0; i < 9; i += 1) {
    const angle = (i / 9) * Math.PI * 2;
    for (let j = 0; j < 3; j += 1) {
      const tubule = new THREE.CylinderGeometry(0.022, 0.022, 0.42, 8);
      const r = 0.1 + j * 0.035;
      const a = angle + j * 0.22;
      tubule.translate(Math.cos(a) * r, 0, Math.sin(a) * r);
      tubes.push(tubule);
    }
  }
  return mergeGeometries(tubes);
}

// Ribosom: dua subunit (besar dan kecil).
function ribosomeGeometry() {
  const large = new THREE.SphereGeometry(0.045, 10, 8);
  const small = new THREE.SphereGeometry(0.032, 8, 6);
  small.translate(0.035, 0.03, 0);
  return mergeGeometries([large, small]);
}

// Ribosom yang menempel di permukaan RE kasar (yang membuatnya "kasar").
function studRibosomes(arcs, random) {
  const geometry = ribosomeGeometry();
  geometry.scale(0.7, 0.7, 0.7);
  const material = partMaterial('#E8D7A8');
  arcs.children.forEach((tube) => {
    const pos = tube.geometry.attributes.position;
    const normal = tube.geometry.attributes.normal;
    const count = 60;
    const dots = new THREE.InstancedMesh(geometry, material, count);
    const matrix = new THREE.Matrix4();
    const p = new THREE.Vector3();
    const n = new THREE.Vector3();
    for (let i = 0; i < count; i += 1) {
      const index = Math.floor(random() * pos.count);
      p.fromBufferAttribute(pos, index);
      n.fromBufferAttribute(normal, index);
      p.addScaledVector(n, 0.03);
      matrix.makeTranslation(p.x, p.y, p.z);
      dots.setMatrixAt(i, matrix);
    }
    tube.add(dots);
  });
}

// Kloroplas: membran luar tembus pandang dengan tumpukan tilakoid (grana) di dalam.
const CHLORO = (() => {
  const outer = new THREE.SphereGeometry(0.28, 32, 20);
  outer.scale(1.6, 0.8, 1);
  const discs = [];
  [-0.24, 0, 0.24].forEach((x) => {
    for (let i = 0; i < 4; i += 1) {
      const disc = new THREE.CylinderGeometry(0.075, 0.075, 0.025, 16);
      disc.translate(x, -0.06 + i * 0.04, 0);
      discs.push(disc);
    }
  });
  return { outer, grana: mergeGeometries(discs) };
})();

function scatter(random, count, radius, make) {
  const group = new THREE.Group();
  for (let i = 0; i < count; i += 1) {
    const direction = new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).normalize();
    const distance = radius * (0.45 + random() * 0.5);
    const mesh = make(i);
    mesh.position.copy(direction.multiplyScalar(distance));
    mesh.rotation.set(random() * 3, random() * 3, random() * 3);
    group.add(mesh);
  }
  return group;
}

function ribosomes(random, count, radius) {
  const mesh = new THREE.InstancedMesh(ribosomeGeometry(), partMaterial('#E8D7A8'), count);
  const matrix = new THREE.Matrix4();
  const euler = new THREE.Euler();
  for (let i = 0; i < count; i += 1) {
    const point = new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).normalize().multiplyScalar(radius * (0.3 + random() * 0.65));
    matrix.makeRotationFromEuler(euler.set(random() * 6, random() * 6, random() * 6)).setPosition(point);
    mesh.setMatrixAt(i, matrix);
  }
  return mesh;
}

function sharedOrganelles(cell, random, { radius, nucleusAt }) {
  addTagged(cell, nucleus(nucleusAt), 'nukleus');

  const mitoMaterials = {
    outer: partMaterial('#FF7A59', { transparent: true, opacity: 0.5, depthWrite: false }),
    matrix: partMaterial('#C9503C'),
    cristae: partMaterial('#FFC2A8'),
  };
  addTagged(cell, scatter(random, 6, radius, () => mitochondrion(mitoMaterials)), 'mitokondria');

  const rough = stackedArcs({ count: 4, radius: 1.55, tube: 0.085, arc: Math.PI * 1.1, gap: 0.16, color: '#4CC38A' });
  studRibosomes(rough, random);
  rough.position.copy(nucleusAt);
  rough.rotation.set(0.3, 0.3, 2.4);
  tag(rough, 're-kasar');
  cell.add(rough);

  const smooth = stackedArcs({ count: 3, radius: 1.0, tube: 0.07, arc: Math.PI * 0.9, gap: 0.18, color: '#9ADBB0' });
  place(cell, smooth, [nucleusAt.x - 0.6, nucleusAt.y - 1.5, 0.2], [0.4, -0.2, 0.8]);
  tag(smooth, 're-halus');

  addTagged(cell, ribosomes(random, 140, radius), 'ribosom');

  const golgi = stackedArcs({ count: 5, radius: 0.55, tube: 0.1, arc: Math.PI * 0.9, gap: 0.16, color: '#F2B544' });
  // Vesikel yang lepas dari ujung sisterna (sisi trans).
  const vesicleMaterial = partMaterial('#FFF4D6');
  [[0.72, -0.12, 0.7], [0.62, -0.3, 0.45], [-0.62, 0.42, 0.75], [0.78, 0.12, 0.2]].forEach(([x, y, z], i) => {
    const vesicle = new THREE.Mesh(new THREE.SphereGeometry(0.06 + (i % 2) * 0.02, 20, 14), vesicleMaterial);
    vesicle.position.set(x, y, z);
    golgi.add(vesicle);
  });
  place(cell, golgi, [1.4, -1.1, -0.2], [0.6, -0.5, 0.9]);
  tag(golgi, 'golgi');

  cell.add(buildPeroxisomes(random, radius));
}

// Dipakai juga oleh animal-model.js, karena model sel hewan unduhan tidak punya peroksisom.
export function buildPeroxisomes(random, radius) {
  const materials = {
    shell: partMaterial('#D8B4A0', { transparent: true, opacity: 0.55, depthWrite: false }),
    core: partMaterial('#8C5A3C', { roughness: 0.25 }),
  };
  return tag(scatter(random, 3, radius, () => peroxisome(materials)), 'peroksisom');
}

export function buildAnimalCell() {
  const cell = new THREE.Group();
  const random = seededRandom(11);
  const membrane = new THREE.Mesh(new THREE.SphereGeometry(3, 64, 48), shellMaterial('#7FD6D0', 0.35));
  membrane.scale.set(1.12, 0.9, 1);
  tag(membrane, 'membran-plasma');
  const cytoplasm = new THREE.Mesh(new THREE.SphereGeometry(2.92, 48, 32), shellMaterial('#1B5560', 0.5, THREE.BackSide));
  cytoplasm.scale.copy(membrane.scale);
  tag(cytoplasm, 'sitoplasma');
  cell.add(membrane, cytoplasm);

  sharedOrganelles(cell, random, { radius: 2.4, nucleusAt: new THREE.Vector3(-0.3, 0.2, -0.3) });

  const lysoMaterials = {
    shell: partMaterial('#E5534B', { transparent: true, opacity: 0.6, depthWrite: false }),
    grain: partMaterial('#7A1E1E'),
  };
  addTagged(cell, scatter(random, 4, 2.4, () => lysosome(lysoMaterials, random)), 'lisosom');

  const centrioles = new THREE.Group();
  const tube = centrioleGeometry();
  const centrioleMaterial = partMaterial('#E8F4F2');
  const a = new THREE.Mesh(tube, centrioleMaterial);
  const b = new THREE.Mesh(tube, centrioleMaterial);
  b.rotation.z = Math.PI / 2;
  b.position.x = 0.26;
  centrioles.add(a, b);
  place(cell, centrioles, [1.0, 0.6, 0.6]);
  tag(centrioles, 'sentriol');
  return cell;
}

export function buildPlantCell() {
  const cell = new THREE.Group();
  const random = seededRandom(23);
  const size = new THREE.Vector3(6.4, 4.4, 4);
  const wall = new THREE.Mesh(new RoundedBoxGeometry(size.x, size.y, size.z, 6, 0.45), shellMaterial('#9CCB6E', 0.45));
  tag(wall, 'dinding-sel');
  const membrane = new THREE.Mesh(new RoundedBoxGeometry(size.x - 0.3, size.y - 0.3, size.z - 0.3, 6, 0.35), shellMaterial('#7FD6D0', 0.25));
  tag(membrane, 'membran-plasma');
  const cytoplasm = new THREE.Mesh(new RoundedBoxGeometry(size.x - 0.4, size.y - 0.4, size.z - 0.4, 4, 0.3), shellMaterial('#18463C', 0.5, THREE.BackSide));
  tag(cytoplasm, 'sitoplasma');
  cell.add(wall, membrane, cytoplasm);

  const vacuole = new THREE.Mesh(new RoundedBoxGeometry(3.6, 2.4, 2.2, 6, 0.8), partMaterial('#8FD3F0', { transparent: true, opacity: 0.55, depthWrite: false }));
  place(cell, vacuole, [0.5, -0.1, -0.4]);
  tag(vacuole, 'vakuola');

  sharedOrganelles(cell, random, { radius: 2.0, nucleusAt: new THREE.Vector3(-2.2, 0.9, -0.2) });
  const byId = (id) => cell.children.find((child) => child.userData.organelle === id);
  byId('nukleus').scale.setScalar(0.7);
  ['re-kasar', 're-halus'].forEach((id) => {
    byId(id).scale.setScalar(0.62);
    byId(id).position.x += 0.7;
  });

  const chloroMaterial = partMaterial('#3FA55A', { transparent: true, opacity: 0.6, depthWrite: false });
  const granaMaterial = partMaterial('#1F6B3A');
  const chloroplasts = new THREE.Group();
  for (let i = 0; i < 14; i += 1) {
    const chloro = new THREE.Mesh(CHLORO.outer, chloroMaterial);
    chloro.add(new THREE.Mesh(CHLORO.grana, granaMaterial));
    const top = i % 2 === 0;
    chloro.position.set((random() - 0.5) * 4.8, top ? 1.6 : -1.6, (random() - 0.5) * 2.4);
    chloro.rotation.set(random(), random() * 3, random());
    chloroplasts.add(chloro);
  }
  cell.add(chloroplasts);
  tag(chloroplasts, 'kloroplas');
  return cell;
}

export function organelleMeshes(cell) {
  const map = new Map();
  cell.traverse((child) => {
    if (!child.isMesh) return;
    const id = child.userData.organelle;
    if (!map.has(id)) map.set(id, []);
    map.get(id).push(child);
  });
  return map;
}
