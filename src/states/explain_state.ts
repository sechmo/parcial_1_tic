import { playAsync } from "../util/animations";
import { getAnimationGroupOrThrow, getMeshOrThrow, getSoundOrThrow } from "../util/asset";
import { State } from "./state";
import * as BABYLON from '@babylonjs/core';

const cleanText = (scene: BABYLON.Scene) => {
    scene.getMeshByName('explainText')?.dispose();

    const extraUI = document.getElementById('extraUI') as HTMLDivElement;

    // Get a reference to the info-text div
    const infoTextDiv = extraUI.querySelector('.info');

    // Check if the info-text div exists
    if (infoTextDiv) {
        // Remove the info-text div from the extraUI div
        extraUI.removeChild(infoTextDiv);
    }
}

const addText = (scene: BABYLON.Scene, fontData: BABYLON.IFontData, title: string, desc: string) => {
    cleanText(scene);

    const textMesh = BABYLON.MeshBuilder.CreateText('explainText', title, fontData, {
        size: 2
    })
    if (textMesh != null) {
        textMesh.rotate(BABYLON.Axis.Y, Math.PI);
        textMesh.position = new BABYLON.Vector3(0, 5, -10);
    }


    const extraUI = document.getElementById("extraUI") as HTMLDivElement;
    const infoText = document.createElement("div");
    infoText.classList.add('info');
    infoText.innerHTML = desc;
    extraUI.appendChild(infoText);
}

const TITLES = {
    "0": `Almohadillas de algodón`,
    "1": `placa de soporte`,
    "2": `Capsula de vacío`,
    "3": `Banda de caucho`,
    "4": `Paneles acústicos de algodón`,
    "5": `Revestimiento Exterior`
}

const DESC = {
    "0": `
        <p>
            <h3>6. Almohadillas de algodón:</h3>
            <ul>
                <li>Proporcionan comodidad y sellan el aislamiento alrededor de las orejas.</li>
            </ul>
        </p>
    `,
    "1": `
        <p>
            <h3>5. Placa de soporte:</h3>
            <ul>
                <li>Da estructura al protector auditivo.</li>
                <li>Hecha de plástico (baquelita), descubierto este mismo año (1909) <sup>[9]</sup>.</li>
            </ul>
            <ol start="6">
                <li>"Bakelite® First Synthetic Plastic - National Historic Chemical Landmark," American Chemical Society. Accessed:
                    Mar. 11, 2024. [Online]. Available: https://www.acs.org/education/whatischemistry/landmarks/bakelite.html</li>
            </ol>
        </p>
    `,
    "2": `
        <p>
            <h3>4. Cápsula de vacío:</h3>
            <ul>
                <li>El sonido no viaja en el vacío, por lo que provee una capa adicional de aislamiento.</li>
                <li>Funciona como una "jaula de Faraday" pero para ondas sonoras.</li>
                <li>El vacío aisla entre 20 y 50 dB en el rango de ruido de la fábrica <sup>[8]</sup>.</li>
            </ul>
            <ol start="8">
                <li>H. Cauberg and M. Tenpierik, "Sound reduction of vacuum insulation based on building panels," Sep. 2007.</li>
            </ol>
        </p>
    `,
    "3": `
        <p>
            <h3>3. Banda de caucho:</h3>
            <ul>
                <li>Asegura firmemente los paneles acústicos y la placa de soporte a la cápsula de vacío.</li>
            </ul>
        </p>
    `,
    "4": `
        <p>
            <h3>2. Paneles acústicos de algodón:</h3>
            <ul>
                <li>En forma de púas para aumentar la superficie y absorber la mayor cantidad posible de ruido.</li>
                <li>El algodón tiene un coeficiente de reducción de ruido entre 0.05 y 1 para el rango de ruido en la fábrica,
                    lo cual es considerable <sup>[6]</sup>.</li>
                <li>La forma de los paneles aumenta la superficie sobre la que pueden rebotar las ondas de sonido, disipándolas
                    <sup>[7]</sup>.</li>
            </ul>

            <ol start="6">
                <li>D. Oldham, C. Egan, and R. Cookson, "Sustainable acoustic absorbers from the biomass," Applied Acoustics - APPL
                    ACOUST, vol. 72, pp. 350–363, May 2011, doi: 10.1016/j.apacoust.2010.12.009.</li>
                <li>Dominic, "What Are Acoustic Panels, What Do Acoustic Panels Do And How Do Acoustic Panels Work?," Burton
                    Acoustix. Accessed: Mar. 05, 2024. [Online]. Available:
                    https://blog.burtonacoustix.com/acoustic-panels/what-are-acoustic-panels</li>
            </ol>
        </p>
    `,
    "5": `
        <p>
            <h3>1. Revestimiento exterior:</h3>
            <ul>
                <li>Corte de esfera para rebotar la mayor cantidad posible de sonido.</li>
                <li>Protege los paneles acústicos interiores.</li>
            </ul>
        </p>
    `
}

