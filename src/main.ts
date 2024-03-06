import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';

import * as S from './states';
import { importCascoCallBack } from './imports/importCasco';
import { importWorkerCallback } from './imports/importWorker';

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const problemBtn = document.getElementById("problemaBtn") as HTMLButtonElement;
const solucionBtn = document.getElementById("solucionBtn") as HTMLButtonElement;
const modeloBtn = document.getElementById("modeloBtn") as HTMLButtonElement;

const engine = new BABYLON.Engine(canvas);



const createScene = () => {
  return new BABYLON.Scene(engine)
}

const createFontData = async () => {
  const fontData = await (await fetch("Roboto_Regular.json")).json()

  // Font for text rendering
  // const text = BABYLON.MeshBuilder.CreateText('myText', 'Taller de Invención y Creatividad', fontData, {
  //   size: 2
  // })
  // if (text != null) {
  //   text.position = new BABYLON.Vector3(0, 0, +10);
  // }
  return fontData as BABYLON.IFontData;
}

const loadAssets = async (scene: BABYLON.Scene) => {


  new BABYLON.Sound("factory",'factory.mp3',scene, null, {
    loop: true,
    autoplay: false,
  })
  new BABYLON.Sound("muff",'muff.mp3',scene, null, {
    loop: true,
    autoplay: false,
  })

  new BABYLON.Sound("nice",'DivKid.mp3',scene, null, {
    loop: true,
    autoplay: false,
  })

  BABYLON.SceneLoader.ImportMesh('', '', 'casco.gltf', scene, importCascoCallBack)

  BABYLON.SceneLoader.ImportMesh('', '', 'worker.gltf', scene,
    importWorkerCallback("worker")
  );


  BABYLON.SceneLoader.ImportMesh('', '', 'workerHappy.gltf', scene,
    (meshes) => {
      meshes[0].setEnabled(false);
      meshes[0].name = "workerHappy"
      meshes[1].name = "bodyHappy"
      if (meshes[2].material) {
        meshes[2].material.name = "cabezaHappy";
        meshes[2].name = 'cabezaHappy'

      }
    }
  );

  const envTexture = new BABYLON.CubeTexture("environment.env", scene);
  envTexture.name = "envTexture"

}

const setupEnvironment = async (scene: BABYLON.Scene) => {
  // Load skybox background

  const envTexture = scene.getTextureByName("envTexture")
  if (envTexture) {
    scene.createDefaultSkybox(envTexture, true);
  }

  // Light and camera
  scene.createDefaultLight()
  const camera = new BABYLON.ArcRotateCamera('camera', 2 * Math.PI * 1 / 4, Math.PI / 2, 20, new BABYLON.Vector3(0, 0, 0), scene)
  camera.attachControl(true);
  camera.inputs.addMouseWheel();
}


const initScene = async (scene: BABYLON.Scene) => {
  await loadAssets(scene);
  await setupEnvironment(scene);


  return scene;
}



Promise.all([initScene(createScene()), createFontData()]).then(([scene, fontData]) => {
  const StateManager = new S.StateManager(S.sadState, scene, { fontData });

  modeloBtn.onclick = () => {
    StateManager.requestChange(S.explainState);
  }
  problemBtn.onclick = () => {
    StateManager.requestChange(S.sadState);
  }

  solucionBtn.onclick = () => {
    StateManager.requestChange(S.happyState);
  }


  StateManager.start();
  engine.runRenderLoop(() => {
    StateManager.changeIfRequested()

    scene.render();
  });

  window.addEventListener('resize', () => {
    engine.resize();
  });
})