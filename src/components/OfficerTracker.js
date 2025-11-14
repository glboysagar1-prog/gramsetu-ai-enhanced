import React from 'react';

const OfficerTracker = ({ complaints, avgResolutionTime }) => {
  // Calculate resolution statistics
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved');
  const totalResolved = resolvedComplaints.length;
  
  // Mock officer data (in a real app, this would come from the backend)
  const officers = [
    { name: 'Officer A', resolved: Math.floor(totalResolved * 0.4) },
    { name: 'Officer B', resolved: Math.floor(totalResolved * 0.3) },
    { name: 'Officer C', resolved: Math.floor(totalResolved * 0.2) },
    { name: 'Officer D', resolved: totalResolved - Math.floor(totalResolved * 0.4) - Math.floor(totalResolved * 0.3) - Math.floor(totalResolved * 0.2) }
  ];

  return (
    <div>
      <div className="officer-stats">
        <div className="officer-stat">
          <div className="officer-stat-value">{totalResolved}</div>
          <div className="officer-stat-label">Total Resolved</div>
        </div>
        <div className="officer-stat">
          <div className="officer-stat-value">{avgResolutionTime || 0}</div>
          <div className="officer-stat-label">Avg. Hours</div>
        </div>
      </div>
      
      <h3>Resolution by Officer</h3>
      {officers.map((officer, index) => (
        <div key={index} className="officer-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>{officer.name}</span>
            <span>{officer.resolved} complaints</span>
          </div>
          <div style={{ 
            height: '10px', 
            backgroundColor: '#3498db', 
            width: `${(officer.resolved / totalResolved) * 100}%`,
            borderRadius: '5px'
          }} />
        </div>
      ))}
    </div>
  );
};

export default OfficerTracker;