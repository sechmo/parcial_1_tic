import { playAsync } from "../util/animations";
import { getAnimationGroupOrThrow, getMeshOrThrow, getSoundOrThrow } from "../util/asset";
import { State } from "./state";
import * as BABYLON from '@babylonjs/core';

const sadState: State = {
    loadState: async (scene: BABYLON.Scene) => {

        const workerMesh = getMeshOrThrow(scene, 'worker');
        const factorySound = getSoundOrThrow(scene, 'factory');
        const inWorkerAnimation = getAnimationGroupOrThrow(scene, 'IN_WORKER');

        workerMesh.setEnabled(true);
        factorySound.play()

        await playAsync(inWorkerAnimation);

    },
    cleanState: async (scene: BABYLON.Scene,_ctx) => {

        const workerMesh = getMeshOrThrow(scene, 'worker');
        const factorySound = getSoundOrThrow(scene, 'factory');
        const outWorkerAnimation = getAnimationGroupOrThrow(scene, 'OUT_WORKER');

        await playAsync(outWorkerAnimation);
        workerMesh.setEnabled(false);
        workerMesh.position.z += 10
        factorySound.stop();
    }
}

export {sadState}