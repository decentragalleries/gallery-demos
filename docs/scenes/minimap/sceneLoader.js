import { createScene } from "./scene.js";

var canvas = document.getElementById("renderCanvas");

const mapCanvas = document.getElementById("mapCanvas");
const mapContext = mapCanvas.getContext("2d");
mapCanvas.width = 200;  // Adjust the width and height as needed
mapCanvas.height = 200;
mapCanvas.style.position = "absolute";  // Position it relative to the parent container
mapCanvas.style.top = "10px";
mapCanvas.style.left = "10px";
mapCanvas.style.border = "1px solid #000";  // Optional border for visual clarity

function updateUserPosition(x, y) {
  // Clear the previous user position
  mapContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height);

  // Calculate the position on the map based on the user's coordinates
  const mapX = x;
  const mapY =y;

  // Draw the user position on the map
  mapContext.fillStyle = "red";  // Customize the color and style as desired
  mapContext.fillRect(mapX, mapY, 10, 10);  // Adjust the size and shape of the user position marker
}


var startRenderLoop = function (engine, canvas) {
  const fpsDiv = document.getElementById("fps");
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
      updateUserPosition(sceneToRender.activeCamera.position.z,sceneToRender.activeCamera.position.x);
    }
    fps.innerHTML = engine.getFps().toFixed() + " fps";
  });
};

var engine;
var scene;
var sceneToRender;
var createDefaultEngine = function () {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });
};

window.initFunction = async function () {
  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log(
        "the available createEngine function failed. Creating the default engine instead"
      );
      return createDefaultEngine();
    }
  };
  engine = await asyncEngineCreation();
  window.engine = engine;
  if (!engine) throw "engine should not be null.";
  startRenderLoop(engine, canvas);
  scene = await createScene(engine, canvas);
  window.scene = scene;
};

initFunction().then(() => {
  sceneToRender = scene;
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});
