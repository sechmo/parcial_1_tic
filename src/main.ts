import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement

const engine = new BABYLON.Engine(canvas);

const createScene = async () => {
  const scene  = new BABYLON.Scene(engine)


  const envTexture =  new BABYLON.CubeTexture("environment.env", scene);
  // scene.environmentTexture =
  scene.createDefaultSkybox(envTexture, true)

  // scene.createDefaultCameraOrLight(true, false, true);
  scene.createDefaultLight()

  // const camera = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(0,5,-10), scene);
  const camera = new BABYLON.ArcRotateCamera('camera',2 * Math.PI*3/4,Math.PI/2,20,new BABYLON.Vector3(0,0,0))
  camera.attachControl(true);
  camera.inputs.addMouseWheel();


  // const ground = BABYLON.MeshBuilder.CreateGround('myGround',{
  //   height: 10,
  //   width: 10,
  //   subdivisions: 30,
  // });

  // ground.material = new BABYLON.StandardMaterial("groundMaterial");
  // ground.material.wireframe = true


  const fontData = await (await fetch("Roboto_Regular.json")).json()
  const text = BABYLON.MeshBuilder.CreateText('myText','Taller de Invención y Creatividad',fontData, {
    size: 2
  })
  if (text != null) {
    text.position = new BABYLON.Vector3(0,0,+10);
  }

  let openAnim: BABYLON.Nullable<BABYLON.AnimationGroup> = null;
  let closeAnim: BABYLON.Nullable<BABYLON.AnimationGroup> = null;
  let isOpen = false;
  const casco = BABYLON.SceneLoader.ImportMesh(
    '',
    '',
    'casco.gltf',
    scene,
    (meshes, _particleSystems, _skeletons, animationgGroups) => {
      // const model = meshes[0];



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

      mats.forEach((m,i)=> {
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

      openAnim = animationgGroups[0];
      openAnim.loopAnimation = false;
      openAnim.stop();

      closeAnim = animationgGroups[1];


    }

  );
  if (casco) {
    casco.name = "casco";
  }

  scene.onPointerDown = () => {
    const hit = scene.pick(scene.pointerX, scene.pointerY);

    if (hit.pickedMesh && hit.pickedMesh?.name != "myText") {
      console.log(isOpen);
      if (!isOpen && openAnim) {
        openAnim.play(false);
        isOpen = true;
      }
      else if (closeAnim) {
        closeAnim?.play(false);
        isOpen = false;
      }
    }
  }


  return scene;
}

createScene().then((scene) => {

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener('resize', () => {
    engine.resize();
  });
});