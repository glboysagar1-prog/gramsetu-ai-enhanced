import React from 'react';

const FraudAlertFeed = ({ alerts }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return '#c92a2a';
      case 'HIGH': return '#ff6b6b';
      case 'MEDIUM': return '#fcc419';
      default: return '#339af0';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="fraud-alert-feed">
      {alerts.map(alert => (
        <div key={alert.id} className="alert-item">
          <div className="alert-header">
            <span 
              className="alert-severity" 
              style={{ backgroundColor: getSeverityColor(alert.severity) }}
            >
              {alert.severity}
            </span>
            <span className="alert-time">{formatTime(alert.created_at)}</span>
          </div>
          
          <div className="alert-content">
            <h5>{alert.officer_name} - {alert.district}</h5>
            <p className="alert-description">{alert.description}</p>
            <span className="alert-type">{alert.alert_type}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FraudAlertFeed;
