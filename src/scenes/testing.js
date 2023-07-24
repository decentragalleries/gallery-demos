import { scene, canvas, startRenderLoop } from "../engine";
import { HemiSphericLight, addFreeCamera, enablePhysics } from "babylonjs-samples";
import {
  HavokPlugin,
  Vector3,
  FreeCamera,
  Mesh,
  StandardMaterial,
  Color3,
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
var ground = Mesh.CreatePlane("ground", 10000.0, scene);
ground.rotation = new Vector3(Math.PI / 2, 0, 0);
ground.checkCollisions = true;
ground.receiveShadows = true;
ground.position = new Vector3(0, -0.02, 0);
const groundMaterial = new StandardMaterial("groundMaterial", scene);
groundMaterial.alpha = 1;
groundMaterial.diffuseColor = new Color3(0.8, 0.8, 0.8);
ground.material = groundMaterial;
new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);

// Enable for scene debugger:
// scene.debugLayer.show();

startRenderLoop();
