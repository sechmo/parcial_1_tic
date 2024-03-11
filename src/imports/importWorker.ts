
import * as BABYLON from '@babylonjs/core';
import { createMovementAnimation } from '../util/animations';

export const importWorkerCallback: (name: string) => BABYLON.SceneLoaderSuccessCallback = name => (meshes) => {
  const model = meshes[0];
  model.setEnabled(false);
  model.name = name;
  createMovementAnimation(model, name, 'in', 'z', 10, new BABYLON.BackEase());
  createMovementAnimation(model, name, 'out', 'z', 10, new BABYLON.BackEase());


  if (meshes[2].material) {
    meshes[2].material.name = "cabezaSad";

  }


}