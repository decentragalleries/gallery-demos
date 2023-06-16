const isLocalPath = false;
const count = 5;

const loading = Array.from(Array(count), (el) => true);
const UI_HEIGHT_PERC = 0.3;
var index = 0;
var stackPanel = null;
var camera = null;

const importDemoModel = (
  btnName,
  localPath,
  remotePath,
  fileName,
  position,
  cameraPos,
  cameraMaxZ,
  isTeleportable = false
) => {
  const localIndex = index;
  index++;

  const modelNode = new BABYLON.TransformNode();

  BABYLON.SceneLoader.ImportMeshAsync(
    "",
    isLocalPath ? `models/${localPath}` : remotePath,
    fileName
  ).then((result) => {
    result.meshes.forEach((mesh) => {
      if (mesh.id !== "G-__563250" && mesh.id !== "G-__555888") {
        mesh.checkCollisions = true;
      }
      if (!mesh.parent) {
        mesh.parent = modelNode;
      }
    });

    modelNode.scaling.x = 10;
    modelNode.scaling.y = 10;
    modelNode.scaling.z = 10;
    modelNode.position = new BABYLON.Vector3(
      position[0],
      position[1],
      position[2]
    );

    if (isTeleportable) {
      loading[localIndex] = false;
      if (loading.indexOf(true) === -1)
        document.getElementById("loading").style.display = "none";
    }
  });

  if (isTeleportable && stackPanel) {
    const roomBtn = BABYLON.GUI.Button.CreateSimpleButton(
      `roomBtn${localIndex + 1}`,
      btnName
    );
    roomBtn.color = "white";
    roomBtn.background = "rgba(0, 100, 170)";
    roomBtn.onPointerUpObservable.add(() => {
      camera.position = new BABYLON.Vector3(
        cameraPos[0],
        cameraPos[1],
        cameraPos[2]
      );
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
  const gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  const stackPanel = new BABYLON.GUI.StackPanel();
  stackPanel.height = UI_HEIGHT_PERC;
  stackPanel.width = 0.15;
  stackPanel.paddingRight = "10px";
  stackPanel.horizontalAlignment =
    BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  stackPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  gui.addControl(stackPanel);

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
  collisionBtn.height = `${
    (1 / (count + 1) - 0.02) * UI_HEIGHT_PERC * window.innerHeight
  }px`;
  collisionBtn.paddingTop = `${0.03 * UI_HEIGHT_PERC * window.innerHeight}px`;
  stackPanel.addControl(collisionBtn);

  return stackPanel;
};

export const importDemoModels = (scene, localCamera) => {
  camera = localCamera;
  camera.speed = 1.5;
  camera.maxZ = 150;
  camera.position = new BABYLON.Vector3(-26, 14, -15);
  stackPanel = setupStackPanel();

  // Log camera position
  // var oldCameraX = camera.position.x;
  // scene.registerBeforeRender(() => {
  //   if (camera.position.x !== oldCameraX) {
  //     console.log(camera.position)
  //     oldCameraX = camera.position.x;
  //   }
  // });

  importDemoModel(
    "Room 1",
    "old/",
    "https://gateway.pinata.cloud/ipfs/QmYoc9GbRfgSupiinQvFVZ895qaMQveowfEYGsrfGDRbBh/",
    "room test 1.glb",
    [0, 0, 0],
    [-26, 14, -15],
    150,
    true
  );
  importDemoModel(
    "Room 2",
    "old/",
    "https://gateway.pinata.cloud/ipfs/QmYoc9GbRfgSupiinQvFVZ895qaMQveowfEYGsrfGDRbBh/",
    "room test 2.glb",
    [1000, 0, 0],
    [617, 14, -42.4],
    150,
    true
  );
  importDemoModel(
    "Test Gallery",
    "old/",
    "https://gateway.pinata.cloud/ipfs/QmYoc9GbRfgSupiinQvFVZ895qaMQveowfEYGsrfGDRbBh/",
    "old_gallery.glb",
    [2000, 0, 0],
    [1417, 14, -59],
    500,
    true
  );
  importDemoModel(
    "Classic",
    "classic gallery/",
    "https://gateway.pinata.cloud/ipfs/QmeT2RxNSmpJiS1wS7Y35fnBiFbf1uCoDppQr8kLsuGQ7J/",
    "classic gallery small base model.glb",
    [3000, 13, 0],
    [2876, 31, -49],
    500,
    true
  );

  importDemoModel(
    "Classic",
    "classic gallery/",
    "https://gateway.pinata.cloud/ipfs/QmeT2RxNSmpJiS1wS7Y35fnBiFbf1uCoDppQr8kLsuGQ7J/",
    "classic gallery small door 2 part 1.glb",
    [3000, 13, 0],
    [2870, 31, -34],
    500
  );

  importDemoModel(
    "Classic",
    "classic gallery/",
    "https://gateway.pinata.cloud/ipfs/QmeT2RxNSmpJiS1wS7Y35fnBiFbf1uCoDppQr8kLsuGQ7J/",
    "classic gallery small door 2 part 2.glb",
    [3000, 13, 0],
    [2870, 31, -34],
    500
  );

  importDemoModel(
    "Classic",
    "classic gallery/",
    "https://gateway.pinata.cloud/ipfs/QmeT2RxNSmpJiS1wS7Y35fnBiFbf1uCoDppQr8kLsuGQ7J/",
    "classic gallery small door 1 part 1.glb",
    [3000, 13, 0],
    [2870, 31, -34],
    500
  );

  importDemoModel(
    "Classic",
    "classic gallery/",
    "https://gateway.pinata.cloud/ipfs/QmeT2RxNSmpJiS1wS7Y35fnBiFbf1uCoDppQr8kLsuGQ7J/",
    "classic gallery small door 1 part 2.glb",
    [3000, 13, 0],
    [2870, 31, -34],
    500
  );

  importDemoModel(
    "Classic",
    "classic gallery/",
    "https://gateway.pinata.cloud/ipfs/QmeT2RxNSmpJiS1wS7Y35fnBiFbf1uCoDppQr8kLsuGQ7J/",
    "classic gallery small frame type 1.glb",
    [3000, 13, 0],
    [2824, 31, -185],
    500
  );

  importDemoModel(
    "Classic",
    "classic gallery/",
    "https://gateway.pinata.cloud/ipfs/QmeT2RxNSmpJiS1wS7Y35fnBiFbf1uCoDppQr8kLsuGQ7J/",
    "classic gallery small frame type 2.glb",
    [2970, 13, 0],
    [2824, 31, -185],
    500
  );
  importDemoModel(
    "Gothic",
    "gothic gallery/",
    "https://gateway.pinata.cloud/ipfs/QmYa8j4UHUBin4uPrvEkG934ZuCKXsoiPTiSJ2ExH1LFr1/",
    "gothic gallery small.glb",
    [4000, 0, 0],
    [3920, 14, -102],
    500,
    true
  );
};
