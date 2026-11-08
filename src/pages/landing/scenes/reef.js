import * as THREE from 'three';
import { createFishSchool } from './fish-school.js';
import { createCoralGarden } from './coral-garden.js';
import { createGodRays } from './god-rays.js';
import { createDriftParticles, lerp, makeCamera, rangeT, smooth } from './shared.js';

const WATER = new THREE.Color('#0A4F5E');
const FLOOR_Y = -6;
const CORAL_CENTER = new THREE.Vector3(34, FLOOR_Y, 0);
const CORAL_START = 0.6;
const VIEW_SHIFT = 0.2;

export function createReefScene({ tier }) {
  const scene = new THREE.Scene();
  const camera = makeCamera(50);
  scene.background = WATER.clone();
  scene.fog = new THREE.FogExp2(WATER.clone(), 0.045);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({ color: '#C9B78F', roughness: 1 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = FLOOR_Y;
  scene.add(floor);

  const school = createFishSchool({ count: tier === 'high' ? 90 : 50 });
  scene.add(school.mesh);

  const coral = createCoralGarden({ center: CORAL_CENTER, branches: tier === 'high' ? 90 : 54, mounds: tier === 'high' ? 26 : 16 });
  scene.add(coral.group);

  const rays = createGodRays({ count: tier === 'high' ? 12 : 7, top: 8, length: 22, spread: 60, strength: 0.16 });
  rays.group.position.x = 14;
  scene.add(rays.group);

  const particles = createDriftParticles({
    count: tier === 'high' ? 700 : 350,
    spread: new THREE.Vector3(80, 16, 40),
    color: '#BFEDE8',
    size: 0.05,
    opacity: 0.45,
  });
  particles.points.position.x = 16;
  scene.add(particles.points);

  scene.add(new THREE.HemisphereLight('#BFF3EE', '#3A3226', 1.4));
  const sun = new THREE.DirectionalLight('#FFF4D6', 1.6);
  sun.position.set(-4, 12, 6);
  scene.add(sun);

  const leader = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();
  const follow = new THREE.Vector3();
  const coralView = new THREE.Vector3();
  const coralTarget = new THREE.Vector3();
  const outward = new THREE.Vector3();

  function update(dt, progress, time) {
    school.update(time);
    coral.update(time);
    rays.update(time);
    particles.update(time);

    const followT = rangeT(progress, 0, CORAL_START);
    school.leader(time, leader);
    outward.copy(leader).setY(0).normalize();
    follow.copy(leader).addScaledVector(outward, lerp(10, 2.6, followT));
    follow.y += lerp(2, 0.3, followT);

    const coralT = smooth(rangeT(progress, CORAL_START, 1));
    coralView.set(CORAL_CENTER.x - 10 + coralT * 12, FLOOR_Y + 3.2, 9);
    camera.position.lerpVectors(follow, coralView, coralT);
    coralTarget.set(CORAL_CENTER.x + coralT * 4, FLOOR_Y + 1, 0);
    lookTarget.lerpVectors(leader, coralTarget, coralT);
    camera.lookAt(lookTarget);
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (width > 900) camera.setViewOffset(width, height, -width * VIEW_SHIFT, 0, width, height);
    else camera.clearViewOffset();
  }

  return { scene, camera, update };
}
