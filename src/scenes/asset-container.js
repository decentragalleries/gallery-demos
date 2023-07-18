import { scene, canvas, engine, startRenderLoop } from "../engine";
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
  TransformNode,
  SceneLoader,
  AssetContainer,
} from "@babylonjs/core";
import {
  AdvancedDynamicTexture,
  Button,
  Control,
  StackPanel,
} from "@babylonjs/gui";

const isLocalPath = false;
const count = 5;

const loading = Array.from(Array(count), (el) => true);
const UI_HEIGHT_PERC = 0.3;
var index = 0;
var stackPanel = null;

const loadingDiv = document.createElement("div");
loadingDiv.setAttribute("id", "loading");
loadingDiv.innerHTML = "3D models are loading...";
document.body.appendChild(loadingDiv);

const importDemoModel = (
  btnName,
  localPath,
  remotePath,
  fileName,
  position,
  cameraPos,
  cameraMaxZ,
  isTeleportable = false,
  container = null
) => {
  const localIndex = index;
  if (isTeleportable) index++;

  const modelNode = new TransformNode();

  SceneLoader.ImportMeshAsync(
    "",
    isLocalPath ? `/models/${localPath}` : remotePath,
    fileName
  ).then((result) => {
    result.meshes.forEach((mesh) => {
      if (mesh.id !== "G-__563250" && mesh.id !== "G-__555888") {
        mesh.checkCollisions = true;
        if (container) {
          container.meshes.push(mesh);
        }
      }
      if (!mesh.parent) {
        mesh.parent = modelNode;
      }
    });

    modelNode.scaling.x = 10;
    modelNode.scaling.y = 10;
    modelNode.scaling.z = 10;
    modelNode.position = new Vector3(position[0], position[1], position[2]);

    if (isTeleportable) {
      loading[localIndex] = false;
      if (loading.indexOf(true) === -1) loadingDiv.style.display = "none";
    }
  });

  if (isTeleportable && stackPanel) {
    const roomBtn = Button.CreateSimpleButton(
      `roomBtn${localIndex + 1}`,
      btnName
    );
    roomBtn.color = "white";
    roomBtn.background = "rgba(0, 100, 170)";
    roomBtn.onPointerUpObservable.add(() => {
      camera.position = new Vector3(cameraPos[0], cameraPos[1], cameraPos[2]);
      camera.maxZ = cameraMaxZ;
    });
    roomBtn.hoverCursor = "pointer";
    roomBtn.thickness = 0;
    roomBtn.height = `${
      (1 / (count + 1) - 0.02) * UI_HEIGHT_PERC * window.innerHeight
    }px`;
    roomBtn.paddingTop = `${0.03 * UI_HEIGHT_PERC * window.innerHeight}px`;
    stackPanel.addControl(roomBtn);
  }
};

