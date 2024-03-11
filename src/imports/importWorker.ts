
import * as BABYLON from '@babylonjs/core';
import { createFadeAnimation, createMovementAnimation } from '../util/animations';

export const importWorkerCallback: (name: string) => BABYLON.SceneLoaderSuccessCallback = name => (meshes) => {
  const model = meshes[0];
  model.setEnabled(false);
  model.name = name;
  const inAnimationGroup = createMovementAnimation(model, name, 'in', 'z', 10, new BABYLON.BackEase());
  createMovementAnimation(model, name, 'out', 'z', 10, new BABYLON.BackEase());

  // Transparency does not really work
  // meshes
  //   .forEach((m, i) => {
  //     const mat = m.material as BABYLON.PBRMaterial | undefined;
  //     if (!mat)  {
  //       return;
  //     }
  //     mat.animations = [];
  //     mat.transparencyMode = BABYLON.Material.MATERIAL_ALPHATESTANDBLEND;

  //     const easeFunction = new BABYLON.QuinticEase();
  //     easeFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
  //     const animation = createFadeAnimation(mat, name + i, 'in', easeFunction);
  //     inAnimationGroup.addTargetedAnimation(animation, mat);
  //   });


}