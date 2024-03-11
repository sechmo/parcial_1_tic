import { playAsync } from "../util/animations";
import { getAnimationGroupOrThrow, getMaterialOrThrow, getMeshOrThrow, getSoundOrThrow } from "../util/asset";
import { State, context } from "./state";
import * as BABYLON from '@babylonjs/core';

const happyState: State =  {
    loadState: async (scene: BABYLON.Scene) => {

        const earmuffMesh = getMeshOrThrow(scene, 'casco');
        const workerMesh = getMeshOrThrow(scene, 'worker');
        const downEarmuffAnimation = getAnimationGroupOrThrow(scene, "IN_CASCO");
        const inWorkerAnimation = getAnimationGroupOrThrow(scene, "IN_WORKER");
        const happyHeadMaterial = getMaterialOrThrow(scene, "cabezaHappy");
        const factorySound = getSoundOrThrow(scene, 'factory');
        const muffedFactorySound = getSoundOrThrow(scene, 'muff');
        const headMesh = getMeshOrThrow(scene, "Head");


        workerMesh.setEnabled(true);

        factorySound.play();

        await playAsync(inWorkerAnimation);

        earmuffMesh.setEnabled(true);

        await playAsync(downEarmuffAnimation);

        headMesh.material = happyHeadMaterial;
        factorySound?.stop();
        muffedFactorySound?.play();
    },
    cleanState: async (scene: BABYLON.Scene, _ctx: context) => {

        const workerMesh = getMeshOrThrow(scene, 'worker');
        const earmuffsMesh = getMeshOrThrow(scene, 'casco');
        const outWorkerAnimation = getAnimationGroupOrThrow(scene, "OUT_WORKER");
        const outEarmuffsAnimation = getAnimationGroupOrThrow(scene, "OUT_CASCO");
        const factorySound = getSoundOrThrow(scene, 'factory');
        const muffledFactorySound = getSoundOrThrow(scene, 'muff');
        const sadHeadMaterial = getMaterialOrThrow(scene, "cabezaSad");
        const headMesh = getMeshOrThrow(scene, "Head");


        headMesh.material = sadHeadMaterial;
        muffledFactorySound.stop();
        factorySound.play();

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