const TITLES2 = {
    "0": `Soporte superior`,
    "1": `Banda ajustable`
}

const DESC2 = {
    "0": `
        <p>
            <h3>7. Soporte superior:</h3>
            <ul>
                <li>Sostiene la banda ajustable.</li>
                <li>Funciona como un riel para extender o retraer la banda según convenga.</li>
            </ul>
        </p>
    `,
    "1": `
        <p>
            <h3>8. Banda ajustable:</h3>
            <ul>
                <li>Se mueve sobre el soporte superior y permite ajustar el tamaño de los protectores</li>
            </ul>
        </p>
    `
}

const explainState: State = {
    loadState: async (scene: BABYLON.Scene, ctx) => {
        const earmuffsMesh = getMeshOrThrow(scene, 'earmuffs');
        const openEarmuffsAnimation = getAnimationGroupOrThrow(scene, "OPEN");
        const closeEarmuffsAnimation = getAnimationGroupOrThrow(scene, "CLOSE")
        const inEarmuffsAnimation = getAnimationGroupOrThrow(scene, "IN_EARMUFFS")
        const niceAmbientSound = getSoundOrThrow(scene, 'nice');


        niceAmbientSound.play()

        openEarmuffsAnimation.loopAnimation = false;
        openEarmuffsAnimation.stop()
        closeEarmuffsAnimation.loopAnimation = false;

        earmuffsMesh.setEnabled(true);
        earmuffsMesh.position.y = earmuffsMesh.position.y + 10;

        inEarmuffsAnimation.onAnimationEndObservable.addOnce(
            () => {
                openEarmuffsAnimation.play();
            }
        )
        inEarmuffsAnimation.play();


        scene.onPointerDown = () => {
            const hit = scene.pick(scene.pointerX, scene.pointerY);

            if (hit.pickedMesh) {
                const name = hit.pickedMesh.name;

                if (/(R|L)\d/.test(name)) {
                    const index = name[1] as (keyof typeof TITLES)
                    addText(scene, ctx.fontData, TITLES[index], DESC[index])
                }
                else if (/H\d/.test(name)) {
                    const index = name[1] as (keyof typeof TITLES2)
                    addText(scene, ctx.fontData, TITLES2[index], DESC2[index])
                }

            }

        }
    },
    cleanState: async (scene: BABYLON.Scene, _ctx) => {

        delete scene.onPointerDown;
        cleanText(scene);

        const earmuffsMesh = getMeshOrThrow(scene, 'earmuffs')

        const niceAmbienSound = getSoundOrThrow(scene, 'nice');
        const closeEarmuffsAnimation = getAnimationGroupOrThrow(scene, "CLOSE")
        const outEarmuffsAnimation = getAnimationGroupOrThrow(scene, "OUT_EARMUFFS")

        await playAsync(closeEarmuffsAnimation);

        await playAsync(outEarmuffsAnimation);

        earmuffsMesh.setEnabled(false);
        earmuffsMesh.position.y = earmuffsMesh.position.y - 10;
        niceAmbienSound?.stop();

    }
}

export { explainState }