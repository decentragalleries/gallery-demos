import { HemiSphericLight } from "babylonjs-samples";

global.createScene = async (engine, canvas) => {
  const scene = new BABYLON.Scene(engine);

  // Enable physics engine for object gravity and collision
  globalThis.HK = await HavokPhysics();
  var hk = new BABYLON.HavokPlugin();
  const physicsGravity = new BABYLON.Vector3(0, -9.81, 0);
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
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  camera.speed = 0.3;
  camera.applyGravity = true;
  camera.checkCollisions = true;
  camera.ellipsoid = new BABYLON.Vector3(1, 0.5, 1);
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
  var ground = BABYLON.Mesh.CreatePlane("ground", 10000.0, scene);
  ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
  ground.checkCollisions = true;
  ground.receiveShadows = true;
  ground.position = new BABYLON.Vector3(0, -0.02, 0);
  const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
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

  return scene;
};
