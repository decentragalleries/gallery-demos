import { importDemoModels } from "./components/demo-models-import.js";

export const createScene = async (engine, canvas) => {
  const scene = new BABYLON.Scene(engine);

  // Enable physics engine for object gravity and collision
  globalThis.HK = await HavokPhysics();
  var hk = new BABYLON.HavokPlugin();
  const physicsGravity = new BABYLON.Vector3(0, 0, 0);
  scene.enablePhysics(physicsGravity, hk);

  // Enable camera gravity
  const assumedFramesPerSecond = 10;
  const earthGravity = -9.81;
  scene.gravity = new BABYLON.Vector3(
    0,
    earthGravity / assumedFramesPerSecond,
    0
  );

  // Camera
  const camera = new BABYLON.FreeCamera(
    "FreeCamera",
    new BABYLON.Vector3(0, 14, 0),
    scene
  );
  camera.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
  camera.speed = 0.7;
  camera.ellipsoid = new BABYLON.Vector3(2, 7, 2);
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
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(1, 1, 0)
  );

  // Ground
  const ground = BABYLON.Mesh.CreatePlane("ground", 10000.0, scene);
  ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
  ground.checkCollisions = true;
  ground.position = new BABYLON.Vector3(0, -0.02, 0);
  const groundMaterial = new BABYLON.StandardMaterial(scene);
  groundMaterial.alpha = 1;
  groundMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
  ground.material = groundMaterial;
  new BABYLON.PhysicsAggregate(
    ground,
    BABYLON.PhysicsShapeType.BOX,
    { mass: 0 },
    scene
  );

  // Enable for scene debugger:
  // scene.debugLayer.show();

  importDemoModels(scene, camera);
  return scene;
};
