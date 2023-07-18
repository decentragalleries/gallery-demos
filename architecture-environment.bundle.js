"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkgallery_demos"] = self["webpackChunkgallery_demos"] || []).push([["architecture-environment"],{

/***/ "./src/scenes/architecture-environment.js":
/*!************************************************!*\
  !*** ./src/scenes/architecture-environment.js ***!
  \************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../engine */ \"./src/engine.js\");\n/* harmony import */ var _babylonjs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babylonjs/core */ \"./node_modules/@babylonjs/core/index.js\");\n/* harmony import */ var _babylonjs_gui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babylonjs/gui */ \"./node_modules/@babylonjs/gui/index.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_engine__WEBPACK_IMPORTED_MODULE_0__]);\n_engine__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\r\n\r\n\r\n\r\nvar modelNode = null;\r\n\r\nconst uploadFile = (e) => {\r\n  var file = e.target.files[0];\r\n  if (!file) {\r\n    return;\r\n  }\r\n  const fileReader = new FileReader();\r\n  fileReader.onload = async function (e) {\r\n    if (modelNode) modelNode.dispose();\r\n    modelNode = new _babylonjs_core__WEBPACK_IMPORTED_MODULE_1__.TransformNode(\"Uploaded Model\");\r\n    _babylonjs_core__WEBPACK_IMPORTED_MODULE_1__.SceneLoader.ImportMeshAsync(\"\", \"\", e.target.result).then((result) => {\r\n      result.meshes.forEach((mesh) => {\r\n        mesh.checkCollisions = true;\r\n\r\n        if (!mesh.parent) {\r\n          mesh.parent = modelNode;\r\n        }\r\n      });\r\n\r\n      modelNode.scaling.x = 10;\r\n      modelNode.scaling.y = 10;\r\n      modelNode.scaling.z = 10;\r\n    });\r\n  };\r\n\r\n  fileReader.readAsDataURL(file);\r\n};\r\n\r\n// Enable physics engine for object gravity and collision\r\nvar hk = new _babylonjs_core__WEBPACK_IMPORTED_MODULE_1__.HavokPlugin();\r\nconst physicsGravity = new _babylonjs_core__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 0, 0);\r\n_engine__WEBPACK_IMPORTED_MODULE_0__.scene.enablePhysics(physicsGravity, hk);\r\n\r\n// Enable camera gravity\r\nconst assumedFramesPerSecond = 10;\r\nconst earthGravity = -9.81;\r\n_engine__WEBPACK_IMPORTED_MODULE_0__.scene.gravity = new _babylonjs_core__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, earthGravity / assumedFramesPerSecond, 0);\r\n\r\n// Camera\r\nconst camera = new _babylonjs_core__WEBPACK_IMPORTED_MODULE_1__.FreeCamera(\"FreeCamera\", new _babylonjs_core__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 14, 0), _engine__WEBPACK_IMPORTED_MODULE_0__.scene);\r\ncamera.rotation = new _babylonjs_core__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, Math.PI / 2, 0);\r\ncamera.speed = 1.5;\r\ncamera.ellipsoid = new _babylonjs_core__WEBPACK_IMPORTED_MODULE_1__.Vector3(2, 7, 2);\r\ncamera.applyGravity = true;\r\ncamera.checkCollisions = true;\r\ncamera._needMoveForGravity = true;\r\ncamera.attachControl(_engine__WEBPACK_IMPORTED_MODULE_0__.canvas, true);\r\n\r\n// WASD\r\ncamera.keysUp.push(87);\r\ncamera.keysLeft.push(65);\r\ncamera.keysRight.push(68);\r\ncamera.keysDown.push(83);\r\n\r\n// Lighting\r\nconst light = new _babylonjs_core__WEBPACK_IMPORTED_MODULE_1__.HemisphericLight(\"light\", new _babylonjs_core__WEBPACK_IMPORTED_MODULE_1__.Vector3(1, 1, 0));\r\n\r\n// Ground\r\nconst ground = _babylonjs_core__WEBPACK_IMPORTED_MODULE_1__.Mesh.CreatePlane(\"ground\", 10000.0, _engine__WEBPACK_IMPORTED_MODULE_0__.scene);\r\nground.rotation = new _babylonjs_core__WEBPACK_IMPORTED_MODULE_1__.Vector3(Math.PI / 2, 0, 0);\r\nground.checkCollisions = true;\r\nground.position = new _babylonjs_core__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, -0.02, 0);\r\nconst groundMaterial = new _babylonjs_core__WEBPACK_IMPORTED_MODULE_1__.StandardMaterial(\"groundMaterial\", _engine__WEBPACK_IMPORTED_MODULE_0__.scene);\r\ngroundMaterial.alpha = 1;\r\ngroundMaterial.diffuseColor = new _babylonjs_core__WEBPACK_IMPORTED_MODULE_1__.Color3(0.8, 0.8, 0.8);\r\nground.material = groundMaterial;\r\nnew _babylonjs_core__WEBPACK_IMPORTED_MODULE_1__.PhysicsAggregate(ground, _babylonjs_core__WEBPACK_IMPORTED_MODULE_1__.PhysicsShapeType.BOX, { mass: 0 }, _engine__WEBPACK_IMPORTED_MODULE_0__.scene);\r\n\r\nconst UI_HEIGHT = 200;\r\nvar debuggerOn = false;\r\n\r\nconst fileInput = document.createElement(\"input\");\r\nfileInput.setAttribute(\"type\", \"file\");\r\nfileInput.addEventListener(\"change\", uploadFile, false);\r\n\r\nconst gui = _babylonjs_gui__WEBPACK_IMPORTED_MODULE_2__.AdvancedDynamicTexture.CreateFullscreenUI(\"UI\");\r\n\r\nwindow.addEventListener(\"resize\", () => {\r\n  gui.scaleTo(_engine__WEBPACK_IMPORTED_MODULE_0__.engine.getRenderWidth(), _engine__WEBPACK_IMPORTED_MODULE_0__.engine.getRenderHeight());\r\n});\r\n\r\nconst stackPanel = new _babylonjs_gui__WEBPACK_IMPORTED_MODULE_2__.StackPanel();\r\nstackPanel.heightInPixels = UI_HEIGHT;\r\nstackPanel.widthInPixels = 200;\r\nstackPanel.paddingRight = \"10px\";\r\nstackPanel.horizontalAlignment = _babylonjs_gui__WEBPACK_IMPORTED_MODULE_2__.Control.HORIZONTAL_ALIGNMENT_RIGHT;\r\nstackPanel.verticalAlignment = _babylonjs_gui__WEBPACK_IMPORTED_MODULE_2__.Control.VERTICAL_ALIGNMENT_BOTTOM;\r\ngui.addControl(stackPanel);\r\n\r\nconst uploadBtn = _babylonjs_gui__WEBPACK_IMPORTED_MODULE_2__.Button.CreateSimpleButton(\"uploadBtn\", \"Upload Model\");\r\nuploadBtn.color = \"white\";\r\nuploadBtn.background = \"rgba(0, 100, 170)\";\r\nuploadBtn.onPointerUpObservable.add(() => {\r\n  fileInput.click();\r\n});\r\nuploadBtn.hoverCursor = \"pointer\";\r\nuploadBtn.thickness = 0;\r\nuploadBtn.height = `${0.31 * UI_HEIGHT}px`;\r\nuploadBtn.paddingTop = `${0.03 * UI_HEIGHT}px`;\r\nstackPanel.addControl(uploadBtn);\r\n\r\nconst debugButton = _babylonjs_gui__WEBPACK_IMPORTED_MODULE_2__.Button.CreateSimpleButton(\"debugButton\", \"Show Debugger\");\r\ndebugButton.color = \"white\";\r\ndebugButton.background = \"rgba(0, 100, 170)\";\r\ndebugButton.onPointerUpObservable.add(() => {\r\n  debugButton.textBlock.text = !debuggerOn ? \"Hide Debugger\" : \"Show Debugger\";\r\n  if (debuggerOn) _engine__WEBPACK_IMPORTED_MODULE_0__.scene.debugLayer.hide();\r\n  else _engine__WEBPACK_IMPORTED_MODULE_0__.scene.debugLayer.show();\r\n  debuggerOn = !debuggerOn;\r\n});\r\ndebugButton.hoverCursor = \"pointer\";\r\ndebugButton.thickness = 0;\r\ndebugButton.height = `${0.31 * UI_HEIGHT}px`;\r\ndebugButton.paddingTop = `${0.03 * UI_HEIGHT}px`;\r\nstackPanel.addControl(debugButton);\r\n\r\nconst collisionBtn = _babylonjs_gui__WEBPACK_IMPORTED_MODULE_2__.Button.CreateSimpleButton(\r\n  \"collisionBtn\",\r\n  \"Disable Collision\"\r\n);\r\ncollisionBtn.color = \"white\";\r\ncollisionBtn.background = \"rgba(0, 100, 170)\";\r\ncollisionBtn.onPointerUpObservable.add(() => {\r\n  collisionBtn.textBlock.text = camera.checkCollisions\r\n    ? \"Enable Collision\"\r\n    : \"Disable Collision\";\r\n  camera.checkCollisions = !camera.checkCollisions;\r\n});\r\ncollisionBtn.hoverCursor = \"pointer\";\r\ncollisionBtn.thickness = 0;\r\ncollisionBtn.height = `${0.31 * UI_HEIGHT}px`;\r\ncollisionBtn.paddingTop = `${0.03 * UI_HEIGHT}px`;\r\nstackPanel.addControl(collisionBtn);\r\n\r\n(0,_engine__WEBPACK_IMPORTED_MODULE_0__.startRenderLoop)();\r\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://gallery-demos/./src/scenes/architecture-environment.js?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/scenes/architecture-environment.js"));
/******/ }
]);