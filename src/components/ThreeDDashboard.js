import React from 'react';
import ThreeDScene from './ThreeDScene';

const ThreeDDashboard = () => {
  return (
    <div className="three-d-dashboard">
      <h2 className="dashboard-title">GramSetu AI - 3D Visualization</h2>
      <div className="dashboard-description">
        <p>Interactive 3D visualization of citizen complaints across regions</p>
      </div>
      <div className="visualization-container">
        <ThreeDScene />
      </div>
      <div className="legend">
        <h3>Legend</h3>
        <div className="legend-item">
          <div className="color-box" style={{ backgroundColor: 'red' }}></div>
          <span>Infrastructure</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{ backgroundColor: 'blue' }}></div>
          <span>Water</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{ backgroundColor: 'yellow' }}></div>
          <span>Electricity</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{ backgroundColor: 'green' }}></div>
          <span>Sanitation</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{ backgroundColor: 'purple' }}></div>
          <span>Roads</span>
        </div>
      </div>
      <style jsx>{`
        .three-d-dashboard {
          padding: 20px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }
        
        .dashboard-title {
          font-size: 24px;
          color: #333;
          margin-bottom: 10px;
          font-weight: 600;
        }
        
        .dashboard-description {
          color: #666;
          margin-bottom: 20px;
        }
        
        .visualization-container {
          margin-bottom: 20px;
        }
        
        .legend {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 15px;
          background-color: rgba(255, 255, 255, 0.7);
          border-radius: 10px;
        }
        
        .legend h3 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 18px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .color-box {
          width: 20px;
          height: 20px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default ThreeDDashboard;