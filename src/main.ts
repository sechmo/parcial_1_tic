import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';

import * as S from './states';

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const expBtn = document.getElementById("explicarBtn") as HTMLButtonElement;

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
  return fontData;
}

const loadAssets = async (scene: BABYLON.Scene) => {


  BABYLON.SceneLoader.ImportMesh('','','casco.gltf',scene, 
    (meshes, _particleSystems, _skeletons, animationgGroups) => {
      const model = meshes[0];
      model.setEnabled(false);
      model.name = 'casco';


      const mats = [
        meshes[1].material as BABYLON.PBRMaterial,
        meshes[2].material as BABYLON.PBRMaterial,
        meshes[3].material as BABYLON.PBRMaterial,
        meshes[4].material as BABYLON.PBRMaterial,
        meshes[5].material as BABYLON.PBRMaterial,
        meshes[6].material as BABYLON.PBRMaterial,
        meshes[13].material as BABYLON.PBRMaterial,
        meshes[14].material as BABYLON.PBRMaterial,
      ]

      mats.forEach((m, i) => {
        if (i == 3) {
          m.transparencyMode = 3;
          m.alpha = 0.69;
          return;
        }

        if (i == 2 || i == 5) {
          return;
        }
        m.metallic = 1.0;
        m.roughness = 0.3;
      })

      console.log(animationgGroups);
    }
  )

  BABYLON.SceneLoader.ImportMesh('','','worker.gltf',scene,
    (meshes) => {
      const model = meshes[0];
      model.name = 'worker';
    }
  )

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
  const camera = new BABYLON.ArcRotateCamera('camera', 2 * Math.PI * 1 / 4, Math.PI / 2, 20, new BABYLON.Vector3(0, 0, 0),scene)
  camera.attachControl(true);
  camera.inputs.addMouseWheel();
}


const initScene = async (scene: BABYLON.Scene) => {
  await loadAssets(scene);
  await setupEnvironment(scene);


  return scene;
}



Promise.all([initScene(createScene()), createFontData()]).then(([scene,fontData]) => {
  const StateManager = new S.StateManager(S.sadState, scene, { fontData });

  expBtn.onclick = () => {
    StateManager.requestChange(S.happyState);
  }

  engine.runRenderLoop(() => {
    StateManager.changeIfRequested()

    scene.render();
  });

  window.addEventListener('resize', () => {
    engine.resize();
  });
})