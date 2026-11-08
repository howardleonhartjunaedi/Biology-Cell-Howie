import * as THREE from 'three';
import fragmentShader from '../shaders/island.frag.glsl?raw';

const WAISILIP = '/img/islands/waisilip-simon-spring.jpg';
const KARST = '/img/islands/karst-simon-spring.jpg';
const PHOTO_ASPECT = 2000 / 1318;
const HAZE_COLOR = '#B9D3DA';

const LAYERS = [
  { photo: WAISILIP, crop: [0, 0.33, 1, 0.585], mirror: 1, distance: 180, width: 110, x: 10, haze: 0.6, depth: 0.15 },
  { photo: KARST, crop: [0.17, 0.4, 1, 0.6], mirror: 0, distance: 125, width: 66, x: 34, haze: 0.3, depth: 0.45 },
  { photo: WAISILIP, crop: [0, 0.33, 1, 0.585], mirror: 0, distance: 92, width: 68, x: -26, haze: 0.1, depth: 1 },
];

const VERTEX = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export function createIslandLayers(loader) {
  const group = new THREE.Group();
  const textures = new Map();
  const layers = [];

  function texture(url) {
    if (!textures.has(url)) {
      const map = loader.load(url);
      map.colorSpace = THREE.SRGBColorSpace;
      map.anisotropy = 4;
      textures.set(url, map);
    }
    return textures.get(url);
  }

  LAYERS.forEach((layer) => {
    const [left, top, right, bottom] = layer.crop;
    const cropAspect = ((right - left) / (bottom - top)) * PHOTO_ASPECT;
    const height = layer.width / cropAspect;
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPhoto: { value: texture(layer.photo) },
        uCrop: { value: new THREE.Vector4(left, 1 - top, right, 1 - bottom) },
        uMirror: { value: layer.mirror },
        uHazeColor: { value: new THREE.Color(HAZE_COLOR) },
        uHaze: { value: layer.haze },
        uOpacity: { value: 1 },
      },
      vertexShader: VERTEX,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(layer.width, height), material);
    const base = new THREE.Vector3(layer.x ?? 0, height / 2 - height * 0.04, -layer.distance);
    mesh.position.copy(base);
    mesh.renderOrder = -layer.distance;
    group.add(mesh);
    layers.push({ mesh, base, depth: layer.depth });
  });

  function update(pointer, scroll) {
    layers.forEach(({ mesh, base, depth }) => {
      mesh.position.x = base.x - pointer.x * depth * 2.2;
      mesh.position.y = base.y + pointer.y * depth * 0.6 - scroll * depth * 1.5;
    });
  }

  return { group, update };
}
