export const enableWebXR = async (scene, ground) => {
  var xrHelper = await scene.createDefaultXRExperienceAsync({
    floorMeshes: [ground],
  });

  const featuresManager = xrHelper.baseExperience.featuresManager;
  const teleportation = featuresManager.enableFeature(
    BABYLON.WebXRFeatureName.TELEPORTATION,
    "stable" /* or latest */,
    {
      xrInput: xrHelper.input,
      floorMeshes: [ground],
    }
  );

  teleportation.parabolicRayEnabled = false;

  let xrCamera = scene.getCameraByName("webxr");
  xrCamera.setTransformationFromNonVRCamera(camera);
  xrHelper.baseExperience.onStateChangedObservable.add((state) => {
    if (state === BABYLON.WebXRState.IN_XR) {
      xrCamera.position.y = 4;
    }
  });

  xrCamera.onAfterCameraTeleport.add((targetPosition) => {
    xrCamera.position.y = 4;
  });
};
