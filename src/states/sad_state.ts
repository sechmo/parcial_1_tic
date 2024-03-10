import { playAsync } from "../util/animations";
import { State } from "./state";
import * as BABYLON from '@babylonjs/core';

const sadState: State = {
    loadState: async (scene: BABYLON.Scene) => {
        const worker = scene.getMeshByName('worker')
        if (!worker) {
            return;
        }
        worker.setEnabled(true);

        const facSound = scene.getSoundByName('factory');
        facSound?.play()
        const inWorkerAnim = scene.getAnimationGroupByName("IN_WORKER");

        if (inWorkerAnim) {
            await playAsync(inWorkerAnim);
        }

    },
    cleanState: async (scene: BABYLON.Scene,_ctx) => {
        const worker = scene.getMeshByName('worker')
        if (!worker) {
            throw "worker mesh not found"
        }
        const facSound = scene.getSoundByName('factory');

        if (!facSound) {
            throw "factory sound not found";
        }

        const outWorkerAnim = scene.getAnimationGroupByName("OUT_WORKER");

        if (!outWorkerAnim) {
            throw "OUT_WORKER animation not found";
        }

        await playAsync(outWorkerAnim);
        worker.setEnabled(false);
        worker.position.z += 10
        facSound.stop();
    }
}

export {sadState}