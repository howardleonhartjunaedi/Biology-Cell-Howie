import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import vertexShader from '../shaders/water.vert.glsl?raw';
import fragmentShader from '../shaders/water.frag.glsl?raw';
import { createIslandLayers } from './island-layers.js';
import { createGodRays, rayTexture } from './god-rays.js';
import { loadSky } from './sky.js';
import { createDriftParticles, lerp, makeCamera, rangeT, smooth } from './shared.js';

const HAZE = new THREE.Color('#C9DDE2');
const UNDERWATER = new THREE.Color('#0B5A6A');
const ABOVE_FOG = 0.0032;
const BELOW_FOG = 0.06;
const DIVE_START = 0.35;
const FOV = 50;
const HORIZON_FROM_CENTER = 0.05;
const SUN_SIDE_ANGLE = 1.35;
const REFLECTION_SIZE = { high: 512, medium: 384, low: 256 };

function createSunShafts() {
  const group = new THREE.Group();
  const map = rayTexture();
  for (let i = 0; i < 5; i += 1) {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(14 + i * 3, 140),
      new THREE.MeshBasicMaterial({ map, color: '#FFE7C2', transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })
    );
    mesh.rotation.z = Math.PI + (i - 2) * 0.22;
    mesh.position.set((i - 2) * 6, 60, 0);
    group.add(mesh);
  }
  return group;
}

export function createSurfaceScene({ tier, renderer }) {
  const scene = new THREE.Scene();
  const camera = makeCamera(FOV);
  camera.rotation.order = 'YXZ';
  scene.background = HAZE.clone();
  scene.fog = new THREE.FogExp2(HAZE.clone(), ABOVE_FOG);

  const world = new THREE.Group();
  scene.add(world);
  const textureLoader = new THREE.TextureLoader();

  const waterNormals = textureLoader.load('/textures/waternormals.jpg');
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  const size = REFLECTION_SIZE[tier] ?? 384;
  const water = new Water(new THREE.PlaneGeometry(2400, 2400), {
    textureWidth: size,
    textureHeight: size,
    waterNormals,
    sunDirection: new THREE.Vector3(0.3, 0.2, -1).normalize(),
    sunColor: '#FFF1D6',
    waterColor: '#14A3A6',
    distortionScale: 2.4,
    fog: true,
  });
  water.rotation.x = -Math.PI / 2;
  water.material.uniforms.size.value = 3;
  scene.add(water);

  const undersideUniforms = {
    uTime: { value: 0 },
    uShallow: { value: new THREE.Color('#1FC8C8') },
    uDeep: { value: new THREE.Color('#0A6E7E') },
    uUnderside: { value: new THREE.Color('#9FE3E0') },
    uSunDir: { value: new THREE.Vector3(0, 1, 0) },
    uFogColor: { value: UNDERWATER.clone() },
    uFogDensity: { value: BELOW_FOG },
  };
  const underside = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200, 80, 80),
    new THREE.ShaderMaterial({ uniforms: undersideUniforms, vertexShader, fragmentShader, side: THREE.BackSide })
  );
  underside.rotation.x = -Math.PI / 2;
  underside.visible = false;
  scene.add(underside);

  const islands = createIslandLayers(textureLoader);
  world.add(islands.group);
  const shafts = createSunShafts();
  shafts.position.z = -160;
  world.add(shafts);

  const spray = createDriftParticles({ count: tier === 'high' ? 260 : 140, spread: new THREE.Vector3(30, 5, 24), color: '#FFF4D6', size: 0.025, opacity: 0.45 });
  spray.points.position.set(0, 2.2, -8);
  world.add(spray.points);

  const bubbles = createDriftParticles({ count: tier === 'high' ? 900 : 400, spread: new THREE.Vector3(40, 14, 40), color: '#CFF6F2', size: 0.06, opacity: 0.55 });
  bubbles.points.position.y = -8;
  world.add(bubbles.points);
  const rays = createGodRays({ count: tier === 'high' ? 10 : 6, top: -0.2, length: 16, spread: 30 });
  world.add(rays.group);

  scene.add(new THREE.HemisphereLight('#E8FFFB', '#0B5A6A', 0.6));

  let yaw = 0;
  let sky = null;
  loadSky(renderer, scene, (result) => {
    sky = result;
    water.material.uniforms.sunDirection.value.copy(result.sun);
    yaw = Math.atan2(-result.sun.x, -result.sun.z) + SUN_SIDE_ANGLE;
    world.rotation.y = yaw;
  });

  const pointer = new THREE.Vector2();
  const pointerTarget = new THREE.Vector2();
  const onPointer = (event) => pointerTarget.set((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1);
  window.addEventListener('pointermove', onPointer, { passive: true });

  const basePitch = -Math.atan(HORIZON_FROM_CENTER * 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
  const forward = new THREE.Vector3();

  function update(dt, progress, time) {
    water.material.uniforms.time.value = time * 0.6;
    undersideUniforms.uTime.value = time;
    pointer.lerp(pointerTarget, 1 - Math.exp(-3 * dt));
    bubbles.update(time);
    spray.update(time);
    rays.update(time);

    const drift = rangeT(progress, 0, DIVE_START);
    const dive = smooth(rangeT(progress, DIVE_START, 1));
    islands.update(pointer, drift);

    forward.set(-Math.sin(yaw), 0, -Math.cos(yaw));
    const travel = lerp(0, 3, drift) + dive * 6;
    const height = lerp(1.3, 1.0, drift) - dive * 8.5;
    camera.position.set(forward.x * travel, height, forward.z * travel);
    const pitch = lerp(basePitch, 0.3, dive) - Math.sin(dive * Math.PI) * 0.65 - drift * 0.04;
    camera.rotation.set(pitch - pointer.y * 0.01, yaw - pointer.x * 0.02, 0);

    const under = camera.position.y < 0;
    water.visible = !under;
    underside.visible = under;
    islands.group.visible = !under;
    shafts.visible = !under;
    spray.points.visible = !under;
    bubbles.points.visible = under;
    rays.group.visible = under;
    scene.fog.color.copy(under ? UNDERWATER : HAZE);
    scene.fog.density = under ? BELOW_FOG : ABOVE_FOG;
    if (under) scene.background = UNDERWATER;
    else if (sky) scene.background = sky.texture;
  }

  function dispose() {
    window.removeEventListener('pointermove', onPointer);
    water.material.uniforms.mirrorSampler.value?.dispose();
    sky?.texture.dispose();
    sky?.environment.dispose();
  }

  return { scene, camera, update, dispose };
}
