import { playAsync } from "../util/animations";
import { getAnimationGroupOrThrow, getMeshOrThrow, getSoundOrThrow, getTextureOrThrow } from "../util/asset";
import { State, context } from "./state";
import * as BABYLON from '@babylonjs/core';
function waitForCondition(condition: () => boolean, maxWaitTime = 5000) {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const checkCondition = () => {
      if (condition()) {
        resolve(undefined);
      } else if (Date.now() - startTime > maxWaitTime) {
        reject(new Error('Timeout: Condition not met within the specified time'));
      } else {
        setTimeout(checkCondition, 50);
      }
    };

    checkCondition();
  });
}

let isPlayingFade = false;
let usingEarmuffs = true;
// Example usage
const isNotFading = () => {
  // Your condition logic here
  return !isPlayingFade;
};
const happyState: State =  {
    loadState: async (scene: BABYLON.Scene) => {

        const earmuffMesh = getMeshOrThrow(scene, 'earmuffs');
        const workerMesh = getMeshOrThrow(scene, 'worker');
        const downEarmuffAnimation = getAnimationGroupOrThrow(scene, "IN_EARMUFFS");
        const inWorkerAnimation = getAnimationGroupOrThrow(scene, "IN_WORKER");
        const factorySound = getSoundOrThrow(scene, 'factory');
        const muffledFactorySound = getSoundOrThrow(scene, 'muff');
        const headMesh = getMeshOrThrow(scene, "Head");
        const happyHeadTexture = getTextureOrThrow(scene, "happyHead");
        const sadHeadTexture = getTextureOrThrow(scene, "sadHead");

        const fadeOutEarmuffsAnimation = getAnimationGroupOrThrow(scene, "FADE_OUT_EARMUFFS")
        const fadeinEarmuffsAnimation = getAnimationGroupOrThrow(scene, "FADE_IN_EARMUFFS")



        workerMesh.setEnabled(true);

        factorySound.play();

        await playAsync(inWorkerAnimation);

        earmuffMesh.setEnabled(true);

        await playAsync(downEarmuffAnimation);


        (headMesh.material as BABYLON.PBRMaterial).albedoTexture = happyHeadTexture;
        factorySound.stop();
        muffledFactorySound.play(0,factorySound.currentTime);

        scene.onPointerDown = async () => {
            const hit = scene.pick(scene.pointerX, scene.pointerY);

            if (!hit.pickedMesh) {
                return;
            }

            const name = hit.pickedMesh.name

            if (!(/(R|L|H)\d/.test(name))) {
                return;
            }

            if (isPlayingFade) {
                return;
            }

            isPlayingFade = true
            usingEarmuffs = !usingEarmuffs;
            if (!usingEarmuffs) {
                await playAsync(fadeOutEarmuffsAnimation);
                muffledFactorySound.stop();
                factorySound.play(0, muffledFactorySound.currentTime);
                (headMesh.material as BABYLON.PBRMaterial).albedoTexture = sadHeadTexture;
            }
            else {
                await playAsync(fadeinEarmuffsAnimation);
                factorySound.stop();
                muffledFactorySound.play(0, factorySound.currentTime);
                (headMesh.material as BABYLON.PBRMaterial).albedoTexture = happyHeadTexture;
            }

            isPlayingFade = false;


        }


    },
    cleanState: async (scene: BABYLON.Scene, _ctx: context) => {

        delete  scene.onPointerDown;
        await waitForCondition(isNotFading,5000);




        const workerMesh = getMeshOrThrow(scene, 'worker');
        const earmuffsMesh = getMeshOrThrow(scene, 'earmuffs');
        const outWorkerAnimation = getAnimationGroupOrThrow(scene, "OUT_WORKER");
        const outEarmuffsAnimation = getAnimationGroupOrThrow(scene, "OUT_EARMUFFS");
        const factorySound = getSoundOrThrow(scene, 'factory');
        const muffledFactorySound = getSoundOrThrow(scene, 'muff');
        const headMesh = getMeshOrThrow(scene, "Head");
        const sadHeadTexture = getTextureOrThrow(scene, "sadHead");
        const happyHeadTexture = getTextureOrThrow(scene, "happyHead");
        const fadeinEarmuffsAnimation = getAnimationGroupOrThrow(scene, "FADE_IN_EARMUFFS");



        if (!usingEarmuffs) {
            await playAsync(fadeinEarmuffsAnimation);
        }
        else {
            muffledFactorySound.stop();
            factorySound.play(0,muffledFactorySound.currentTime);
        }
        (headMesh.material as BABYLON.PBRMaterial).albedoTexture = sadHeadTexture;

        await playAsync(outEarmuffsAnimation);
        earmuffsMesh.setEnabled(false);
        earmuffsMesh.position.y -= 10;

        await playAsync(outWorkerAnimation);
        workerMesh.setEnabled(false);
        workerMesh.position.z += 10
        factorySound.stop()
    }
}

export { happyState }