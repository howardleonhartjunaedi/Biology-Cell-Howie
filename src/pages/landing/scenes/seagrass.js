import * as THREE from 'three';
import fragmentShader from '../shaders/caustics.frag.glsl?raw';
import { labEnvironment } from '../../../core/materials.js';
import { createGodRays } from './god-rays.js';
import { createDepthDust } from './depth.js';
import { addSway, createDriftParticles, lerp, makeCamera, seededRandom, smooth } from './shared.js';

const WATER = new THREE.Color('#0D4A45');
const FOG_DENSITY = 0.05;
const MEADOW = { minX: -4, maxX: 22, minZ: -16, maxZ: 1 };

const SAND_VERTEX = `
varying vec2 vUv;
varying vec3 vWorldPos;
void main() {
  vUv = uv;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorldPos = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

function bladeGeometry() {
  const geometry = new THREE.PlaneGeometry(0.06, 1, 1, 8);
  geometry.translate(0, 0.5, 0);
  // Daun lamun meruncing ke ujung dan sedikit melengkung, bukan pita lurus.
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const y = pos.getY(i);
    pos.setX(i, pos.getX(i) * (1 - y * 0.75));
    pos.setZ(i, y * y * 0.12);
  }
  geometry.computeVertexNormals();
  return geometry;
}

function createMeadow(count, area = MEADOW, { seed = 57, height = [0.9, 2.2], width = 1, shades = ['#2E7D4F', '#3F9A5E', '#24603F', '#4FA86A'] } = {}) {
  const material = new THREE.MeshStandardMaterial({ color: '#2E7D4F', roughness: 0.45, side: THREE.DoubleSide });
  const sway = addSway(material, { strength: 0.35, speed: 1.4 });
  const mesh = new THREE.InstancedMesh(bladeGeometry(), material, count);
  const random = seededRandom(seed);
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();

  for (let i = 0; i < count; i += 1) {
    const position = new THREE.Vector3(area.minX + random() * (area.maxX - area.minX), 0, area.minZ + random() * (area.maxZ - area.minZ));
    quaternion.setFromEuler(new THREE.Euler((random() - 0.5) * 0.3, random() * Math.PI, (random() - 0.5) * 0.3));
    matrix.compose(position, quaternion, new THREE.Vector3(width, height[0] + random() * (height[1] - height[0]), 1));
    mesh.setMatrixAt(i, matrix);
    mesh.setColorAt(i, new THREE.Color(shades[i % shades.length]));
  }
  return { mesh, sway };
}

export function createSeagrassScene({ tier, renderer }) {
  const scene = new THREE.Scene();
  const camera = makeCamera(50);
  scene.background = WATER.clone();
  scene.fog = new THREE.FogExp2(WATER.clone(), FOG_DENSITY);

  const sandUniforms = {
    uTime: { value: 0 },
    uSand: { value: new THREE.Color('#8A7A58') },
    uLight: { value: new THREE.Color('#FFF4D6') },
    uFogColor: { value: WATER.clone() },
    uFogDensity: { value: FOG_DENSITY },
  };
  const sand = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 120),
    new THREE.ShaderMaterial({ uniforms: sandUniforms, vertexShader: SAND_VERTEX, fragmentShader })
  );
  sand.rotation.x = -Math.PI / 2;
  scene.add(sand);

  const meadow = createMeadow(tier === 'high' ? 2400 : 1200);
  scene.add(meadow.mesh);
  // Lamun latar depan: lebih tinggi, lebih gelap (membelakangi cahaya), dan dilewati kamera.
  // Inilah yang membuat kamera terasa "berada di dalam" padang lamun, bukan melihat dari luar.
  const foreground = createMeadow(tier === 'low' ? 70 : 130, { minX: 1, maxX: 10, minZ: 2.5, maxZ: 8 }, {
    seed: 91,
    height: [1.6, 3],
    width: 2.2,
    shades: ['#24603F', '#2A6B47', '#1F5236'],
  });
  scene.add(foreground.mesh);
  const dust = createDepthDust({ tier, color: '#D7F5D9' });
  scene.add(dust.group);

  const rays = createGodRays({ count: tier === 'high' ? 9 : 5, top: 10, length: 14, spread: 30, strength: 0.14 });
  scene.add(rays.group);

  const particles = createDriftParticles({
    count: tier === 'high' ? 500 : 250,
    spread: new THREE.Vector3(30, 8, 30),
    color: '#D7F5D9',
    size: 0.04,
    opacity: 0.4,
  });
  particles.points.position.y = 3;
  scene.add(particles.points);

  scene.environment = labEnvironment(renderer);
  scene.environmentIntensity = 0.3;
  scene.add(new THREE.HemisphereLight('#DDF7E4', '#2C2A1E', 1.1));
  const sun = new THREE.DirectionalLight('#FFF4D6', 1.4);
  sun.position.set(-3, 10, 4);
  scene.add(sun);

  function update(dt, progress, time) {
    sandUniforms.uTime.value = time;
    meadow.sway.uTime.value = time;
    foreground.sway.uTime.value = time;
    rays.update(time);
    particles.update(time);

    const glide = smooth(progress);
    camera.position.set(lerp(-6, 4, glide), lerp(4, 2.2, glide), lerp(9, 4.5, glide));
    camera.lookAt(lerp(6, 9, glide), lerp(0.6, 1, glide), lerp(-5, -3, glide));
    dust.update(time, camera);
  }

  return { scene, camera, update };
}
