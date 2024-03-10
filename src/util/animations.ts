import * as BABYLON from '@babylonjs/core';

export const playAsync  = (anim: BABYLON.AnimationGroup) => {
    return new Promise((resolve, reject) => {
        anim.onAnimationEndObservable.addOnce(() => {
            resolve(undefined);
        })
        anim.play();
    });
}