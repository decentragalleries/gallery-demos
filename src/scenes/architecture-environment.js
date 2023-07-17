import { scene, canvas, startRenderLoop, engine } from "../engine";
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
} from "@babylonjs/core";
import {
  AdvancedDynamicTexture,
  Button,
  Control,
  StackPanel,
} from "@babylonjs/gui";

var modelNode = null;

const uploadFile = (e) => {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  const fileReader = new FileReader();
  fileReader.onload = async function (e) {
    if (modelNode) modelNode.dispose();
    modelNode = new TransformNode("Uploaded Model");
    SceneLoader.ImportMeshAsync("", "", e.target.result).then((result) => {
      result.meshes.forEach((mesh) => {
        mesh.checkCollisions = true;

        if (!mesh.parent) {
          mesh.parent = modelNode;
        }
      });

      modelNode.scaling.x = 10;
      modelNode.scaling.y = 10;
      modelNode.scaling.z = 10;
    });
  };

  fileReader.readAsDataURL(file);
};

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
camera.speed = 1.5;
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

const UI_HEIGHT = 200;
var debuggerOn = false;

const fileInput = document.createElement("input");
fileInput.setAttribute("type", "file");
fileInput.addEventListener("change", uploadFile, false);

const gui = AdvancedDynamicTexture.CreateFullscreenUI("UI");

window.addEventListener("resize", () => {
  gui.scaleTo(engine.getRenderWidth(), engine.getRenderHeight());
});

const stackPanel = new StackPanel();
stackPanel.heightInPixels = UI_HEIGHT;
stackPanel.widthInPixels = 200;
stackPanel.paddingRight = "10px";
stackPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
stackPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
gui.addControl(stackPanel);

const uploadBtn = Button.CreateSimpleButton("uploadBtn", "Upload Model");
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

const debugButton = Button.CreateSimpleButton("debugButton", "Show Debugger");
debugButton.color = "white";
debugButton.background = "rgba(0, 100, 170)";
debugButton.onPointerUpObservable.add(() => {
  debugButton.textBlock.text = !debuggerOn ? "Hide Debugger" : "Show Debugger";
  if (debuggerOn) scene.debugLayer.hide();
  else scene.debugLayer.show();
  debuggerOn = !debuggerOn;
});
debugButton.hoverCursor = "pointer";
debugButton.thickness = 0;
debugButton.height = `${0.31 * UI_HEIGHT}px`;
debugButton.paddingTop = `${0.03 * UI_HEIGHT}px`;
stackPanel.addControl(debugButton);

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
collisionBtn.height = `${0.31 * UI_HEIGHT}px`;
collisionBtn.paddingTop = `${0.03 * UI_HEIGHT}px`;
stackPanel.addControl(collisionBtn);

startRenderLoop();
