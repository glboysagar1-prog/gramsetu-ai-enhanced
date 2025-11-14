import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeDLanding = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Current ref value stored in variable for cleanup
    const currentRef = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a192f');
    
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
    
    // Create particles for background
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Materials
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x64ffda,
      transparent: true,
      opacity: 0.8
    });
    
    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Create India map outline
    const createIndiaOutline = () => {
      // Simplified India outline vertices
      const indiaShape = new THREE.Shape();
      
      // Starting point (simplified coordinates)
      indiaShape.moveTo(0, 0);
      indiaShape.lineTo(1, 0.2);
      indiaShape.lineTo(1.5, -0.5);
      indiaShape.lineTo(2, -0.3);
      indiaShape.lineTo(2.2, 0.5);
      indiaShape.lineTo(1.8, 1);
      indiaShape.lineTo(1, 1.2);
      indiaShape.lineTo(0.5, 0.8);
      indiaShape.lineTo(0, 0);
      
      const geometry = new THREE.ShapeGeometry(indiaShape);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0x64ffda,
        side: THREE.DoubleSide,
        wireframe: true
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(2, 2, 2);
      mesh.position.set(-2, 0, 0);
      
      return mesh;
    };
    
    const indiaOutline = createIndiaOutline();
    scene.add(indiaOutline);
    
    // Create floating text
    const createTextMesh = (text, position, size = 0.2, color = 0xffffff) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 128;
      
      context.fillStyle = 'transparent';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.font = '64px Arial';
      context.fillStyle = '#64ffda';
      context.textAlign = 'center';
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
      });
      
      const geometry = new THREE.PlaneGeometry(size * 10, size * 2.5);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(position.x, position.y, position.z);
      
      return mesh;
    };
    
    // Add title text
    const titleMesh = createTextMesh('GramSetu AI', { x: 0, y: 1.5, z: 0 }, 0.3);
    scene.add(titleMesh);
    
    // Add subtitle text
    const subtitleMesh = createTextMesh('National Governance Intelligence Network', { x: 0, y: 1, z: 0 }, 0.15);
    scene.add(subtitleMesh);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate particles
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;
      
      // Rotate India outline
      indiaOutline.rotation.z += 0.001;
      
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
  }, []); // Empty dependency array ensures this runs once on mount
  
  return (
    <div className="landing-container">
      <div 
        ref={mountRef} 
        className="three-scene"
      />
      <div className="content-overlay">
        <div className="cta-button">
          <button>Explore Dashboard</button>
        </div>
      </div>
      <style jsx="true">{`
        .landing-container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
        
        .three-scene {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .content-overlay {
          position: absolute;
          bottom: 100px;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          z-index: 10;
        }
        
        .cta-button button {
          background: transparent;
          color: #64ffda;
          border: 2px solid #64ffda;
          padding: 12px 24px;
          font-size: 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .cta-button button:hover {
          background: rgba(100, 255, 218, 0.1);
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ThreeDLanding;