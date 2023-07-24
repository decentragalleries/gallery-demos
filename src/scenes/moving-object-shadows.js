import { scene, canvas, startRenderLoop } from "../engine";
import {
  Vector3,
  StandardMaterial,
  Color3,
  PhysicsAggregate,
  PhysicsShapeType,
  ShadowGenerator,
  MeshBuilder,
  Animation,
  DirectionalLight,
} from "@babylonjs/core";
import { addFreeCamera, enablePhysics, addGround } from "babylonjs-samples";

enablePhysics(scene);

// Camera
const camera = addFreeCamera("FreeCamera", new Vector3(0, 14, 0), scene);
camera.attachControl(canvas, true);

// Lighting
// var light = HemiSphericLight(scene);

// Ground
const ground = addGround("ground", 10000.0, scene);
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
