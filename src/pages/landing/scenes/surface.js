import * as THREE from 'three';
import vertexShader from '../shaders/water.vert.glsl?raw';
import fragmentShader from '../shaders/water.frag.glsl?raw';
import { createForestLayers } from './forest-layers.js';
import { createGodRays } from './god-rays.js';
import { createDriftParticles, lerp, makeCamera, rangeT, smooth } from './shared.js';

const SKY = new THREE.Color('#BFE9EA');
const UNDERWATER = new THREE.Color('#0B5A6A');
const ABOVE_FOG = 0.012;
const BELOW_FOG = 0.06;
const DIVE_START = 0.35;

export function createSurfaceScene({ tier }) {
  const scene = new THREE.Scene();
  const camera = makeCamera(55);
  scene.background = SKY.clone();
  scene.fog = new THREE.FogExp2(SKY.clone(), ABOVE_FOG);

  const sunDir = new THREE.Vector3(-0.3, 0.55, -1).normalize();
  const uniforms = {
    uTime: { value: 0 },
    uShallow: { value: new THREE.Color('#1FC8C8') },
    uDeep: { value: new THREE.Color('#0A6E7E') },
    uUnderside: { value: new THREE.Color('#9FE3E0') },
    uSunDir: { value: sunDir },
    uFogColor: { value: SKY.clone() },
    uFogDensity: { value: ABOVE_FOG },
  };
  const segments = tier === 'high' ? 160 : 96;
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200, segments, segments),
    new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, side: THREE.DoubleSide })
  );
  water.rotation.x = -Math.PI / 2;
  scene.add(water);

  scene.add(createForestLayers());

  const bubbles = createDriftParticles({
    count: tier === 'high' ? 900 : 400,
    spread: new THREE.Vector3(40, 14, 40),
    color: '#CFF6F2',
    size: 0.06,
    opacity: 0.55,
  });
  bubbles.points.position.y = -8;
  scene.add(bubbles.points);

  const rays = createGodRays({ count: tier === 'high' ? 10 : 6, top: -0.2, length: 16, spread: 30 });
  scene.add(rays.group);

  scene.add(new THREE.HemisphereLight('#E8FFFB', '#0B5A6A', 1.2));

  function update(dt, progress, time) {
    uniforms.uTime.value = time;
    bubbles.update(time);
    rays.update(time);

    const drift = rangeT(progress, 0, DIVE_START);
    const dive = smooth(rangeT(progress, DIVE_START, 1));
    const height = lerp(2.4, 1.6, drift) - dive * 9;
    camera.position.set(Math.sin(time * 0.2) * 0.15, height, lerp(8, 4, drift) - dive * 6);

    const pitch = lerp(lerp(-0.08, -0.22, drift), 0.32, dive) - Math.sin(dive * Math.PI) * 0.6;
    camera.rotation.set(pitch, 0, Math.sin(time * 0.3) * 0.01);

    const under = camera.position.y < 0;
    const color = under ? UNDERWATER : SKY;
    const density = under ? BELOW_FOG : ABOVE_FOG;
    scene.background.copy(color);
    scene.fog.color.copy(color);
    scene.fog.density = density;
    uniforms.uFogColor.value.copy(color);
    uniforms.uFogDensity.value = density;
    bubbles.points.visible = under;
    rays.group.visible = under;
  }

  return { scene, camera, update };
}
