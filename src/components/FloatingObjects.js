import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const FloatingObjects = ({ objectCount = 15 }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentRef = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      currentRef.clientWidth / currentRef.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 15;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentRef.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Create floating objects
    const objects = [];
    const colors = [0x64ffda, 0x0a192f, 0xff6b6b, 0x7b68ee, 0xffd700];
    const geometries = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.TetrahedronGeometry(1),
      new THREE.OctahedronGeometry(1),
      new THREE.TorusGeometry(0.7, 0.3, 16, 32)
    ];
    
    for (let i = 0; i < objectCount; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshStandardMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        roughness: 0.7,
        metalness: 0.3
      });
      
      const object = new THREE.Mesh(geometry, material);
      
      // Random position
      object.position.x = (Math.random() - 0.5) * 20;
      object.position.y = (Math.random() - 0.5) * 20;
      object.position.z = (Math.random() - 0.5) * 10;
      
      // Random scale
      const scale = Math.random() * 0.8 + 0.2;
      object.scale.set(scale, scale, scale);
      
      // Random rotation
      object.rotation.x = Math.random() * Math.PI;
      object.rotation.y = Math.random() * Math.PI;
      
      // Custom properties for animation
      object.userData.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
      };
      
      object.userData.floatSpeed = Math.random() * 0.01 + 0.005;
      object.userData.floatDistance = Math.random() * 0.5 + 0.5;
      object.userData.initialY = object.position.y;
      object.userData.floatOffset = Math.random() * Math.PI * 2;
      
      scene.add(object);
      objects.push(object);
    }
    
    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      // Animate each object
      objects.forEach(object => {
        // Rotation
        object.rotation.x += object.userData.rotationSpeed.x;
        object.rotation.y += object.userData.rotationSpeed.y;
        object.rotation.z += object.userData.rotationSpeed.z;
        
        // Floating motion
        object.position.y = object.userData.initialY + 
          Math.sin(time + object.userData.floatOffset) * 
          object.userData.floatDistance;
      });
      
      // Render scene
      renderer.render(scene, camera);
    };
    
    // Start animation
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Dispose geometries and materials
      objects.forEach(object => {
        object.geometry.dispose();
        object.material.dispose();
        scene.remove(object);
      });
      
      // Clear the scene (Three.js scenes don't have a dispose method)
      while(scene.children.length > 0) { 
        scene.remove(scene.children[0]); 
      }
      
      renderer.dispose();
      currentRef.removeChild(renderer.domElement);
    };
  }, [objectCount]);
  
  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}
    />
  );
};

export default FloatingObjects;