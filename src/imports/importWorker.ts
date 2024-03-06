
import * as BABYLON from '@babylonjs/core';

const inAnim = (model: BABYLON.AbstractMesh, name: string) => {
  // Create an ease-in and ease-out quadratic easing function
  var ease = new BABYLON.BackEase()

  // You can set the easing mode as well, here we use EASEINOUT for both animations
  ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

  // Position animation with QuadraticEase
  var moveDownAnimation = new BABYLON.Animation("moveIn" + name, "position.z", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  moveDownAnimation.setEasingFunction(ease);
  var keysPosition = [
    { frame: 0, value: model.position.z - 10 },
    { frame: 100, value: model.position.z} // Move down by 10 units
  ];
  moveDownAnimation.setKeys(keysPosition);

  // Visibility animation with QuadraticEase
  var fadeOutAnimation = new BABYLON.Animation("fadeIn" + name, "visibility", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
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
  var myAnimationGroup = new BABYLON.AnimationGroup("IN_"+name.toUpperCase());

  // Add animations to the animation group
  myAnimationGroup.addTargetedAnimation(moveDownAnimation, model);
  myAnimationGroup.addTargetedAnimation(fadeOutAnimation, model);
  myAnimationGroup.loopAnimation = false;
}

const outAnim = (model: BABYLON.AbstractMesh, name: string) => {
  // Create an ease-in and ease-out quadratic easing function
  var ease = new BABYLON.BackEase()

  // You can set the easing mode as well, here we use EASEINOUT for both animations
  ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

  // Position animation with QuadraticEase
  var moveDownAnimation = new BABYLON.Animation("moveOut" + name, "position.z", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  moveDownAnimation.setEasingFunction(ease);
  var keysPosition = [
    { frame: 0, value: model.position.z},
    { frame: 100, value: model.position.z - 10} // Move down by 10 units
  ];
  moveDownAnimation.setKeys(keysPosition);

  // Visibility animation with QuadraticEase
  var fadeOutAnimation = new BABYLON.Animation("fadeOut" + name, "visibility", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
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
  var myAnimationGroup = new BABYLON.AnimationGroup("OUT_"+name.toUpperCase());

  // Add animations to the animation group
  myAnimationGroup.addTargetedAnimation(moveDownAnimation, model);
  myAnimationGroup.addTargetedAnimation(fadeOutAnimation, model);
  myAnimationGroup.loopAnimation = false;
}

export const importWorkerCallback:(name: string) => BABYLON.SceneLoaderSuccessCallback = name => (meshes) => {
      const model = meshes[0];
      model.setEnabled(false);
      model.name = name;

      inAnim(model,name);
      outAnim(model,name);


      if (meshes[2].material) {
        meshes[2].material.name = "cabezaSad";

      }
      

    }