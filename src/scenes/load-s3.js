import { scene, canvas, engine, startRenderLoop } from "../engine";
import {
  Vector3,
  Mesh,
  PhysicsAggregate,
  PhysicsShapeType,
  HemisphericLight,
  TransformNode,
  SceneLoader,
  MeshBuilder,
  Sound
} from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control } from "@babylonjs/gui";
import {downloadModel,getGLBNamesFromYAML,getMusic, addFreeCamera, enablePhysics, addGround} from 'babylonjs-samples'

enablePhysics(scene);

// Camera
const camera = addFreeCamera("FreeCamera", new Vector3(0, 14, 0), scene);
camera.attachControl(canvas, true);

const audioData = await getMusic(scene,"violon.mp3");

// const music = new Sound(
//     "Violons",
//     audioData,
//     scene,
//     function () {
//       music.play();
//     },
//     {
//       spatialSound: true,
//       distanceModel: "exponential",
//       rolloffFactor: 1,
//       loop: true,
//       autoplay: true,
//     }
//    );


// Lighting
const light = new HemisphericLight("light", new Vector3(1, 1, 0));

// Ground
const ground = addGround("ground", 10000.0, scene);
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

const isLocalPath = true;
const modelNode = new TransformNode();

const loadingDiv = document.createElement("div");
loadingDiv.setAttribute("id", "loading");
loadingDiv.innerHTML = "3D models are loading...";
document.body.appendChild(loadingDiv);

var allChildMeshes = [];

const names = await getGLBNamesFromYAML("classic gallery")
console.log(names);

for (const name of names) {

    var glbDataUrl = await downloadModel(name);

    SceneLoader.ImportMeshAsync(
    "", 
    "", 
    glbDataUrl, 
    scene
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
}
startRenderLoop();
