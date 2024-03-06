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
    loadState: (scene: BABYLON.Scene, ctx) => {
        const casco = scene.getMeshByName('casco')
        if (!casco) {
            return;
        }
        const openAnim = scene.getAnimationGroupByName("OPEN");
        const closeAnim = scene.getAnimationGroupByName("CLOSE")
        const downCascoAnim = scene.getAnimationGroupByName("IN_CASCO")

        if (!openAnim || !closeAnim || !downCascoAnim) {
            return;
        }


        const niceSound = scene.getSoundByName('nice');
        niceSound?.play()

        openAnim.loopAnimation = false;
        openAnim.stop()
        closeAnim.loopAnimation = false;

        casco.setEnabled(true);
        casco.position.y = casco.position.y + 10;

        downCascoAnim.onAnimationEndObservable.addOnce(
            () => {
                openAnim.play();
            }
        )
        downCascoAnim.play();

        



        scene.onPointerDown = () => {
            const hit = scene.pick(scene.pointerX, scene.pointerY);

            if (hit.pickedMesh) {
                const name = hit.pickedMesh.name;

                if (/(R|L)\d/.test(name)) {
                    const index = name[1] as (keyof typeof texts)
                    addText(scene,ctx.fontData, texts[index])
                }
                else if (/H\d/.test(name)) {
                    const index = name[1] as (keyof typeof texts2)
                    addText(scene,ctx.fontData, texts2[index])
                }

            }

        }
    },
    cleanState: (scene: BABYLON.Scene,ctx,callback) => {

        delete scene.onPointerDown;
        cleanText(scene);

        const casco = scene.getMeshByName('casco')
        if (!casco) {
            return;
        }


        const niceSound = scene.getSoundByName('nice');

        const closeAnim = scene.getAnimationGroupByName("CLOSE")
        const outCascoAnim = scene.getAnimationGroupByName("OUT_CASCO")
        if (closeAnim && outCascoAnim) {

            outCascoAnim.onAnimationEndObservable.addOnce(() => {
                casco.setEnabled(false);
                casco.position.y = casco.position.y - 10;
                niceSound?.stop();
                callback();
            })

            closeAnim.onAnimationEndObservable.addOnce(() => {
                outCascoAnim.play();
            })
            closeAnim.play(false);

            
        }



    }
}

export { explainState }