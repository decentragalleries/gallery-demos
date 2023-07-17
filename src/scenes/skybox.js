import { scene, canvas, startRenderLoop } from "../engine";
import {
  HavokPlugin,
  Vector3,
  FreeCamera,
  Mesh,
  StandardMaterial,
  Color3,
  PhysicsAggregate,
  PhysicsShapeType,
  HemisphericLight,
  MeshBuilder,
  Texture,
  Animation,
} from "@babylonjs/core";

// Enable physics engine for object gravity and collision
var hk = new HavokPlugin();
const physicsGravity = new Vector3(0, 0, 0);
scene.enablePhysics(physicsGravity, hk);

// Enable camera gravity
const assumedFramesPerSecond = 10;
const earthGravity = -9.81;
scene.gravity = new Vector3(0, earthGravity / assumedFramesPerSecond, 0);

// Camera
const camera = new FreeCamera("FreeCamera", new Vector3(0, 14, 0), scene);
camera.rotation = new Vector3(0, Math.PI / 2, 0);
camera.speed = 1;
camera.ellipsoid = new Vector3(2, 7, 2);
camera.applyGravity = true;
camera.checkCollisions = true;
camera._needMoveForGravity = true;
camera.attachControl(canvas, true);

// WASD
camera.keysUp.push(87);
camera.keysLeft.push(65);
camera.keysRight.push(68);
camera.keysDown.push(83);

// Lighting
const light = new HemisphericLight("light", new Vector3(1, 1, 0));

// Ground
const ground = Mesh.CreatePlane("ground", 100.0, scene);
ground.rotation = new Vector3(Math.PI / 2, 0, 0);
ground.checkCollisions = true;
ground.position = new Vector3(0, -0.02, 0);
const groundMaterial = new StandardMaterial("groundMaterial", scene);
groundMaterial.alpha = 1;
groundMaterial.diffuseColor = new Color3(0.8, 0.8, 0.8);
ground.material = groundMaterial;
new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);

// var f = new Vector4(0.5, 0, 1, 1); // front image = half the whole image along the width
// var b = new Vector4(0, 0, 0.5, 1); // back image = second half along the width

var sphere = MeshBuilder.CreateSphere("sphere", {
  diameter: 10000,
  sideOrientation: Mesh.BACKSIDE,
  // frontUV: f,
  // backUV: b
});

var skyMaterial = new StandardMaterial("skyMaterial", scene);
skyMaterial.emissiveTexture = new Texture("/assets/images/skybox.hdr", scene);
skyMaterial.emissiveTexture.level = 0.5;
skyMaterial.disableLighting = true;
sphere.material = skyMaterial;
sphere.rotation = new Vector3(Math.PI, 0, 0);

const rotationAnimation1 = new Animation(
  "rotateSky1",
  "rotation.y",
  1,
  Animation.ANIMATIONTYPE_FLOAT,
  Animation.ANIMATIONLOOPMODE_CYCLE
);
const rotationAnimation2 = new Animation(
  "rotateSky2",
  "rotation.x",
  1,
  Animation.ANIMATIONTYPE_FLOAT,
  Animation.ANIMATIONLOOPMODE_CYCLE
);

rotationAnimation1.setKeys([
  {
    frame: 0,
    value: 0,
  },
  {
    frame: 1,
    value: -2 * Math.PI,
  },
]);
rotationAnimation2.setKeys([
  {
    frame: 0,
    value: Math.PI,
  },
  {
    frame: 1,
    value: -Math.PI,
  },
]);
sphere.animations.push(rotationAnimation1);
sphere.animations.push(rotationAnimation2);
scene.beginAnimation(sphere, 0, 1, true, 0.001);

startRenderLoop();
