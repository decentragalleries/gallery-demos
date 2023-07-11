export const createScene = async (engine, canvas) => {
  // Create the main scene
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


  // Create the main camera representing the user's movement
  // var camera = new BABYLON.ArcRotateCamera("mainCamera", -Math.PI / 2, Math.PI / 4, 10, new BABYLON.Vector3(0, 0, 0), mainScene);
   const camera = new BABYLON.FreeCamera(
    "FreeCamera",
    new BABYLON.Vector3(0, 14, 0),
    scene
  );
  camera.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
  camera.speed = 1.5;
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

  // var camera2 = new BABYLON.FreeCamera("Camera2", new BABYLON.Vector3(0, 24, 0), scene);
    
  // camera.viewport = new BABYLON.Viewport(0, 0, 1.0, 1.0);
  // camera2.viewport = new BABYLON.Viewport(0.8, 0.8, 0.2, 0.2);
  
  // scene.activeCameras.push(camera);
  // scene.activeCameras.push(camera2);
  

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
    scene.debugLayer.show();
  
    const gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  
    const collisionBtn = BABYLON.GUI.Button.CreateSimpleButton(
      "collisionBtn",
      "Disable Collision"
    );
    collisionBtn.color = "white";
    collisionBtn.background = "rgba(0, 100, 170)";
    collisionBtn.onPointerUpObservable.add(() => {
      collisionBtn.textBlock.text = camera.checkCollisions
        ? "Enable Collision"
        : "Disable Collision";
      camera.checkCollisions = !camera.checkCollisions;
    });
    collisionBtn.hoverCursor = "pointer";
    collisionBtn.thickness = 0;
    collisionBtn.height = `${0.07 * window.innerHeight}px`;
    collisionBtn.width = 0.15;
    collisionBtn.paddingRight = "10px";
    collisionBtn.paddingBottom = "10px";
    collisionBtn.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    collisionBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    gui.addControl(collisionBtn);


    const isLocalPath = true;
  const modelNode = new BABYLON.TransformNode();

  BABYLON.SceneLoader.ImportMeshAsync(
    "",
    isLocalPath ? "../../models/baked-lights/" : "https://gateway.pinata.cloud/ipfs/QmZhmR5yYZr2CYX3vudAng6MTgLMdukGghmbh3v1X4h6JR/",
    "baked-lights.glb"
  ).then((result) => {
    result.meshes.forEach((mesh) => {
      mesh.checkCollisions = true;

      if (!mesh.parent) {
        mesh.parent = modelNode;
      }
    });

    modelNode.scaling.x = 10;
    modelNode.scaling.y = 10;
    modelNode.scaling.z = 10;

    document.getElementById("loading").style.display = "none";
  });
 
  return scene;

};
