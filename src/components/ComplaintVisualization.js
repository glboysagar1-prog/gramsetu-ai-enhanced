import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ComplaintVisualization = ({ complaints = [] }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f5f5f5');
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 15;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Create 3D map of India (simplified)
    const createIndiaMap = () => {
      const group = new THREE.Group();
      
      // Create base map
      const geometry = new THREE.PlaneGeometry(20, 15);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0xeeeeee,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const map = new THREE.Mesh(geometry, material);
      map.rotation.x = Math.PI / 2;
      group.add(map);
      
      // Add state boundaries (simplified)
      const stateLines = new THREE.Group();
      
      // Add a few state boundaries as examples
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x999999 });
      
      // North India line
      const northPoints = [];
      northPoints.push(new THREE.Vector3(-8, 0, 5));
      northPoints.push(new THREE.Vector3(8, 0, 5));
      const northGeometry = new THREE.BufferGeometry().setFromPoints(northPoints);
      const northLine = new THREE.Line(northGeometry, lineMaterial);
      stateLines.add(northLine);
      
      // Central India line
      const centralPoints = [];
      centralPoints.push(new THREE.Vector3(-8, 0, 0));
      centralPoints.push(new THREE.Vector3(8, 0, 0));
      const centralGeometry = new THREE.BufferGeometry().setFromPoints(centralPoints);
      const centralLine = new THREE.Line(centralGeometry, lineMaterial);
      stateLines.add(centralLine);
      
      // South India line
      const southPoints = [];
      southPoints.push(new THREE.Vector3(-8, 0, -5));
      southPoints.push(new THREE.Vector3(8, 0, -5));
      const southGeometry = new THREE.BufferGeometry().setFromPoints(southPoints);
      const southLine = new THREE.Line(southGeometry, lineMaterial);
      stateLines.add(southLine);
      
      // Vertical lines
      for (let i = -8; i <= 8; i += 4) {
        const vertPoints = [];
        vertPoints.push(new THREE.Vector3(i, 0, 7));
        vertPoints.push(new THREE.Vector3(i, 0, -7));
        const vertGeometry = new THREE.BufferGeometry().setFromPoints(vertPoints);
        const vertLine = new THREE.Line(vertGeometry, lineMaterial);
        stateLines.add(vertLine);
      }
      
      group.add(stateLines);
      return group;
    };
    
    const indiaMap = createIndiaMap();
    scene.add(indiaMap);
    
    // Create complaint markers
    const createComplaintMarkers = () => {
      const group = new THREE.Group();
      
      // Use actual complaints data or sample data if empty
      const complaintData = complaints.length > 0 ? complaints : [
        { id: 1, category: 'infrastructure', status: 'pending', location: 'North', urgency: 'high' },
        { id: 2, category: 'water', status: 'in-progress', location: 'South', urgency: 'medium' },
        { id: 3, category: 'electricity', status: 'resolved', location: 'East', urgency: 'low' },
        { id: 4, category: 'sanitation', status: 'pending', location: 'West', urgency: 'high' },
        { id: 5, category: 'roads', status: 'in-progress', location: 'Central', urgency: 'medium' }
      ];
      
      // Color mapping for different categories
      const categoryColors = {
        'infrastructure': 0xff0000, // red
        'water': 0x0000ff, // blue
        'electricity': 0xffff00, // yellow
        'sanitation': 0x00ff00, // green
        'roads': 0xff00ff, // purple
        'default': 0xcccccc // gray
      };
      
      // Location mapping (simplified)
      const locationMap = {
        'North': { x: 0, z: 5 },
        'South': { x: 0, z: -5 },
        'East': { x: 5, z: 0 },
        'West': { x: -5, z: 0 },
        'Central': { x: 0, z: 0 },
        'default': { x: 0, z: 0 }
      };
      
      // Create markers for each complaint
      complaintData.forEach((complaint, index) => {
        // Determine geometry based on urgency
        let geometry;
        let size = 0.5;
        
        switch(complaint.urgency) {
          case 'high':
            geometry = new THREE.ConeGeometry(size, size * 2, 16);
            break;
          case 'medium':
            geometry = new THREE.SphereGeometry(size, 16, 16);
            break;
          case 'low':
            geometry = new THREE.BoxGeometry(size, size, size);
            break;
          default:
            geometry = new THREE.SphereGeometry(size, 16, 16);
        }
        
        // Determine color based on category
        const color = categoryColors[complaint.category] || categoryColors.default;
        
        // Create material
        const material = new THREE.MeshStandardMaterial({
          color: color,
          opacity: complaint.status === 'resolved' ? 0.5 : 1,
          transparent: complaint.status === 'resolved',
          emissive: color,
          emissiveIntensity: 0.3
        });
        
        // Create mesh
        const marker = new THREE.Mesh(geometry, material);
        
        // Position based on location or random if not specified
        const location = locationMap[complaint.location] || locationMap.default;
        
        // Add some randomness to position
        const randomOffset = 2;
        marker.position.set(
          location.x + (Math.random() - 0.5) * randomOffset,
          1,
          location.z + (Math.random() - 0.5) * randomOffset
        );
        
        // Add to group
        group.add(marker);
        
        // Add hover data
        marker.userData = { complaint };
      });
      
      return group;
    };
    
    const complaintMarkers = createComplaintMarkers();
    scene.add(complaintMarkers);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate markers slightly
      complaintMarkers.children.forEach(marker => {
        marker.rotation.y += 0.01;
      });
      
      // Update controls
      controls.update();
      
      // Render
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose geometries and materials
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, [complaints]);
  
  return (
    <div className="visualization-container">
      <div 
        ref={mountRef} 
        className="visualization-canvas"
      />
      <div className="visualization-info">
        <h3>3D Complaint Visualization</h3>
        <p>Rotate, zoom, and pan to explore complaints across India</p>
        <div className="legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: 'red' }}></span>
            <span>Infrastructure</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: 'blue' }}></span>
            <span>Water</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: 'yellow' }}></span>
            <span>Electricity</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: 'green' }}></span>
            <span>Sanitation</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: 'purple' }}></span>
            <span>Roads</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        .visualization-container {
          display: flex;
          flex-direction: column;
          height: 500px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }
        
        .visualization-canvas {
          flex: 1;
          width: 100%;
        }
        
        .visualization-info {
          padding: 15px;
          background-color: #fff;
        }
        
        .visualization-info h3 {
          margin-top: 0;
          margin-bottom: 5px;
        }
        
        .visualization-info p {
          margin-top: 0;
          margin-bottom: 15px;
          color: #666;
        }
        
        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .legend-color {
          display: inline-block;
          width: 15px;
          height: 15px;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default ComplaintVisualization;