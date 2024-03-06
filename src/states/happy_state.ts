import { State } from "./state";
import * as BABYLON from '@babylonjs/core';

const cont = document.getElementsByClassName('overlay')[0]

const happyState: State = {
    loadState: (scene: BABYLON.Scene) => {
        const casco = scene.getMeshByName('casco')
        if (!casco) {
            return;
        }
        const openAnim = scene.getAnimationGroupByName("OPEN");
        const closeAnim = scene.getAnimationGroupByName("CLOSE")

        if (!openAnim || !closeAnim) {
            return;
        }

        openAnim.loopAnimation = false;
        openAnim.stop()
        closeAnim.loopAnimation = false;

        casco.setEnabled(true);
        openAnim.play();

        scene.onPointerDown = () => {
            const _hit = scene.pick(scene.pointerX, scene.pointerY);

        }
    },
    cleanState: (scene: BABYLON.Scene) => {
        const casco = scene.getMeshByName('casco')
        if (!casco) {
            return;
        }
        casco.setEnabled(false);

    }
}

export {happyState}