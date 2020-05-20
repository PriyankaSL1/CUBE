const xr = navigator.xr;
function getXR(usePolyfill) {
  let tempXR;
  let tempPoly;

  switch(usePolyfill) {
    case "if-needed":
      if (!navigator.xr) {
        tempPoly = new WebXRPolyfill();
      }
      tempXR = navigator.xr;
      break;
    case "yes":
      tempPoly = new WebXRPolyfill();
      tempXR = navigator.xr;
      break;
    case "no":
    default:
      tempXR = navigator.xr;
      break;
  }

  return tempXR;
}

// const xr = getXR("no");  // Get the native XRSystem object
// const xr = getXR("yes"); // Always returns an XRSystem from the polyfill
// const xr = getXR("if-needed"); // Use the polyfill only if navigator.xr missing

const immersiveOK = await navigator.xr.isSessionSupported("immersive-vr");
if (immersiveOK) {
  // Create and use an immersive VR session
} else {
  // Create an inline session instead, or tell the user about the
  // incompatibility if inline is required
}

xr.requestSession("immersive-vr").then((session) => {
  xrSession = session;
  /* continue to set up the session */
});

async function createImmersiveSession(xr) {
  try {
    session = await xr.requestSession("immersive-vr", {
      requiredFeatures: [ "unbounded" ]
    });
    return session;
  } catch(error) {
    throw error;
  }
}

async function runSession(session) {
  let worldData;

  session.addEventListener("end", onSessionEnd);

  let canvas = document.querySelector("canvas");
  gl = canvas.getContext("webgl", { xrCompatible: true });

  // Set up WebGL data and such

  worldData = loadGLPrograms(session, "worlddata.xml");
  if (!worldData) {
    return NULL;
  }

  // Finish configuring WebGL

  worldData.session.updateRenderState({
    baseLayer: new XRWebGLLayer(worldData.session, gl)
  });

  // Start rendering the scene

  referenceSpace = await worldData.session.requestReferenceSpace("unbounded");
  worldData.referenceSpace = referenceSpace.getOffsetReferenceSpace(
        new XRRigidTransform(worldData.playerSpawnPosition, worldData.playerSpawnOrientation));
  worldData.animationFrameRequestID = worldData.session.requestAnimationFrame(onDrawFrame);

  return worldData;
}

session.onvisibilitychange = (event) => {
  switch(event.session.visibilityState) {
    case "hidden":
      myFrameRate = 10;
      break;
    case "blurred-visible":
      myFrameRate = 30;
      break;
    case "visible":
    default:
      myFrameRate = 60;
      break;
  }
};

async function shutdownXR(session) {
  if (session) {
    await session.end();
    
    /* At this point, WebXR is fully shut down */
  }
}

session.onend = (event) => {
  /* the session has shut down */

  freeResources();
};