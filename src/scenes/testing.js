import { scene, canvas, startRenderLoop } from "../engine";
import { HemiSphericLight, addFreeCamera, enablePhysics, addGround } from "babylonjs-samples";
import {
  Vector3,
  PhysicsAggregate,
  PhysicsShapeType,
} from "@babylonjs/core";


enablePhysics(scene);

// Camera
const camera = addFreeCamera("FreeCamera", new Vector3(0, 14, 0), scene);
camera.attachControl(canvas, true);

// Lighting
var light = HemiSphericLight(scene);

// Ground
const ground = addGround("ground", 10000.0, scene);
new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);

// Enable for scene debugger:
// scene.debugLayer.show();

startRenderLoop();