const setupStackPanel = () => {
  const gui = AdvancedDynamicTexture.CreateFullscreenUI("UI");

  window.addEventListener("resize", () => {
    gui.scaleTo(engine.getRenderWidth(), engine.getRenderHeight());
  });

  const stackPanel = new StackPanel();
  stackPanel.height = UI_HEIGHT_PERC;
  stackPanel.width = 0.15;
  stackPanel.paddingRight = "10px";
  stackPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
  stackPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
  gui.addControl(stackPanel);

  const collisionBtn = Button.CreateSimpleButton(
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
  collisionBtn.height = `${
    (1 / (count + 1) - 0.02) * UI_HEIGHT_PERC * window.innerHeight
  }px`;
  collisionBtn.paddingTop = `${0.03 * UI_HEIGHT_PERC * window.innerHeight}px`;
  stackPanel.addControl(collisionBtn);

  return stackPanel;
};

const importDemoModels = (container = null) => {
  camera.speed = 1.5;
  camera.maxZ = 150;
  camera.position = new Vector3(-26, 14, -15);
  stackPanel = setupStackPanel();

  importDemoModel(
    "Room 1",
    "old/",
    "https://gateway.pinata.cloud/ipfs/QmYoc9GbRfgSupiinQvFVZ895qaMQveowfEYGsrfGDRbBh/",
    "room test 1.glb",
    [0, 0, 0],
    [-26, 14, -15],
    150,
    true,
    container
  );
  importDemoModel(
    "Room 2",
    "old/",
    "https://gateway.pinata.cloud/ipfs/QmYoc9GbRfgSupiinQvFVZ895qaMQveowfEYGsrfGDRbBh/",
    "room test 2.glb",
    [1000, 0, 0],
    [617, 14, -42.4],
    150,
    true,
    container
  );
  importDemoModel(
    "Test Gallery",
    "old/",
    "https://gateway.pinata.cloud/ipfs/QmYoc9GbRfgSupiinQvFVZ895qaMQveowfEYGsrfGDRbBh/",
    "old_gallery.glb",
    [2000, 0, 0],
    [1417, 14, -59],
    500,
    true,
    container
  );
  importDemoModel(
    "Classic",
    "classic gallery/",
    "https://gateway.pinata.cloud/ipfs/QmeT2RxNSmpJiS1wS7Y35fnBiFbf1uCoDppQr8kLsuGQ7J/",
    "classic gallery small base model.glb",
    [3000, 13, 0],
    [2876, 31, -49],
    500,
    true,
    container
  );

  importDemoModel(
    "Classic",
    "classic gallery/",
    "https://gateway.pinata.cloud/ipfs/QmeT2RxNSmpJiS1wS7Y35fnBiFbf1uCoDppQr8kLsuGQ7J/",
    "classic gallery small door 2 part 1.glb",
    [3000, 13, 0],
    [2870, 31, -34],
    500,
    false,
    container
  );

  importDemoModel(
    "Classic",
    "classic gallery/",
    "https://gateway.pinata.cloud/ipfs/QmeT2RxNSmpJiS1wS7Y35fnBiFbf1uCoDppQr8kLsuGQ7J/",
    "classic gallery small door 2 part 2.glb",
    [3000, 13, 0],
    [2870, 31, -34],
    500,
    false,
    container
  );

  importDemoModel(
    "Classic",
    "classic gallery/",
    "https://gateway.pinata.cloud/ipfs/QmeT2RxNSmpJiS1wS7Y35fnBiFbf1uCoDppQr8kLsuGQ7J/",
    "classic gallery small door 1 part 1.glb",
    [3000, 13, 0],
    [2870, 31, -34],
    500,
    false,
    container
  );

  importDemoModel(
    "Classic",
    "classic gallery/",
    "https://gateway.pinata.cloud/ipfs/QmeT2RxNSmpJiS1wS7Y35fnBiFbf1uCoDppQr8kLsuGQ7J/",
    "classic gallery small door 1 part 2.glb",
    [3000, 13, 0],
    [2870, 31, -34],
    500,
    false,
    container
  );

  importDemoModel(
    "Classic",
    "classic gallery/",
    "https://gateway.pinata.cloud/ipfs/QmeT2RxNSmpJiS1wS7Y35fnBiFbf1uCoDppQr8kLsuGQ7J/",
    "classic gallery small frame type 1.glb",
    [3000, 13, 0],
    [2824, 31, -185],
    500,
    false,
    container
  );

  importDemoModel(
    "Classic",
    "classic gallery/",
    "https://gateway.pinata.cloud/ipfs/QmeT2RxNSmpJiS1wS7Y35fnBiFbf1uCoDppQr8kLsuGQ7J/",
    "classic gallery small frame type 2.glb",
    [2970, 13, 0],
    [2824, 31, -185],
    500,
    false,
    container
  );
  importDemoModel(
    "Gothic",
    "gothic gallery/",
    "https://gateway.pinata.cloud/ipfs/QmYa8j4UHUBin4uPrvEkG934ZuCKXsoiPTiSJ2ExH1LFr1/",
    "gothic gallery small.glb",
    [4000, 0, 0],
    [3920, 14, -102],
    500,
    true,
    container
  );
};

var container = new AssetContainer(scene);

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
camera.speed = 0.7;
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
const ground = Mesh.CreatePlane("ground", 10000.0, scene);
ground.rotation = new Vector3(Math.PI / 2, 0, 0);
ground.checkCollisions = true;
ground.position = new Vector3(0, -0.02, 0);
const groundMaterial = new StandardMaterial("groundMaterial", scene);
groundMaterial.alpha = 1;
groundMaterial.diffuseColor = new Color3(0.8, 0.8, 0.8);
ground.material = groundMaterial;
new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);

container.meshes.push(ground);

// Enable for scene debugger:
// scene.debugLayer.show();

importDemoModels(container);

var toggle = 0;
document.onkeydown = () => {
  if (toggle++ % 2 == 0) {
    container.removeAllFromScene();
  } else {
    container.addAllToScene();
  }
};

startRenderLoop();
