import { scene, canvas, startRenderLoop } from "../engine";
import { HemiSphericLight } from "babylonjs-samples";
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

var hk = new HavokPlugin();
const physicsGravity = new Vector3(0, -9.81, 0);
scene.enablePhysics(physicsGravity, hk);

// Enable camera gravity
const assumedFramesPerSecond = 10;
const earthGravity = -9.81;
scene.gravity = new Vector3(0, earthGravity / assumedFramesPerSecond, 0);

// Camera
const camera = new FreeCamera("FreeCamera", new Vector3(0, 1, 0), scene);
camera.speed = 0.3;
camera.applyGravity = true;
camera.checkCollisions = true;
camera.ellipsoid = new Vector3(1, 0.5, 1);
camera._needMoveForGravity = true;
camera.attachControl(canvas, true);

// WASD
camera.keysUp.push(87);
camera.keysLeft.push(65);
camera.keysRight.push(68);
camera.keysDown.push(83);

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
