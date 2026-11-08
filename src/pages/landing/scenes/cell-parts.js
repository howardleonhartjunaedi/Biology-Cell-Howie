import * as THREE from 'three';

const DIM = 0.55;
const GLOW = 0.9;
const EASE_SPEED = 6;

export function partMaterial(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0,
    roughness: 0.45,
    metalness: 0.05,
    ...options,
  });
}

export function addWobble(material, uniforms, amount = 0.08) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float wobble = sin(position.x * 2.1 + uTime * 0.9) * sin(position.y * 1.7 + uTime * 0.7) * sin(position.z * 1.9 + uTime * 1.1);
        transformed += normal * wobble * ${amount.toFixed(3)};`
      );
  };
}

export function membraneMaterial(color) {
  return new THREE.MeshPhysicalMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0,
    roughness: 0.25,
    clearcoat: 0.5,
    transparent: true,
    opacity: 0.32,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

export function createHighlighter(groups) {
  const state = groups.map((meshes) => ({
    meshes,
    level: 0,
    baseOpacity: meshes.map((mesh) => mesh.material.opacity),
    baseColor: meshes.map((mesh) => mesh.material.color.clone()),
  }));

  function update(dt, activeIndex) {
    const blend = 1 - Math.exp(-EASE_SPEED * dt);
    state.forEach((item, index) => {
      const target = activeIndex === -1 ? 0.5 : index === activeIndex ? 1 : 0;
      item.level += (target - item.level) * blend;
      item.meshes.forEach((mesh, meshIndex) => {
        const brightness = DIM + (1 - DIM) * Math.min(1, item.level * 2);
        mesh.material.color.copy(item.baseColor[meshIndex]).multiplyScalar(brightness);
        mesh.material.emissiveIntensity = Math.max(0, item.level - 0.5) * 2 * GLOW;
        if (mesh.material.transparent) {
          mesh.material.opacity = item.baseOpacity[meshIndex] * (0.7 + 0.6 * item.level);
        }
      });
    });
  }

  return { update };
}

export function capsule(radius, length, color) {
  return new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 6, 14), partMaterial(color));
}

export function stackedArcs({ count, radius, tube, arc, gap, color }) {
  const group = new THREE.Group();
  const material = partMaterial(color);
  for (let i = 0; i < count; i += 1) {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius - i * 0.06, tube, 8, 32, arc), material);
    mesh.position.z = i * gap;
    group.add(mesh);
  }
  return group;
}

export function meshesOf(object) {
  const list = [];
  object.traverse((child) => child.isMesh && list.push(child));
  return list;
}
