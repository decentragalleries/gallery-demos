var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
  const fpsDiv = document.getElementById("fps");
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
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
