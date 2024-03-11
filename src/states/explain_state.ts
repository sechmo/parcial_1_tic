import { playAsync } from "../util/animations";
import { getAnimationGroupOrThrow, getMeshOrThrow, getSoundOrThrow } from "../util/asset";
import { State } from "./state";
import * as BABYLON from '@babylonjs/core';

const cleanText = (scene: BABYLON.Scene) => {
    scene.getMeshByName('explainText')?.dispose();
}

const addText = (scene: BABYLON.Scene, fontData: BABYLON.IFontData, text: string) => {
    cleanText(scene);

    const textMesh = BABYLON.MeshBuilder.CreateText('explainText', text, fontData, {
        size: 2
    })
    if (textMesh != null) {
        textMesh.rotate(BABYLON.Axis.Y, Math.PI);
        textMesh.position = new BABYLON.Vector3(0, 5, -10);
    }
}

const texts = {
    "0": `
    Almohadas para comodidad
    `,
    "1": `
    placa de soporte
    `,
    "2": `
    Capsula de vacio
    `,
    "3": `
    Caucho de ajuste
    `,
    "4": `
    Panel reductor de sonido
    `,
    "5": `
    carcasa protectora
    `
}

const texts2 = {
    "0": `
    Base superior
    `,
    "1": `
    extenesor
    `
}

const explainState: State = {
    loadState: async (scene: BABYLON.Scene, ctx) => {
        const earmuffsMesh = getMeshOrThrow(scene, 'casco');
        const openEarmuffsAnimation = getAnimationGroupOrThrow(scene, "OPEN");
        const closeEarmuffsAnimation = getAnimationGroupOrThrow(scene, "CLOSE")
        const inEarmuffsAnimation = getAnimationGroupOrThrow(scene, "IN_CASCO")
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
                    const index = name[1] as (keyof typeof texts)
                    addText(scene, ctx.fontData, texts[index])
                }
                else if (/H\d/.test(name)) {
                    const index = name[1] as (keyof typeof texts2)
                    addText(scene, ctx.fontData, texts2[index])
                }

            }

        }
    },
    cleanState: async (scene: BABYLON.Scene, _ctx) => {

        delete scene.onPointerDown;
        cleanText(scene);

        const earmuffsMesh = getMeshOrThrow(scene, 'casco')

        const niceAmbienSound = getSoundOrThrow(scene, 'nice');
        const closeEarmuffsAnimation = getAnimationGroupOrThrow(scene, "CLOSE")
        const outEarmuffsAnimation = getAnimationGroupOrThrow(scene, "OUT_CASCO")

        await playAsync(closeEarmuffsAnimation);

        await playAsync(outEarmuffsAnimation);

        earmuffsMesh.setEnabled(false);
        earmuffsMesh.position.y = earmuffsMesh.position.y - 10;
        niceAmbienSound?.stop();

    }
}

export { explainState }