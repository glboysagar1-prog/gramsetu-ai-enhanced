import React from 'react';
import OfficerPerformanceCard from './OfficerPerformanceCard';

const OfficerLeaderboard = ({ officers }) => {
  return (
    <div className="officer-leaderboard">
      {officers.map((officer, index) => (
        <div key={officer.id} className="leaderboard-item">
          <span className="rank">#{index + 1}</span>
          <OfficerPerformanceCard officer={officer} />
        </div>
      ))}
    </div>
  );
};

export default OfficerLeaderboard;
