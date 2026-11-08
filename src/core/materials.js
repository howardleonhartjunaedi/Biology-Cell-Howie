import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const environments = new WeakMap();

export function labEnvironment(renderer) {
  if (!environments.has(renderer)) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    environments.set(renderer, texture);
  }
  return environments.get(renderer);
}

export function useLabLighting(scene, renderer, { intensity = 0.6, key = '#FFF4D6', rim = '#1FC8C8' } = {}) {
  scene.environment = labEnvironment(renderer);
  scene.environmentIntensity = intensity;

  const keyLight = new THREE.DirectionalLight(key, 2.2);
  keyLight.position.set(-4, 6, 5);
  const rimLight = new THREE.DirectionalLight(rim, 1.3);
  rimLight.position.set(5, -1, -6);
  const fill = new THREE.HemisphereLight('#DFFFFB', '#06202A', 0.5);
  scene.add(keyLight, rimLight, fill);
}
