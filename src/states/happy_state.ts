import { playAsync } from "../util/animations";
import { getAnimationGroupOrThrow, getMeshOrThrow, getSoundOrThrow, getTextureOrThrow } from "../util/asset";
import { State, context } from "./state";
import * as BABYLON from '@babylonjs/core';



const createInfo = () => {
    const extraUI = document.getElementById("extraUI") as HTMLDivElement;
    const infoText = document.createElement("div");
    infoText.classList.add('info');
    infoText.innerHTML = `
<h2><strong>Protectores Auditivos Ford - PAF</strong></h2>
<p>Desarrollar unos protectores auditivos especialmente diseñados para los trabajadores de las fábricas Ford, hechos con materiales de la época. Podrían ser orejeras acolchadas que cubran toda la oreja, fabricadas con cuero suave en el exterior y rellenas de algodón u otro material aislante del ruido en el interior.</p>

<p>Se sujetarían con una banda ajustable sobre la cabeza o detrás del cuello para un ajuste seguro y cómodo. El diseño sería ergonómico para permitir varias horas de uso. </p>

<h3>Beneficios</h3>
<ul>
	<li>Reducen la exposición al ruido dañino en 20-30 dB, llevándolo a niveles más seguros</li>
	<li>Protegen la audición de los trabajadores, reduciendo problemas como tinnitus y pérdida auditiva</li>
	<li>Aumentan el confort y concentración, reducen el estrés, mejorando la productividad</li>
	<li>Crean una cultura de seguridad e innovación en Ford, posicionándola como líder</li>
</ul>

<h3>Implementación</h3>
<ul>
	<li>Crear prototipos y probarlos con trabajadores para optimizar diseño y materiales</li>
	<li>Producir los PAF en la misma fábrica, generando empleos y reduciendo costos</li>
	<li>Proporcionarlos a todos los trabajadores expuestos a ruido, con capacitación sobre su importancia y uso correcto</li>
	<li>Convertirlos en parte del uniforme y cultura de seguridad de Ford</li>
</ul>

Esta solución ataca de raíz el problema del ruido, usando creativamente los recursos disponibles en la época para proteger activamente la salud auditiva de los trabajadores, en vez de solo aceptar los daños como inevitables. Sería una innovación destacable para 1909 que mejoraría las condiciones laborales y podría generar ahorros al reducir problemas de salud ocupacionales.
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
const happyState: State = {
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


        // Add text div to explain the problem inside extraUI
        createInfo();



        workerMesh.setEnabled(true);

        factorySound.play();

        await playAsync(inWorkerAnimation);

        earmuffMesh.setEnabled(true);

        await playAsync(downEarmuffAnimation);


        (headMesh.material as BABYLON.PBRMaterial).albedoTexture = happyHeadTexture;
        factorySound.stop();
        muffledFactorySound.play(0, factorySound.currentTime);

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

        delete scene.onPointerDown;
        await waitForCondition(isNotFading, 5000);




        const workerMesh = getMeshOrThrow(scene, 'worker');
        const earmuffsMesh = getMeshOrThrow(scene, 'earmuffs');
        const outWorkerAnimation = getAnimationGroupOrThrow(scene, "OUT_WORKER");
        const outEarmuffsAnimation = getAnimationGroupOrThrow(scene, "OUT_EARMUFFS");
        const factorySound = getSoundOrThrow(scene, 'factory');
        const muffledFactorySound = getSoundOrThrow(scene, 'muff');
        const headMesh = getMeshOrThrow(scene, "Head");
        const sadHeadTexture = getTextureOrThrow(scene, "sadHead");
        const fadeinEarmuffsAnimation = getAnimationGroupOrThrow(scene, "FADE_IN_EARMUFFS");



        if (!usingEarmuffs) {
            await playAsync(fadeinEarmuffsAnimation);
        }
        else {
            muffledFactorySound.stop();
            factorySound.play(0, muffledFactorySound.currentTime);
        }
        (headMesh.material as BABYLON.PBRMaterial).albedoTexture = sadHeadTexture;

        await playAsync(outEarmuffsAnimation);
        earmuffsMesh.setEnabled(false);
        earmuffsMesh.position.y -= 10;

        await playAsync(outWorkerAnimation);
        workerMesh.setEnabled(false);
        workerMesh.position.z += 10
        factorySound.stop()

        deleteInfo();
    }

}

export { happyState }