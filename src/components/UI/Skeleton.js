import React from 'react';
import './Skeleton.css';

export const SkeletonCard = ({ width = '100%', height = '100px' }) => (
  <div className="skeleton-card" style={{ width, height }}>
    <div className="skeleton-shimmer"></div>
  </div>
);

export const SkeletonText = ({ lines = 3, width = '100%' }) => (
  <div className="skeleton-text-container" style={{ width }}>
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i} 
        className="skeleton-text-line"
        style={{ width: i === lines - 1 ? '60%' : '100%' }}
      >
        <div className="skeleton-shimmer"></div>
      </div>
    ))}
  </div>
);

export const SkeletonChart = ({ height = '300px' }) => (
  <div className="skeleton-chart" style={{ height }}>
    <div className="skeleton-chart-bars">
      {[60, 80, 45, 90, 70, 55].map((height, i) => (
        <div key={i} className="skeleton-bar" style={{ height: `${height}%` }}>
          <div className="skeleton-shimmer"></div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="skeleton-table">
    <div className="skeleton-table-header">
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="skeleton-table-cell header">
          <div className="skeleton-shimmer"></div>
        </div>
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="skeleton-table-row">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div key={colIndex} className="skeleton-table-cell">
            <div className="skeleton-shimmer"></div>
          </div>
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = '50px' }) => (
  <div className="skeleton-avatar" style={{ width: size, height: size }}>
    <div className="skeleton-shimmer"></div>
  </div>
);

export const SkeletonKPICard = () => (
  <div className="skeleton-kpi-card">
    <div className="skeleton-kpi-icon">
      <div className="skeleton-shimmer"></div>
    </div>
    <div className="skeleton-kpi-content">
      <div className="skeleton-kpi-label">
        <div className="skeleton-shimmer"></div>
      </div>
      <div className="skeleton-kpi-value">
        <div className="skeleton-shimmer"></div>
      </div>
      <div className="skeleton-kpi-change">
        <div className="skeleton-shimmer"></div>
      </div>
    </div>
  </div>
);

export const SkeletonChatMessage = ({ isUser = false }) => (
  <div className={`skeleton-chat-message ${isUser ? 'user' : 'assistant'}`}>
    <div className="skeleton-chat-avatar">
      <div className="skeleton-shimmer"></div>
    </div>
    <div className="skeleton-chat-content">
      <div className="skeleton-chat-text">
        <div className="skeleton-shimmer"></div>
      </div>
      <div className="skeleton-chat-text short">
        <div className="skeleton-shimmer"></div>
      </div>
    </div>
  </div>
);

export const SkeletonComplaintCard = () => (
  <div className="skeleton-complaint-card">
    <div className="skeleton-complaint-header">
      <div className="skeleton-complaint-id">
        <div className="skeleton-shimmer"></div>
      </div>
      <div className="skeleton-complaint-status">
        <div className="skeleton-shimmer"></div>
      </div>
    </div>
    <div className="skeleton-complaint-body">
      <div className="skeleton-shimmer"></div>
    </div>
    <div className="skeleton-complaint-footer">
      <div className="skeleton-complaint-meta">
        <div className="skeleton-shimmer"></div>
      </div>
      <div className="skeleton-complaint-meta">
        <div className="skeleton-shimmer"></div>
      </div>
    </div>
  </div>
);

const Skeleton = {
  Card: SkeletonCard,
  Text: SkeletonText,
  Chart: SkeletonChart,
  Table: SkeletonTable,
  Avatar: SkeletonAvatar,
  KPICard: SkeletonKPICard,
  ChatMessage: SkeletonChatMessage,
  ComplaintCard: SkeletonComplaintCard,
};

export default Skeleton;
