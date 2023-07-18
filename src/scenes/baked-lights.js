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
  MeshBuilder,
} from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control } from "@babylonjs/gui";

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

// Enable for scene debugger:
// scene.debugLayer.show();

const gui = AdvancedDynamicTexture.CreateFullscreenUI("UI", undefined, scene);

window.addEventListener("resize", () => {
  gui.scaleTo(engine.getRenderWidth(), engine.getRenderHeight());
});

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
collisionBtn.height = `${0.07 * window.innerHeight}px`;
collisionBtn.width = 0.15;
collisionBtn.paddingRight = "10px";
collisionBtn.paddingBottom = "10px";
collisionBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
collisionBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
gui.addControl(collisionBtn);

const isLocalPath = false;
const modelNode = new TransformNode();

const loadingDiv = document.createElement("div");
loadingDiv.setAttribute("id", "loading");
loadingDiv.innerHTML = "3D models are loading...";
document.body.appendChild(loadingDiv);

var allChildMeshes = [];

SceneLoader.ImportMeshAsync(
  "",
  isLocalPath
    ? "/models/baked-lights/"
    : "https://gateway.pinata.cloud/ipfs/QmZhmR5yYZr2CYX3vudAng6MTgLMdukGghmbh3v1X4h6JR/",
  "baked-lights.glb"
).then((result) => {
  result.transformNodes.forEach((node) => {
    if (
      node.getChildMeshes().length === node.getChildren().length &&
      node.getChildren().length > 0
    ) {
      const childMeshes = node.getChildMeshes();

      allChildMeshes.push(...childMeshes);

      // Create a parent mesh to encapsulate the child meshes
      var mesh = Mesh.MergeMeshes(
        childMeshes,
        true,
        true,
        undefined,
        false,
        true
      );
      mesh.scaling.x = 10;
      mesh.scaling.y = 10;
      mesh.scaling.z = 10;
      mesh.showBoundingBox = true;

      const boundingBox = mesh.getBoundingInfo().boundingBox;
      const invisibleBox = MeshBuilder.CreateBox("box", {
        height:
          (boundingBox.maximumWorld.y - boundingBox.minimumWorld.y) * 10,
        width: (boundingBox.maximumWorld.x - boundingBox.minimumWorld.x) * 10,
        depth: (boundingBox.maximumWorld.z - boundingBox.minimumWorld.z) * 10,
      });
      invisibleBox.position = boundingBox.centerWorld;
      invisibleBox.isVisible = false;
      invisibleBox.checkCollisions = true;
    }
  });

  result.meshes.forEach((mesh) => {
    if (!mesh.parent) {
      mesh.parent = modelNode;
    }
    mesh.showBoundingBox = true;

    if (!allChildMeshes.includes(mesh)) {
      const boundingBox = mesh.getBoundingInfo().boundingBox;
      const invisibleBox = MeshBuilder.CreateBox("box", {
        height:
          (boundingBox.maximumWorld.y - boundingBox.minimumWorld.y) * 10,
        width: (boundingBox.maximumWorld.x - boundingBox.minimumWorld.x) * 10,
        depth: (boundingBox.maximumWorld.z - boundingBox.minimumWorld.z) * 10,
      });
      invisibleBox.position = boundingBox.centerWorld;
      invisibleBox.isVisible = false;
      invisibleBox.checkCollisions = true;
    }
  });

  modelNode.scaling.x = 10;
  modelNode.scaling.y = 10;
  modelNode.scaling.z = 10;

  loadingDiv.style.display = "none";
});

startRenderLoop();
