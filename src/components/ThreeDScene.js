import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeDScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Current ref value stored in variable for cleanup
    const currentRef = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f0f8ff');
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      currentRef.clientWidth / currentRef.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
    currentRef.appendChild(renderer.domElement);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Create 3D objects representing complaint data
    const createComplaintObjects = () => {
      // Create a group to hold all complaint objects
      const complaintsGroup = new THREE.Group();
      
      // Sample data - in real app, this would come from your API
      const sampleData = [
        { id: 1, urgency: 'high', category: 'infrastructure', status: 'pending' },
        { id: 2, urgency: 'medium', category: 'water', status: 'resolved' },
        { id: 3, urgency: 'low', category: 'electricity', status: 'in-progress' },
        { id: 4, urgency: 'high', category: 'sanitation', status: 'pending' },
        { id: 5, urgency: 'medium', category: 'roads', status: 'in-progress' },
      ];
      
      // Color mapping for different categories
      const categoryColors = {
        'infrastructure': 0xff0000, // red
        'water': 0x0000ff, // blue
        'electricity': 0xffff00, // yellow
        'sanitation': 0x00ff00, // green
        'roads': 0xff00ff, // purple
      };
      
      // Create objects based on data
      sampleData.forEach((complaint, index) => {
        // Create geometry based on urgency
        let geometry;
        switch(complaint.urgency) {
          case 'high':
            geometry = new THREE.SphereGeometry(0.5, 32, 32);
            break;
          case 'medium':
            geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
            break;
          case 'low':
            geometry = new THREE.ConeGeometry(0.5, 1, 32);
            break;
          default:
            geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        }
        
        // Create material based on category
        const color = categoryColors[complaint.category] || 0xcccccc;
        const material = new THREE.MeshStandardMaterial({ 
          color: color,
          opacity: complaint.status === 'resolved' ? 0.5 : 1,
          transparent: complaint.status === 'resolved',
        });
        
        // Create mesh and position it
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (index - 2) * 1.5;
        mesh.position.y = complaint.status === 'resolved' ? -1 : complaint.status === 'in-progress' ? 0 : 1;
        
        // Add to group
        complaintsGroup.add(mesh);
        
        // Add hover effect
        mesh.userData = { complaintId: complaint.id };
      });
      
      return complaintsGroup;
    };
    
    // Add complaint objects to scene
    const complaintsGroup = createComplaintObjects();
    scene.add(complaintsGroup);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate the entire complaints group slowly
      complaintsGroup.rotation.y += 0.005;
      
      // Update controls
      controls.update();
      
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
      currentRef.removeChild(renderer.domElement);
    };
  }, []); // Empty dependency array ensures this runs once on mount
  
  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '400px',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}
    />
  );
};

export default ThreeDScene;