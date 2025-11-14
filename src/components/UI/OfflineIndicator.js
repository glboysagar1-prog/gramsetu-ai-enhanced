/**
 * Offline Indicator Component for GramSetu AI
 * Shows offline status and sync notifications
 */
import React from 'react';
import useOfflineComplaint from '../../hooks/useOfflineComplaint';

const OfflineIndicator = () => {
  const { isOnline, pendingSyncCount, triggerSync } = useOfflineComplaint();

  if (isOnline && pendingSyncCount === 0) {
    return null;
  }

  return (
    <div className={`offline-indicator ${!isOnline ? 'offline' : 'sync-pending'}`}>
      {!isOnline ? (
        <div className="offline-content">
          <span className="status-icon">📡</span>
          <span className="status-text">Offline Mode - Complaints will be saved locally</span>
        </div>
      ) : (
        <div className="sync-content">
          <span className="status-icon">🔄</span>
          <span className="status-text">
            {pendingSyncCount} complaint{pendingSyncCount !== 1 ? 's' : ''} waiting to sync
          </span>
          <button className="sync-button" onClick={triggerSync}>
            Sync Now
          </button>
        </div>
      )}
      
      <style jsx>{`
        .offline-indicator {
          position: fixed;
          top: 10px;
          right: 10px;
          z-index: 1000;
          padding: 10px 15px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }
        
        .offline-indicator.offline {
          background: #fee2e2;
          color: #ef4444;
          border: 1px solid #fecaca;
        }
        
        .offline-indicator.sync-pending {
          background: #fef3c7;
          color: #d97706;
          border: 1px solid #fde68a;
        }
        
        .status-icon {
          font-size: 16px;
        }
        
        .sync-button {
          background: rgba(255, 255, 255, 0.3);
          border: 1px solid currentColor;
          border-radius: 15px;
          padding: 5px 10px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .sync-button:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        
        @media (max-width: 768px) {
          .offline-indicator {
            top: 5px;
            right: 5px;
            padding: 8px 12px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default OfflineIndicator;