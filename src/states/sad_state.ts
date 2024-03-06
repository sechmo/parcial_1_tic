import { State } from "./state";
import * as BABYLON from '@babylonjs/core';

const sadState: State = {
    loadState: (scene: BABYLON.Scene) => {
        const worker = scene.getMeshByName('worker')
        if (!worker) {
            return;
        }
        worker.setEnabled(true);
    },
    cleanState: (scene: BABYLON.Scene) => {
        const worker = scene.getMeshByName('worker')
        if (!worker) {
            return;
        }
        worker.setEnabled(false);

    }
}

export {sadState}