import { createSurfaceScene } from './surface.js';

// Sejak walkthrough diganti video scroll-scrub, hanya adegan hero (permukaan laguna) yang memakai Three.js.
export const sceneFactories = {
  surface: createSurfaceScene,
};
