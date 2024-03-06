import { State } from "./state";
import * as BABYLON from '@babylonjs/core';

const sadState: State = {
    loadState: (scene: BABYLON.Scene) => {
        const worker = scene.getMeshByName('worker')
        if (!worker) {
            return;
        }
        worker.setEnabled(true);

        const inWorkerAnim = scene.getAnimationGroupByName("IN_WORKER");

        inWorkerAnim?.play()

    },
    cleanState: (scene: BABYLON.Scene,ctx, callback) => {
        const worker = scene.getMeshByName('worker')
        if (!worker) {
            return;
        }

        const outWorkerAnim = scene.getAnimationGroupByName("OUT_WORKER");

        if (outWorkerAnim) {
            outWorkerAnim.onAnimationEndObservable.addOnce(() => {
                worker.setEnabled(false);
                console.log("miau");
                worker.position.z += 10
                
                
                callback()
            })
            outWorkerAnim.play();
        }
        else {
            callback();
        }
    }
}

export {sadState}