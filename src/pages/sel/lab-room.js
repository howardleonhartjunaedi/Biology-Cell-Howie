import * as THREE from 'three';
import { useLabLighting } from '../../core/materials.js';
import { createDriftParticles } from '../landing/scenes/shared.js';

const BACKGROUND = new THREE.Color('#0E1116');
const FLOOR_Y = -3.6;
const SPOT_INTENSITY = 260;

export function createLabRoom(scene, renderer) {
  scene.background = BACKGROUND;
  scene.fog = new THREE.Fog(BACKGROUND, 14, 34);
  useLabLighting(scene, renderer, { intensity: 0.45 });

  const grid = new THREE.GridHelper(60, 60, '#26303A', '#1A2128');
  grid.position.y = FLOOR_Y;
  grid.material.transparent = true;
  grid.material.opacity = 0.5;
  scene.add(grid);

  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(3.2, 3.5, 0.5, 96),
    new THREE.MeshPhysicalMaterial({ color: '#B8F1EC', roughness: 0.1, metalness: 0, clearcoat: 1, transparent: true, opacity: 0.18 })
  );
  pedestal.position.y = FLOOR_Y + 0.25;
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(3.2, 0.025, 12, 160),
    new THREE.MeshBasicMaterial({ color: '#1FC8C8', transparent: true, opacity: 0.8 })
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = FLOOR_Y + 0.5;
  scene.add(pedestal, rim);

  const spot = new THREE.SpotLight('#FFF4D6', 0, 30, 0.42, 0.5, 1.6);
  spot.position.set(0, 12, 2);
  spot.target.position.set(0, FLOOR_Y, 0);
  scene.add(spot, spot.target);

  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(4.6, 14, 64, 1, true),
    new THREE.MeshBasicMaterial({ color: '#FFF4D6', transparent: true, opacity: 0, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  cone.position.y = 12 - 7;
  scene.add(cone);

  const dust = createDriftParticles({ count: 220, spread: new THREE.Vector3(10, 12, 8), color: '#FFF4D6', size: 0.03, opacity: 0.35 });
  dust.points.position.y = 1;
  scene.add(dust.points);

  function setLight(amount) {
    spot.intensity = SPOT_INTENSITY * amount;
    cone.material.opacity = 0.05 * amount;
  }

  return { setLight, update: (time) => dust.update(time) };
}
