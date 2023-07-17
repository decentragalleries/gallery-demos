import "@babylonjs/loaders";
import "@babylonjs/inspector";
import { Engine, EngineStore, Scene } from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";

const canvas = document.getElementById("renderCanvas");
const fpsDiv = document.getElementById("fps");

const engine = new Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
  disableWebGL2Support: false,
});
const scene = new Scene(engine);

EngineStore.Instances.push(engine);
EngineStore._LastCreatedScene = scene;

window.addEventListener("resize", function () {
  engine.resize();
});

globalThis.HK = await HavokPhysics();

const startRenderLoop = () => {
  engine.runRenderLoop(() => {
    scene.render();
    fpsDiv.innerHTML = engine.getFps().toFixed() + " fps";
  });
};

export { scene, canvas, engine, startRenderLoop };
