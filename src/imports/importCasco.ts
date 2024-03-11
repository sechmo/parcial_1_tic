import * as BABYLON from '@babylonjs/core';
import { createMovementAnimation } from '../util/animations';


export const importCascoCallBack: BABYLON.SceneLoaderSuccessCallback = (meshes, _particleSystems, _skeletons, animationgGroups) => {
  const model = meshes[0];
  model.setEnabled(false);
  model.name = 'casco';



  const mats = [
    meshes[1].material as BABYLON.PBRMaterial,
    meshes[2].material as BABYLON.PBRMaterial,
    meshes[3].material as BABYLON.PBRMaterial,
    meshes[4].material as BABYLON.PBRMaterial,
    meshes[5].material as BABYLON.PBRMaterial,
    meshes[6].material as BABYLON.PBRMaterial,
    meshes[13].material as BABYLON.PBRMaterial,
    meshes[14].material as BABYLON.PBRMaterial,
  ]

  mats.forEach((m, i) => {
    if (i == 3) {
      m.transparencyMode = 3;
      m.alpha = 0.69;
      return;
    }

    if (i == 2 || i == 5) {
      return;
    }
    m.metallic = 1.0;
    m.roughness = 0.3;
  })

  animationgGroups[0].stop();
  animationgGroups[1].stop();

  createMovementAnimation(model, 'casco', 'in', 'y', 10, new BABYLON.ElasticEase());
  createMovementAnimation(model, 'casco', 'out', 'y', 10, new BABYLON.ElasticEase());
  // enterAnim(model);
  // outAnim(model);


  console.log(animationgGroups);
}