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

  model.animations.push(moveAnimation);

  const animationGroup = new BABYLON.AnimationGroup(`${inOut.toUpperCase()}_${name.toUpperCase()}`);
  animationGroup.addTargetedAnimation(moveAnimation, model);
  animationGroup.loopAnimation = false;

  return animationGroup;
}

export const createFadeAnimation = (
  name: string,
  inOut: 'in' | 'out',
  easeFunction: BABYLON.EasingFunction,
  low: number = 0,
  up: number = 1,
) => {

  const fadeAnimation = new BABYLON.Animation(`fade${inOut}${name}`, 'alpha', 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

  fadeAnimation.setEasingFunction(easeFunction)

  const keysPosition = [
    { frame: 0, value: inOut === 'in' ? low : up },
    { frame: 60, value: inOut === 'in' ? up : low }
  ]

  fadeAnimation.setKeys(keysPosition);

  // material.animations!.push(fadeAnimation);


  return fadeAnimation;
}