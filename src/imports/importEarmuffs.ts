import * as BABYLON from '@babylonjs/core';
import { createFadeAnimation, createMovementAnimation } from '../util/animations';


export const importEarmuffsCallBack: BABYLON.SceneLoaderSuccessCallback = (meshes, _particleSystems, _skeletons, animationgGroups) => {
  const model = meshes[0];
  model.setEnabled(false);
  model.name = 'earmuffs';



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

  createMovementAnimation(model, 'earmuffs', 'in', 'y', 10, new BABYLON.ElasticEase());
  createMovementAnimation(model, 'earmuffs', 'out', 'y', 10, new BABYLON.ElasticEase());
  // enterAnim(model);
  // outAnim(model);


  const fadeOut = new BABYLON.AnimationGroup("FADE_OUT_EARMUFFS");
  const fadeIn = new BABYLON.AnimationGroup("FADE_IN_EARMUFFS");

  mats.forEach((mat, i) => {
    mat.transparencyMode = BABYLON.Material.MATERIAL_ALPHATESTANDBLEND;

    const easeFunctionFadeOut = new BABYLON.QuarticEase()
    easeFunctionFadeOut.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

    const animationFadeOut = createFadeAnimation(`FADE_OUT_MAT_${i}`,"out", easeFunctionFadeOut, 0.1, 1.0)
    fadeOut.addTargetedAnimation(animationFadeOut,mat)

    const easeFunctionFadeIn = new BABYLON.QuarticEase()
    easeFunctionFadeIn.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

    const animationFadeIn = createFadeAnimation(`FADE_OUT_MAT_${i}`,"in", easeFunctionFadeOut, 0.1, 1.0)
    fadeIn.addTargetedAnimation(animationFadeIn,mat)


  })



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


  console.log(animationgGroups);
}