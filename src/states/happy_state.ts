import { State } from "./state";
import * as BABYLON from '@babylonjs/core';

const happyState: State = {
    loadState: (scene: BABYLON.Scene) => {
        const worker = scene.getMeshByName('worker')
        if (!worker) {
            return;
        }


        const casco = scene.getMeshByName('casco')
        if (!casco) {
            return;
        }

        const downCascoAnim = scene.getAnimationGroupByName("IN_CASCO")

        if (!downCascoAnim) {
            return;
        }

        worker.setEnabled(true);

        const inWorkerAnim = scene.getAnimationGroupByName("IN_WORKER");


        inWorkerAnim?.onAnimationEndObservable.addOnce(
            () => {
                casco.setEnabled(true);
                downCascoAnim.play();
            }
        )

        inWorkerAnim?.play()

    },
    cleanState: (scene: BABYLON.Scene,ctx, callback) => {
        const worker = scene.getMeshByName('worker')
        if (!worker) {
            return;
        }

        const casco = scene.getMeshByName('casco')
        if (!casco) {
            return;
        }

        const outWorkerAnim = scene.getAnimationGroupByName("OUT_WORKER");

        const outCascoAnim = scene.getAnimationGroupByName("OUT_CASCO")

        if (outWorkerAnim && outCascoAnim) {
            outWorkerAnim.onAnimationEndObservable.addOnce(() => {
                worker.setEnabled(false);
                worker.position.z += 10
                
                
                callback()
            })
            outCascoAnim.onAnimationEndObservable.addOnce(() => {
                casco.setEnabled(false);
                casco.position.y -= 10;
                outWorkerAnim.play();
            })
            outCascoAnim.play();
        }
        else {
            callback();
        }
    }
}

export {happyState}