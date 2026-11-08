import { createSurfaceScene } from './surface.js';
import { createReefScene } from './reef.js';
import { createAnimalCellScene } from './animal-cell.js';
import { createSeagrassScene } from './seagrass.js';
import { createPlantCellScene } from './plant-cell.js';
import { createMudScene } from './mud.js';

export const sceneFactories = {
  surface: createSurfaceScene,
  reef: createReefScene,
  animalCell: createAnimalCellScene,
  seagrass: createSeagrassScene,
  plantCell: createPlantCellScene,
  mud: createMudScene,
};
