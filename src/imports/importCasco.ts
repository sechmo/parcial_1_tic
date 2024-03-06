import * as BABYLON from '@babylonjs/core';


const enterAnim = (model: BABYLON.AbstractMesh) => {
  // Create an ease-in and ease-out quadratic easing function
  var ease = new BABYLON.ElasticEase()

  // You can set the easing mode as well, here we use EASEINOUT for both animations
  ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

  // Position animation with QuadraticEase
  var moveDownAnimation = new BABYLON.Animation("moveInCasco", "position.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  moveDownAnimation.setEasingFunction(ease);
  var keysPosition = [
    { frame: 0, value: model.position.y + 10 },
    { frame: 100, value: model.position.y } // Move down by 10 units
  ];
  moveDownAnimation.setKeys(keysPosition);

  // Visibility animation with QuadraticEase
  var fadeOutAnimation = new BABYLON.Animation("fadeInCasco", "visibility", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  fadeOutAnimation.setEasingFunction(ease);
  var keysVisibility = [
    { frame: 0, value: 0.0 }, // Fully visible
    { frame: 100, value: 1.0 } // Fully invisible
  ];
  fadeOutAnimation.setKeys(keysVisibility);

  // Add animations to the model
  model.animations.push(moveDownAnimation);
  model.animations.push(fadeOutAnimation);
  // Create an animation group
  var myAnimationGroup = new BABYLON.AnimationGroup("IN_CASCO");

  // Add animations to the animation group
  myAnimationGroup.addTargetedAnimation(moveDownAnimation, model);
  myAnimationGroup.addTargetedAnimation(fadeOutAnimation, model);
  myAnimationGroup.loopAnimation = false;
}


const outAnim = (model: BABYLON.AbstractMesh) => {
  // Create an ease-in and ease-out quadratic easing function
  var ease = new BABYLON.ElasticEase()

  ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);

  // Position animation with QuadraticEase
  var moveDownAnimation = new BABYLON.Animation("moveOutCasco", "position.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  moveDownAnimation.setEasingFunction(ease);
  var keysPosition = [
    { frame: 0, value: model.position.y },
    { frame: 100, value: model.position.y + 10 } // Move down by 10 units
  ];
  moveDownAnimation.setKeys(keysPosition);

  // Visibility animation with QuadraticEase
  var fadeOutAnimation = new BABYLON.Animation("fadeOutCasco", "visibility", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  fadeOutAnimation.setEasingFunction(ease);
  var keysVisibility = [
    { frame: 0, value: 1.0 }, // Fully visible
    { frame: 100, value: 0.0 } // Fully invisible
  ];
  fadeOutAnimation.setKeys(keysVisibility);

  // Add animations to the model
  model.animations.push(moveDownAnimation);
  model.animations.push(fadeOutAnimation);
  // Create an animation group
  var myAnimationGroup = new BABYLON.AnimationGroup("OUT_CASCO");

  // Add animations to the animation group
  myAnimationGroup.addTargetedAnimation(moveDownAnimation, model);
  myAnimationGroup.addTargetedAnimation(fadeOutAnimation, model);
  myAnimationGroup.loopAnimation = false;
}


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

  enterAnim(model);
  outAnim(model);


  console.log(animationgGroups);
}