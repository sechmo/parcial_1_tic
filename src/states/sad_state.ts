import { playAsync } from "../util/animations";
import { getAnimationGroupOrThrow, getMeshOrThrow, getSoundOrThrow } from "../util/asset";
import { State } from "./state";
import * as BABYLON from '@babylonjs/core';

const createInfo = () => {
    const extraUI = document.getElementById("extraUI") as HTMLDivElement;
    const infoText = document.createElement("div");
    infoText.classList.add('info');
    infoText.innerHTML = `
        <p>El problema</p>
        <p>Fue</p>
         `;
    extraUI.appendChild(infoText);
}

const deleteInfo = () => {
    const extraUI = document.getElementById('extraUI') as HTMLDivElement;

    // Get a reference to the info-text div
    const infoTextDiv = extraUI.querySelector('.info');

    // Check if the info-text div exists
    if (infoTextDiv) {
        // Remove the info-text div from the extraUI div
        extraUI.removeChild(infoTextDiv);
    }
}


const sadState: State = {
    loadState: async (scene: BABYLON.Scene) => {

        const workerMesh = getMeshOrThrow(scene, 'worker');
        const factorySound = getSoundOrThrow(scene, 'factory');
        const inWorkerAnimation = getAnimationGroupOrThrow(scene, 'IN_WORKER');

        workerMesh.setEnabled(true);
        factorySound.play()

        createInfo();
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
        deleteInfo();
    }
}

export {sadState}