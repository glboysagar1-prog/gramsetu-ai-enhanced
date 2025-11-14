import React from 'react';

const DistrictHeatmap = ({ data }) => {
  const getColor = (performance) => {
    if (performance >= 80) return '#51cf66'; // Green
    if (performance >= 60) return '#fcc419'; // Yellow
    return '#ff6b6b'; // Red
  };

  return (
    <div className="district-heatmap">
      <div className="heatmap-grid">
        {data.map((district, index) => (
          <div key={index} className="district-cell">
            <div 
              className="district-color" 
              style={{ backgroundColor: getColor(district.performance) }}
            ></div>
            <div className="district-info">
              <span className="district-name">{district.district}</span>
              <span className="district-performance">{district.performance}%</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="heatmap-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#51cf66' }}></div>
          <span>80-100% (Excellent)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#fcc419' }}></div>
          <span>60-79% (Good)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ff6b6b' }}></div>
          <span>0-59% (Needs Improvement)</span>
        </div>
      </div>
    </div>
  );
};

export default DistrictHeatmap;
