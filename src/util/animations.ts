import * as BABYLON from '@babylonjs/core';

export const playAsync  = (anim: BABYLON.AnimationGroup) => {
    return new Promise((resolve, _reject) => {
        anim.onAnimationEndObservable.addOnce(() => {
            resolve(undefined);
        })
        anim.play();
    });
}

export const createMovementAnimation = (
  model: BABYLON.AbstractMesh,
  name: string,
  inOut: 'in' | 'out',
  direction: 'x' | 'y' | 'z',
  offset: number,
  easeFunction: BABYLON.EasingFunction
) => {
  let easingMode: number;
  if (easeFunction instanceof BABYLON.BackEase || easeFunction instanceof BABYLON.QuadraticEase) {
    easingMode = BABYLON.EasingFunction.EASINGMODE_EASEINOUT;
  } else if (easeFunction instanceof BABYLON.ElasticEase) {
    easingMode = inOut === 'in' ? BABYLON.EasingFunction.EASINGMODE_EASEOUT : BABYLON.EasingFunction.EASINGMODE_EASEIN;
  } else {
    throw new Error('Unsupported easing function');
  }

  easeFunction.setEasingMode(easingMode);

  const moveAnimation = new BABYLON.Animation(`move${inOut}${name}`, `position.${direction}`, 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  moveAnimation.setEasingFunction(easeFunction);

  const keysPosition = [
    { frame: 0, value: inOut === 'in' ? model.position[direction] - offset : model.position[direction] },
    { frame: 100, value: inOut === 'in' ? model.position[direction] : model.position[direction] - offset }
  ];

  moveAnimation.setKeys(keysPosition);

  const fadeAnimation = new BABYLON.Animation(`fade${inOut}${name}`, 'visibility', 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  fadeAnimation.setEasingFunction(easeFunction);

  const keysVisibility = [
    { frame: 0, value: inOut === 'in' ? 0.0 : 1.0 },
    { frame: 100, value: inOut === 'in' ? 1.0 : 0.0 }
  ];

  fadeAnimation.setKeys(keysVisibility);

  model.animations.push(moveAnimation);
  model.animations.push(fadeAnimation);

  const animationGroup = new BABYLON.AnimationGroup(`${inOut.toUpperCase()}_${name.toUpperCase()}`);
  animationGroup.addTargetedAnimation(moveAnimation, model);
  animationGroup.addTargetedAnimation(fadeAnimation, model);
  animationGroup.loopAnimation = false;

  return animationGroup;
}