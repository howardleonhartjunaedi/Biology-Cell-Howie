import * as THREE from 'three';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';

const HDRI_URL = '/hdri/qwantani_morning_puresky_1k.hdr';

function findSun(texture) {
  const { data, width, height } = texture.image;
  let best = 0;
  let bestIndex = 0;
  for (let row = 0; row < height / 2; row += 1) {
    for (let col = 0; col < width; col += 1) {
      const i = (row * width + col) * 4;
      const light = data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
      if (light > best) {
        best = light;
        bestIndex = row * width + col;
      }
    }
  }
  const u = ((bestIndex % width) + 0.5) / width;
  const v = 1 - (Math.floor(bestIndex / width) + 0.5) / height;
  const phi = (u - 0.5) * Math.PI * 2;
  const elevation = (v - 0.5) * Math.PI;
  return new THREE.Vector3(Math.cos(phi) * Math.cos(elevation), Math.sin(elevation), Math.sin(phi) * Math.cos(elevation)).normalize();
}

export function loadSky(renderer, scene, onReady) {
  const loader = new HDRLoader();
  loader.setDataType(THREE.FloatType);
  loader.load(HDRI_URL, (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    const sun = findSun(texture);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromEquirectangular(texture).texture;
    pmrem.dispose();
    scene.background = texture;
    scene.environment = environment;
    onReady({ sun, texture, environment });
  });
}
