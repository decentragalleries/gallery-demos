import { scene, canvas, engine, startRenderLoop } from "../engine";
import {
  Vector3,
  Mesh,
  PhysicsAggregate,
  PhysicsShapeType,
  HemisphericLight,
  TransformNode,
  SceneLoader,
  Sound
} from "@babylonjs/core";
import { AdvancedDynamicTexture} from "@babylonjs/gui";
import {downloadModel,getGLBNamesFromYAML,getMusic, addFreeCamera, enablePhysics, addGround, addCollisionBtn, addBoundingBox} from 'babylonjs-samples'

enablePhysics(scene);

// Enable for scene debugger:
// scene.debugLayer.show();

// Camera
const camera = addFreeCamera("FreeCamera", new Vector3(0, 14, 0), scene);
camera.attachControl(canvas, true);

const audioData = await getMusic(scene,"violon.mp3");

// const music = new Sound(
//     "Violons",
//     audioData,
//     scene,
//     function () {
//       music.play();
//     },
//     {
//       spatialSound: true,
//       distanceModel: "exponential",
//       rolloffFactor: 1,
//       loop: true,
//       autoplay: true,
//     }
//    );


// Lighting
const light = new HemisphericLight("light", new Vector3(1, 1, 0));

// Ground
const ground = addGround("ground", 10000.0, scene);
new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);

const gui = AdvancedDynamicTexture.CreateFullscreenUI("UI", undefined, scene);

window.addEventListener("resize", () => {
  gui.scaleTo(engine.getRenderWidth(), engine.getRenderHeight());
});

const collisionBtn = addCollisionBtn("collisionBtn","Disable Collision",camera);
gui.addControl(collisionBtn);

const modelNode = new TransformNode();

const loadingDiv = document.createElement("div");
loadingDiv.setAttribute("id", "loading");
loadingDiv.innerHTML = "3D models are loading...";
document.body.appendChild(loadingDiv);

var allChildMeshes = [];

const names = await getGLBNamesFromYAML("classic gallery")

for (const name of names) {

    var glbDataUrl = await downloadModel(name);

    SceneLoader.ImportMeshAsync(
    "", 
    "", 
    glbDataUrl, 
    scene
    ).then((result) => {
    result.transformNodes.forEach((node) => {
        if (
        node.getChildMeshes().length === node.getChildren().length &&
        node.getChildren().length > 0
        ) {
        const childMeshes = node.getChildMeshes();

        allChildMeshes.push(...childMeshes);

        // Create a parent mesh to encapsulate the child meshes
        var mesh = Mesh.MergeMeshes(
            childMeshes,
            true,
            true,
            undefined,
            false,
            true
        );

        mesh.scaling = new Vector3(10,10,10)
        addBoundingBox(mesh);
        }
    });

    result.meshes.forEach((mesh) => {
        if (!mesh.parent) {
        mesh.parent = modelNode;
        }

        if (!allChildMeshes.includes(mesh)) {
              addBoundingBox(mesh);
             }
    });

    modelNode.scaling = new Vector3(10,10,10)
    loadingDiv.style.display = "none";
    });
}
startRenderLoop();
