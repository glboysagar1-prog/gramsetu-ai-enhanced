import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ComplaintsTable from '../ComplaintsTable';

const OfficerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [stats, setStats] = useState({ assigned: 0, resolved: 0, pending: 0 });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    // Mock assigned complaints for officer
    const mockAssigned = [
      {
        id: 'GSAI-2025-0001',
        text: 'Water supply issue in Ward 5',
        category: 'Water',
        status: 'In Progress',
        urgency: 'High',
        createdAt: '2025-10-20T10:30:00Z',
        citizenId: 'CIT001',
        area: 'Ward 5, North Zone'
      },
      {
        id: 'GSAI-2025-0012',
        text: 'Street light not working',
        category: 'Electricity',
        status: 'Pending',
        urgency: 'Medium',
        createdAt: '2025-10-21T14:20:00Z',
        citizenId: 'CIT045',
        area: 'Ward 3, East Zone'
      },
      {
        id: 'GSAI-2025-0008',
        text: 'Road repair needed urgently',
        category: 'Road',
        status: 'Resolved',
        urgency: 'High',
        createdAt: '2025-10-18T09:00:00Z',
        resolvedAt: '2025-10-22T16:30:00Z',
        citizenId: 'CIT023',
        area: 'Ward 2, South Zone'
      }
    ];
    
    setAssignedComplaints(mockAssigned);
    setStats({
      assigned: mockAssigned.length,
      resolved: mockAssigned.filter(c => c.status === 'Resolved').length,
      pending: mockAssigned.filter(c => c.status !== 'Resolved').length
    });
  }, []);

  const handleResolve = (complaintId) => {
    // Update complaint status
    setAssignedComplaints(prev =>
      prev.map(c =>
        c.id === complaintId ? { ...c, status: 'Resolved', resolvedAt: new Date().toISOString() } : c
      )
    );
  };

  return (
    <div className="officer-dashboard">
      {/* Header */}
      <div className="dashboard-header glass">
        <div>
          <h1>👮 Field Officer Dashboard</h1>
          <p className="user-name">Welcome, {user.name || 'Officer'}</p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.assigned}</h3>
            <p>Assigned to Me</p>
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
            <p>Resolved by Me</p>
          </div>
        </div>
      </div>

      {/* Assigned Complaints */}
      <div className="section-card">
        <h2>📋 My Assigned Complaints</h2>
        <div className="complaints-list">
          {assignedComplaints.map(complaint => (
            <div key={complaint.id} className="complaint-item">
              <div className="complaint-header">
                <span className="complaint-id">{complaint.id}</span>
                <span className={`status-badge status-${complaint.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {complaint.status}
                </span>
              </div>
              <p className="complaint-text">{complaint.text}</p>
              <div className="complaint-meta">
                <span className="meta-item">📁 {complaint.category}</span>
                <span className="meta-item">🔥 {complaint.urgency}</span>
                <span className="meta-item">📍 {complaint.area}</span>
                <span className="meta-item">📅 {new Date(complaint.createdAt).toLocaleDateString()}</span>
              </div>
              {complaint.status !== 'Resolved' && (
                <button
                  className="btn-resolve"
                  onClick={() => handleResolve(complaint.id)}
                >
                  Mark as Resolved
                </button>
              )}
              {complaint.resolvedAt && (
                <p className="resolved-date">✅ Resolved on: {new Date(complaint.resolvedAt).toLocaleDateString()}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .officer-dashboard {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          min-height: 100vh;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 2rem;
          border-radius: 16px;
        }

        .dashboard-header h1 {
          color: white;
          font-size: 2rem;
          margin: 0;
        }

        .user-name {
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
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
        }

        .section-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          border-radius: 24px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
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

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-pending {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
        }

        .status-in-progress {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
        }

        .status-resolved {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .complaint-text {
          color: white;
          margin: 1rem 0;
        }

        .complaint-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 1rem;
        }

        .meta-item {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
        }

        .btn-resolve {
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          border-radius: 50px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-resolve:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
        }

        .resolved-date {
          color: #10b981;
          margin-top: 0.5rem;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .officer-dashboard {
            padding: 1rem;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default OfficerDashboard;
