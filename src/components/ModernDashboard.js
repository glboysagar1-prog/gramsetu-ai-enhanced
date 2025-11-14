import React, { useState } from 'react';
import ThreeDLanding from './ThreeDLanding';
import ComplaintVisualization from './ComplaintVisualization';
import InteractiveControls from './InteractiveControls';

const ModernDashboard = () => {
  const [currentView, setCurrentView] = useState('map');
  const [filters, setFilters] = useState({
    infrastructure: true,
    water: true,
    electricity: true,
    sanitation: true,
    roads: true,
    animationSpeed: 50
  });

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="modern-dashboard">
      <ThreeDLanding />
      
      <div className="dashboard-content">
        <h1>GramSetu AI Dashboard</h1>
        <p>Interactive 3D visualization of citizen complaints across India</p>
        
        <div className="dashboard-grid">
          <div className="controls-column">
            <InteractiveControls 
              onFilterChange={handleFilterChange}
              onViewChange={handleViewChange}
            />
          </div>
          
          <div className="visualization-column">
            <ComplaintVisualization />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .modern-dashboard {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .dashboard-content {
          padding: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .dashboard-content h1 {
          font-size: 32px;
          margin-bottom: 10px;
          color: #333;
        }
        
        .dashboard-content p {
          font-size: 18px;
          color: #666;
          margin-bottom: 30px;
        }
        
        .dashboard-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 20px;
        }
        
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ModernDashboard;