import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import '@babylonjs/core/Debug/debugLayer';
import * as I from '@babylonjs/inspector';


import * as S from './states';
import { importWorkerCallback } from './imports/importWorker';
import { importEarmuffsCallBack } from './imports/importEarmuffs';

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
  return fontData as BABYLON.IFontData;
}

const loadAssets = async (scene: BABYLON.Scene) => {


  new BABYLON.Sound("factory", 'factory.mp3', scene, null, {
    loop: true,
    autoplay: false,
  })
  new BABYLON.Sound("muff", 'muff.mp3', scene, null, {
    loop: true,
    autoplay: false,
  })

  new BABYLON.Sound("nice", 'DivKid.mp3', scene, null, {
    loop: true,
    autoplay: false,
  })


  BABYLON.SceneLoader.ImportMesh('', '', 'earmuffs.gltf', scene, importEarmuffsCallBack)

  BABYLON.SceneLoader.ImportMesh('', '', 'worker.gltf', scene,
    importWorkerCallback("worker")
  );


  const sadHeadTexture = new BABYLON.Texture("headSad.png", scene, true, false, BABYLON.Texture.NEAREST_SAMPLINGMODE);
  sadHeadTexture.name = "sadHead"
  sadHeadTexture.hasAlpha = true;
  const happyHeadTexture = new BABYLON.Texture("headHappy.png", scene, true, false, BABYLON.Texture.NEAREST_SAMPLINGMODE);
  happyHeadTexture.name = "happyHead"
  happyHeadTexture.hasAlpha = true;


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
  

  // I.Inspector.Show(scene, {});
})