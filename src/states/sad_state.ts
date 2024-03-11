import { playAsync } from "../util/animations";
import { getAnimationGroupOrThrow, getMeshOrThrow, getSoundOrThrow } from "../util/asset";
import { State } from "./state";
import * as BABYLON from '@babylonjs/core';

const createInfo = () => {
    const extraUI = document.getElementById("extraUI") as HTMLDivElement;
    const infoText = document.createElement("div");
    infoText.classList.add('info');
    infoText.innerHTML = `
         <p>
  <strong>Problema: Exposición a altos niveles de ruido en la fábrica de Ford en 1909</strong>
</p>

<p>
  Los trabajadores de la fábrica de Ford en 1909 estaban expuestos a niveles de ruido que iban desde los 20 Hz hasta los 10.000 Hz <sup>[1]</sup>, con una intensidad alrededor de los 90-95 dB <sup>[2]</sup>. Según la Asociación Americana del Habla, Lenguaje y Audición, el tiempo máximo de exposición a esa cantidad de decibelios antes de empezar a sufrir daños en el oído es de 1 a 2 horas <sup>[3]</sup>.
</p>

<p>
  Esta exposición prolongada al ruido excesivo puede provocar diversos problemas de salud, como tinnitus y pérdida de audición, que a su vez puede dificultar la comprensión del habla, especialmente al diferenciar ciertos sonidos como 't', 'd' y 's' <sup>[4]</sup>. Para proteger adecuadamente la audición de los trabajadores en un entorno con niveles de ruido de 95-100 dB, se requieren protectores auditivos con un SNR (Single Number Rating) de 20 a 30 <sup>[5]</sup>.
</p>

<p>
  Referencias:
</p>
<ol>
  <li>K. Reinhold, S. Kalle, and J. Paju-Hamburg, "Exposure to high or low frequency noise at workplaces: Differences between assessment, health complaints and implementation of adequate personal protective equipment," Agronomy Research, vol. 12, pp. 895–906, May 2014.</li>
  <li>O. Rikhotso, Harmse, and Engelbrecht, "Noise Sources and Control, and Exposure Groups in Chemical Manufacturing Plants," Applied Sciences, vol. 9, p. 3523, Aug. 2019, doi: 10.3390/app9173523.</li>
  <li>"Loud Noise Dangers," American Speech-Language-Hearing Association. Accessed: Mar. 11, 2024. [Online]. Available: https://www.asha.org/public/hearing/loud-noise-dangers/</li>
  <li>"HSE - Noise: Worried about your hearing?" Accessed: Mar. 05, 2024. [Online]. Available: https://www.hse.gov.uk/noise/worried.htm</li>
  <li>"HSE - Noise: Hearing protection." Accessed: Mar. 05, 2024. [Online]. Available: https://www.hse.gov.uk/noise/hearingprotection.htm</li>
</ol>
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