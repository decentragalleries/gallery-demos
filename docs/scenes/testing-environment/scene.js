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

  const UI_HEIGHT = 200;
  var debuggerOn = false;

  const fileInput = document.createElement("input");
  fileInput.setAttribute("type", "file");
  fileInput.addEventListener("change", uploadFile, false);

  const gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  const stackPanel = new BABYLON.GUI.StackPanel();
  stackPanel.heightInPixels = UI_HEIGHT;
  stackPanel.widthInPixels = 200;
  stackPanel.paddingRight = "10px";
  stackPanel.horizontalAlignment =
    BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  stackPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  gui.addControl(stackPanel);

  const uploadBtn = BABYLON.GUI.Button.CreateSimpleButton(
    "uploadBtn",
    "Upload Model"
  );
  uploadBtn.color = "white";
  uploadBtn.background = "rgba(0, 100, 170)";
  uploadBtn.onPointerUpObservable.add(() => {
    fileInput.click();
  });
  uploadBtn.hoverCursor = "pointer";
  uploadBtn.thickness = 0;
  uploadBtn.height = `${0.31 * UI_HEIGHT}px`;
  uploadBtn.paddingTop = `${0.03 * UI_HEIGHT}px`;
  stackPanel.addControl(uploadBtn);

  const debugButton = BABYLON.GUI.Button.CreateSimpleButton(
    "debugButton",
    "Show Debugger"
  );
  debugButton.color = "white";
  debugButton.background = "rgba(0, 100, 170)";
  debugButton.onPointerUpObservable.add(() => {
    debugButton.textBlock.text = !debuggerOn
      ? "Hide Debugger"
      : "Show Debugger";
    if (debuggerOn) scene.debugLayer.hide();
    else scene.debugLayer.show();
    debuggerOn = !debuggerOn;
  });
  debugButton.hoverCursor = "pointer";
  debugButton.thickness = 0;
  debugButton.height = `${0.31 * UI_HEIGHT}px`;
  debugButton.paddingTop = `${0.03 * UI_HEIGHT}px`;
  stackPanel.addControl(debugButton);

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
  collisionBtn.height = `${0.31 * UI_HEIGHT}px`;
  collisionBtn.paddingTop = `${0.03 * UI_HEIGHT}px`;
  stackPanel.addControl(collisionBtn);

  return scene;
};

var modelNode = null;

const uploadFile = (e) => {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  const fileReader = new FileReader();
  fileReader.onload = async function (e) {
    if (modelNode) modelNode.dispose();
    modelNode = new BABYLON.TransformNode("Uploaded Model");
    BABYLON.SceneLoader.ImportMeshAsync("", "", e.target.result).then(
      (result) => {
        result.meshes.forEach((mesh) => {
          mesh.checkCollisions = true;

          if (!mesh.parent) {
            mesh.parent = modelNode;
          }
        });

        modelNode.scaling.x = 10;
        modelNode.scaling.y = 10;
        modelNode.scaling.z = 10;
      }
    );
  };

  fileReader.readAsDataURL(file);
};
