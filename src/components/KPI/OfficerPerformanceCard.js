import React from 'react';

const OfficerPerformanceCard = ({ officer }) => {
  // Determine performance color based on metrics
  const getPerformanceColor = (crr, css) => {
    const score = (crr * 0.7) + (css * 20 * 0.3); // Weighted score
    if (score >= 80) return '#51cf66'; // Green
    if (score >= 60) return '#fcc419'; // Yellow
    return '#ff6b6b'; // Red
  };

  return (
    <div className="officer-performance-card">
      <div className="officer-header">
        <h4>{officer.name}</h4>
        <span className="district-tag">{officer.district}</span>
      </div>
      
      <div className="performance-metrics">
        <div className="metric">
          <span className="metric-label">CRR</span>
          <span className="metric-value">{officer.avg_crr}%</span>
        </div>
        
        <div className="metric">
          <span className="metric-label">CSS</span>
          <span className="metric-value">{officer.avg_css}/5</span>
        </div>
        
        <div className="metric">
          <span className="metric-label">Alerts</span>
          <span className="metric-value" style={{ color: officer.fraud_alerts > 0 ? '#ff6b6b' : '#51cf66' }}>
            {officer.fraud_alerts}
          </span>
        </div>
      </div>
      
      <div 
        className="performance-indicator" 
        style={{ backgroundColor: getPerformanceColor(officer.avg_crr, officer.avg_css) }}
      ></div>
    </div>
  );
};

export default OfficerPerformanceCard;
