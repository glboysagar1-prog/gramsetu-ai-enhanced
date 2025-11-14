import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import VoiceComplaint from '../VoiceComplaint';
import axios from 'axios';

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [myComplaints, setMyComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });

  useEffect(() => {
    // Fetch citizen's complaints
    fetchMyComplaints();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const fetchMyComplaints = async () => {
    try {
      // Mock data for now
      const mockComplaints = [
        {
          id: 'GSAI-2025-0001',
          text: 'Water supply issue in my area',
          category: 'Water',
          status: 'In Progress',
          urgency: 'High',
          createdAt: '2025-10-20T10:30:00Z',
          assignedOfficer: 'Officer Rajesh Kumar'
        },
        {
          id: 'GSAI-2025-0045',
          text: 'Road needs repair',
          category: 'Road',
          status: 'Resolved',
          urgency: 'Medium',
          createdAt: '2025-10-15T14:20:00Z',
          resolvedAt: '2025-10-18T09:00:00Z'
        }
      ];
      
      setMyComplaints(mockComplaints);
      setStats({
        total: mockComplaints.length,
        pending: mockComplaints.filter(c => c.status !== 'Resolved').length,
        resolved: mockComplaints.filter(c => c.status === 'Resolved').length
      });
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user.name}</h1>
          <p className="user-role">👤 Citizen Dashboard</p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Complaints</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.resolved}</h3>
            <p>Resolved</p>
          </div>
        </div>
      </div>

      {/* Voice Complaint Filing */}
      <VoiceComplaint onComplaintSubmitted={fetchMyComplaints} />

      {/* My Complaints List */}
      <div className="section-card">
        <h2>📋 My Complaints</h2>
        <div className="complaints-list">
          {myComplaints.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <p>No complaints filed yet</p>
              <p className="empty-subtitle">Use the voice complaint system above to file your first complaint</p>
            </div>
          ) : (
            myComplaints.map(complaint => (
              <div key={complaint.id} className="complaint-item">
                <div className="complaint-header">
                  <span className="complaint-id">{complaint.id}</span>
                  <span className={`status-badge status-${complaint.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {complaint.status}
                  </span>
                </div>
                <p className="complaint-text">{complaint.text}</p>
                <div className="complaint-meta">
                  <span className="meta-item">
                    <span className="meta-icon">📁</span>
                    {complaint.category}
                  </span>
                  <span className="meta-item">
                    <span className="meta-icon">🔥</span>
                    {complaint.urgency}
                  </span>
                  <span className="meta-item">
                    <span className="meta-icon">📅</span>
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {complaint.assignedOfficer && (
                  <p className="assigned-officer">👮 Assigned to: {complaint.assignedOfficer}</p>
                )}
                {complaint.resolvedAt && (
                  <p className="resolved-date">✅ Resolved on: {new Date(complaint.resolvedAt).toLocaleDateString()}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dashboard-header h1 {
          color: white;
          font-size: 2rem;
          margin: 0;
        }

        .user-role {
          color: rgba(255, 255, 255, 0.7);
          margin: 0.5rem 0 0;
        }

        .btn-logout {
          padding: 0.75rem 2rem;
          background: rgba(239, 68, 68, 0.2);
          border: 2px solid #ef4444;
          border-radius: 50px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-logout:hover {
          background: #ef4444;
          transform: scale(1.05);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          border-color: #6366f1;
        }

        .stat-icon {
          font-size: 2.5rem;
        }

        .stat-content h3 {
          color: white;
          font-size: 2rem;
          margin: 0;
        }

        .stat-content p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          font-size: 0.875rem;
        }

        .section-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          border-radius: 24px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 2rem;
        }

        .section-card h2 {
          color: white;
          margin-bottom: 1.5rem;
        }

        .complaints-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .complaint-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .complaint-item:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: #6366f1;
        }

        .complaint-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .complaint-id {
          color: #a5b4fc;
          font-weight: 700;
          font-size: 1.125rem;
        }

        .complaint-text {
          color: white;
          margin: 1rem 0;
          font-size: 1rem;
        }

        .complaint-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 1rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
        }

        .meta-icon {
          font-size: 1rem;
        }

        .assigned-officer,
        .resolved-date {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
          margin: 0.5rem 0 0;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }

        .empty-state p {
          color: white;
          font-size: 1.125rem;
          margin: 0.5rem 0;
        }

        .empty-subtitle {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem !important;
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1rem;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CitizenDashboard;
