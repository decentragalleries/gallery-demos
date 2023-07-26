import { scene, canvas, engine, startRenderLoop } from "../engine";
import {
  Vector3,
  PhysicsAggregate,
  PhysicsShapeType,
  HemisphericLight,
  Sound
} from "@babylonjs/core";
import { AdvancedDynamicTexture} from "@babylonjs/gui";
import {getGLBNamesFromYAML,getMusic, addFreeCamera, enablePhysics, addGround, addCollisionBtn, importGLB} from 'babylonjs-samples';

// Enable for scene debugger:
// scene.debugLayer.show();

enablePhysics(scene);

// Camera
const camera = addFreeCamera("FreeCamera", new Vector3(0, 14, 0), scene);
camera.attachControl(canvas, true);

const audioData = await getMusic(scene,"sounds/violon.mp3");

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

const isLocalPath = false;

const loadingDiv = document.createElement("div");
loadingDiv.setAttribute("id", "loading");
loadingDiv.innerHTML = "3D models are loading...";
document.body.appendChild(loadingDiv);


const names = await getGLBNamesFromYAML("classic gallery")

for (var name of names) {

    importGLB(name,isLocalPath);
}

loadingDiv.style.display = "none";

startRenderLoop();
