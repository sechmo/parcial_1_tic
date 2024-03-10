import { playAsync } from "../util/animations";
import { State, cleanCallback, context } from "./state";
import * as BABYLON from '@babylonjs/core';

class HappyState implements State {
    async loadState(scene: BABYLON.Scene) {
        // console.log("Se inicia happy state")
        const worker = scene.getMeshByName('worker')
        if (!worker) {
            throw "worker mesh not found"
        }


        const casco = scene.getMeshByName('casco')
        if (!casco) {
            throw "casco mesh not found"
        }

        const downCascoAnim = scene.getAnimationGroupByName("IN_CASCO")

        if (!downCascoAnim) {
            throw "Casco enter anim not found";
        }

        worker.setEnabled(true);

        const inWorkerAnim = scene.getAnimationGroupByName("IN_WORKER");
        if (!inWorkerAnim) {
            throw "Worker enter anim not found";
        }

        const happyMat = scene.getMaterialByName("cabezaHappy");
        if (!happyMat) {
            throw "cabezaHappy material not found"
        }

        const facSound = scene.getSoundByName('factory');
        const muffSound = scene.getSoundByName('muff');
        facSound?.play();


        await playAsync(inWorkerAnim);

        casco.setEnabled(true);

        await playAsync(downCascoAnim);

        const cabeza = scene.getMeshByName("Head");
        if (!cabeza) {
            throw "Head mesh not found"
        }
        cabeza.material = happyMat;
        facSound?.stop();
        muffSound?.play();







    }
    async cleanState(scene: BABYLON.Scene, _ctx: context) {

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
            throw "Casco enter anim not found";
        }
        const inWorkerAnim = scene.getAnimationGroupByName("IN_WORKER");

        if (!inWorkerAnim) {
            throw "Worker enter anim not found";
        }


        const happyMat = scene.getMaterialByName("cabezaHappy");
        if (!happyMat) {
            return;
        }

        const outWorkerAnim = scene.getAnimationGroupByName("OUT_WORKER");

        if (!outWorkerAnim) {
            throw "OUT_WORKER animation not found";
        }

        const outCascoAnim = scene.getAnimationGroupByName("OUT_CASCO")

        if (!outCascoAnim) {
            throw "OUT_CASCO animation not found";
        }


        const facSound = scene.getSoundByName('factory');
        const muffSound = scene.getSoundByName('muff');

        const sadMat = scene.getMaterialByName("cabezaSad");
        if (!sadMat) {
            throw "No hay material triste"
        }

        const cabeza = scene.getMeshByName("Head");
        if (!cabeza) {
            throw "No hay cabeza"
        }
        cabeza.material = sadMat;

        if (!muffSound) {
            throw "No hay muff sound"
        }
        muffSound.stop();

        if (!facSound) {
            throw "no hay fac sound"
        }

        facSound.play();
        await playAsync(outCascoAnim);
        casco.setEnabled(false);
        casco.position.y -= 10;
        await playAsync(outWorkerAnim);
        worker.setEnabled(false);
        worker.position.z += 10
        facSound.stop()
    }
}

const happyState: State = new HappyState();

export { happyState }