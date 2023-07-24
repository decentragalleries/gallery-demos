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
  ShadowGenerator,
  MeshBuilder,
  Animation,
  PointLight,
  DirectionalLight,
} from "@babylonjs/core";
import { addFreeCamera } from "babylonjs-samples";

var hk = new HavokPlugin();
const physicsGravity = new Vector3(0, -9.81, 0);
scene.enablePhysics(physicsGravity, hk);

// Enable camera gravity
const assumedFramesPerSecond = 10;
const earthGravity = -9.81;
scene.gravity = new Vector3(0, earthGravity / assumedFramesPerSecond, 0);

// Camera
const camera = addFreeCamera("FreeCamera", new Vector3(0, 14, 0), scene);
camera.attachControl(canvas, true);

// Lighting
// var light = HemiSphericLight(scene);

// Ground
var ground = Mesh.CreatePlane("ground", 10000.0, scene);
ground.rotation = new Vector3(Math.PI / 2, 0, 0);
ground.checkCollisions = true;
ground.receiveShadows = true;
ground.position = new Vector3(0, -0.02, 0);
const groundMaterial = new StandardMaterial("groundMaterial", scene);
groundMaterial.alpha = 1;
groundMaterial.diffuseColor = new Color3(0.8, 0.8, 0.8);
groundMaterial.specularColor = new Color3(0, 0, 0);
ground.material = groundMaterial;
new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);

// Enable for scene debugger:
// scene.debugLayer.show();

const ellipse = new MeshBuilder.CreateCapsule("player", {
  height: 0.5,
  radius: 0.25,
});
ellipse.parent = camera;

const lights = [];
const shadowGenerators = [];

const dl = new DirectionalLight("dl1", new Vector3(-1, -0.5, -1));
dl.position = new Vector3(27, 2, 18);
lights.push(dl);
const dl2 = new DirectionalLight("dl21", new Vector3(1, -0.5, 1));
dl2.position = new Vector3(-8, 2, -2);
lights.push(dl2);
const dl3 = new DirectionalLight("dl31", new Vector3(-1, -0.5, 1));
dl3.position = new Vector3(27, 2, -2);
lights.push(dl3);
const dl4 = new DirectionalLight("dl41", new Vector3(1, -0.5, -1));
dl4.position = new Vector3(-8, 2, 18);
lights.push(dl4);

lights.forEach((light) => {
  const shadowGenerator = new ShadowGenerator(2048, light);
  shadowGenerator.useBlurExponentialShadowMap = true;
  shadowGenerator.useKernelBlur = true;
  shadowGenerator.blurKernel = 64;
  shadowGenerator.addShadowCaster(ellipse);
  shadowGenerators.push(shadowGenerator);
});

const boxMaterial = new StandardMaterial("boxMaterial");
boxMaterial.diffuseColor = new Color3(0, 0, 255);

for (var i = 0; i < 30; i++) {
  const box = MeshBuilder.CreateBox(`movingBox-${i}`, {
    diameter: 0.5,
  });
  box.material = boxMaterial;
  box.position = new Vector3(4 * (i % 6), 0.25, 4 * parseInt(i / 6));
  box.receiveShadows = true;

  shadowGenerators.forEach((shadowGenerator) => {
    shadowGenerator.addShadowCaster(box);
  });

  const xSlide = new Animation(
    `xSlide-${i}`,
    "position.x",
    1,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  xSlide.setKeys([
    {
      frame: 0,
      value: -5 + 4 * (i % 6),
    },
    {
      frame: 1,
      value: 5 + 4 * (i % 6),
    },
    {
      frame: 2,
      value: -5 + 4 * (i % 6),
    },
  ]);
  box.animations.push(xSlide);
  scene.beginAnimation(box, 0, 2, true, 0.3);
}

startRenderLoop();
