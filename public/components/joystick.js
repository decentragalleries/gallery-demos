export const enableJoystickController = (scene, camera) => {
  if (deviceType() === "Mobile") {
    var ui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const CONTAINER_DIM = 0.25 * window.innerWidth;
    const CONTAINER_OFFSET = 0.015 * window.innerWidth;
    const JOYSTICK_DIM = 0.1 * window.innerWidth;
    const JOYSTICK_OFFSETX =
      CONTAINER_OFFSET + CONTAINER_DIM / 2 - JOYSTICK_DIM / 2;
    const JOYSTICK_OFFSETY = -(
      CONTAINER_OFFSET +
      CONTAINER_DIM / 2 -
      JOYSTICK_DIM / 2
    );
    var [joystickX, joystickY] = [0, 0];

    var joystick = new BABYLON.GUI.Ellipse();
    joystick.widthInPixels = JOYSTICK_DIM;
    joystick.heightInPixels = JOYSTICK_DIM;
    joystick.cornerRadius = 0.075 * window.innerWidth;
    joystick.background = "rgba(150,150,150,0.5)";
    joystick.color = "transparent";
    joystick.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    joystick.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    joystick.leftInPixels = JOYSTICK_OFFSETX;
    joystick.topInPixels = JOYSTICK_OFFSETY;
    const getJoystickPos = (coordinates) => {
      joystickContainer.color = "rgba(255,255,255,0.5)";
      joystick.background = "rgba(0,150,0,0.5)";

      [joystickX, joystickY] = [
        coordinates.x / CONTAINER_DIM - 0.5,
        (window.innerHeight - coordinates.y) / CONTAINER_DIM - 0.5,
      ];
      joystick.leftInPixels = JOYSTICK_OFFSETX + joystickX * CONTAINER_DIM;
      joystick.topInPixels = JOYSTICK_OFFSETY - joystickY * CONTAINER_DIM;
    };

    var joystickContainer = new BABYLON.GUI.Ellipse();
    joystickContainer.widthInPixels = CONTAINER_DIM;
    joystickContainer.heightInPixels = CONTAINER_DIM;
    joystickContainer.leftInPixels = CONTAINER_OFFSET;
    joystickContainer.topInPixels = -CONTAINER_OFFSET;
    joystickContainer.cornerRadius = 0.105 * window.innerWidth;
    joystickContainer.color = "transparent";
    joystickContainer.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    joystickContainer.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    joystickContainer.onPointerDownObservable.add(getJoystickPos);
    joystickContainer.onPointerMoveObservable.add(getJoystickPos);
    joystickContainer.onPointerUpObservable.add(() => {
      [joystickX, joystickY] = [0, 0];
      joystick.leftInPixels = JOYSTICK_OFFSETX;
      joystick.topInPixels = JOYSTICK_OFFSETY;
      joystickContainer.color = "transparent";
      joystick.background = "rgba(150,150,150,0.5)";
    });
    joystickContainer.isPointerBlocker = true;
    joystickContainer.opacity = 0;

    ui.addControl(joystick);
    ui.addControl(joystickContainer);

    scene.onBeforeRenderObservable.add(() => {
      const translateTransform = BABYLON.Vector3.TransformCoordinates(
        new BABYLON.Vector3(joystickX * 0.1, 0, joystickY * 0.1),
        BABYLON.Matrix.RotationY(camera.rotation.y)
      );
      camera.cameraDirection.addInPlace(translateTransform);
    });
  }
};

export const deviceType = () => {
  if (navigator.userAgent.indexOf("OculusBrowser") !== -1) {
    return "OculusBrowser";
  } else if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    return "Mobile";
  } else {
    return "Desktop";
  }
};
