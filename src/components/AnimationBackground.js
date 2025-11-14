import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const AnimationBackground = ({ color = '#64ffda', density = 50, speed = 0.5 }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Current ref value stored in variable for cleanup
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
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentRef.appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = density * 100;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Materials
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.8
    });
    
    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate particles
      particlesMesh.rotation.y += 0.001 * speed;
      particlesMesh.rotation.x += 0.0005 * speed;
      
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
    
    // Mouse movement effect
    const handleMouseMove = (event) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      particlesMesh.rotation.y = mouseX * 0.1;
      particlesMesh.rotation.x = mouseY * 0.1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      currentRef.removeChild(renderer.domElement);
    };
  }, [color, density, speed]); // Dependencies for the effect
  
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

export default AnimationBackground;