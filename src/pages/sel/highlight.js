const DIM = 0.55;
const GLOW = 0.55;

function remember(material, store) {
  if (!store.has(material)) {
    store.set(material, { color: material.color.clone(), opacity: material.opacity });
  }
  return store.get(material);
}

function apply(mesh, store, level) {
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  materials.forEach((material) => {
    const base = remember(material, store);
    material.color.copy(base.color).multiplyScalar(level === 'dim' ? DIM : 1);
    if ('emissiveIntensity' in material) material.emissiveIntensity = level === 'glow' ? GLOW : 0;
    if (material.transparent) material.opacity = base.opacity * (level === 'dim' ? 0.6 : 1);
  });
}

export function createHighlight(cellMeshes) {
  const store = new Map();

  function set(cellId, activeId) {
    const map = cellMeshes[cellId];
    if (!map) return;
    map.forEach((list, id) => {
      if (id === activeId) return;
      list.forEach((mesh) => apply(mesh, store, activeId ? 'dim' : 'normal'));
    });
    // Organel aktif diproses terakhir, supaya mesh yang dipakai bersama tetap menyala.
    (map.get(activeId) ?? []).forEach((mesh) => apply(mesh, store, 'glow'));
  }

  function setParts(parts, activeId) {
    parts.forEach((part) => {
      const level = !activeId ? 'normal' : part.id === activeId ? 'glow' : 'dim';
      part.meshes.forEach((mesh) => apply(mesh, store, level));
    });
  }

  return { set, setParts };
}
