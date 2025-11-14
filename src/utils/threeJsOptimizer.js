/**
 * Utility functions for optimizing Three.js performance
 */

// Detect device capabilities for adaptive rendering
export const detectDeviceCapabilities = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const pixelRatio = window.devicePixelRatio || 1;
  
  return {
    isMobile,
    pixelRatio,
    isLowPowerDevice: isMobile && pixelRatio < 2,
    isHighEndDevice: !isMobile && pixelRatio >= 2
  };
};

// Configure renderer based on device capabilities
export const configureRenderer = (renderer, capabilities) => {
  if (!renderer) return;
  
  // Set pixel ratio based on device capabilities
  if (capabilities.isLowPowerDevice) {
    renderer.setPixelRatio(Math.min(1.0, window.devicePixelRatio));
  } else if (capabilities.isHighEndDevice) {
    renderer.setPixelRatio(window.devicePixelRatio);
  } else {
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
  }
  
  // Enable optimizations
  renderer.powerPreference = "high-performance";
  
  // Configure shadow maps if used
  renderer.shadowMap.enabled = !capabilities.isLowPowerDevice;
  renderer.shadowMap.type = capabilities.isHighEndDevice ? 
    THREE.PCFSoftShadowMap : THREE.BasicShadowMap;
    
  return renderer;
};

// Dispose of Three.js objects properly to prevent memory leaks
export const disposeThreeJsObjects = (scene) => {
  if (!scene) return;
  
  scene.traverse((object) => {
    if (object.geometry) {
      object.geometry.dispose();
    }
    
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach(material => disposeMaterial(material));
      } else {
        disposeMaterial(object.material);
      }
    }
  });
};

// Helper function to dispose material and its textures
const disposeMaterial = (material) => {
  if (!material) return;
  
  // Dispose textures
  Object.keys(material).forEach(prop => {
    if (!material[prop]) return;
    if (material[prop].isTexture) {
      material[prop].dispose();
    }
  });
  
  // Dispose material
  material.dispose();
};

// Implement level of detail (LOD) for complex objects
export const createLODObject = (highDetailGeometry, mediumDetailGeometry, lowDetailGeometry, material, capabilities) => {
  if (!THREE.LOD) {
    // Fallback if LOD is not available
    return new THREE.Mesh(
      capabilities.isLowPowerDevice ? lowDetailGeometry : 
      capabilities.isHighEndDevice ? highDetailGeometry : 
      mediumDetailGeometry,
      material
    );
  }
  
  const lod = new THREE.LOD();
  
  // Add detail levels
  lod.addLevel(new THREE.Mesh(highDetailGeometry, material), 0);
  lod.addLevel(new THREE.Mesh(mediumDetailGeometry, material), 10);
  lod.addLevel(new THREE.Mesh(lowDetailGeometry, material), 20);
  
  return lod;
};

// Throttle animation frame for lower-end devices
export const createThrottledAnimationLoop = (animateFunction, capabilities) => {
  let frameSkip = 0;
  const maxFrameSkip = capabilities.isLowPowerDevice ? 3 : 
                       capabilities.isHighEndDevice ? 0 : 1;
  
  return () => {
    if (frameSkip < maxFrameSkip) {
      frameSkip++;
      requestAnimationFrame(animateFunction);
      return;
    }
    
    frameSkip = 0;
    animateFunction();
    requestAnimationFrame(animateFunction);
  };
};

// Implement frustum culling for large scenes
export const setupFrustumCulling = (camera, scene, renderer) => {
  const frustum = new THREE.Frustum();
  const cameraViewProjectionMatrix = new THREE.Matrix4();
  
  return () => {
    camera.updateMatrixWorld();
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    
    cameraViewProjectionMatrix.multiplyMatrices(
      camera.projectionMatrix, 
      camera.matrixWorldInverse
    );
    
    frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);
    
    scene.traverse(object => {
      if (object.isMesh && object.frustumCulled) {
        object.visible = frustum.intersectsObject(object);
      }
    });
  };
};