import { scene, canvas, startRenderLoop, engine } from "../engine";
import {
  Vector3,
  PhysicsAggregate,
  PhysicsShapeType,
  HemisphericLight,
  TransformNode,
  SceneLoader,
} from "@babylonjs/core";
import {
  AdvancedDynamicTexture,
  Control,
  StackPanel,
} from "@babylonjs/gui";
import { addFreeCamera, enablePhysics, addGround, addUploadBtn, addDebugBtn, addCollisionBtn } from "babylonjs-samples";

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


enablePhysics(scene);

// Camera
const camera = addFreeCamera("FreeCamera",scene, new Vector3(0, 14, 0));
camera.attachControl(canvas, true);

// Lighting
const light = new HemisphericLight("light", new Vector3(1, 1, 0));

// Ground
const ground = addGround("ground", 10000.0, scene);
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

const uploadBtn = addUploadBtn("uploadBtn", "Upload Model", fileInput, UI_HEIGHT);
stackPanel.addControl(uploadBtn);

const debugButton = addDebugBtn("debugButton", "Show Debugger", debuggerOn, UI_HEIGHT, scene);
stackPanel.addControl(debugButton);

const collisionBtn = addCollisionBtn("collisionBtn","Disable Collision", camera, UI_HEIGHT);
stackPanel.addControl(collisionBtn);

startRenderLoop();
