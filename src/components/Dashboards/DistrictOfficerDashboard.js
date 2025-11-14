import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, TrendingUp, Users, Shield, BarChart3 } from 'lucide-react';
import { ComplaintsTrendChart, CategoryPieChart, OfficerPerformanceChart } from '../Charts/Charts';
import './DistrictDashboard.css';

const DistrictOfficerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [wardData, setWardData] = useState([]);
  const [escalations, setEscalations] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedWard, setSelectedWard] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // Auto-refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = () => {
    // Mock data for district dashboard
    const mockWards = [
      { id: 1, name: 'Ward 1', complaints: 45, pending: 12, resolved: 33, officers: 3, riskLevel: 'low' },
      { id: 2, name: 'Ward 2', complaints: 38, pending: 8, resolved: 30, officers: 3, riskLevel: 'low' },
      { id: 3, name: 'Ward 3', complaints: 56, pending: 18, resolved: 38, officers: 4, riskLevel: 'medium' },
      { id: 4, name: 'Ward 4', complaints: 42, pending: 10, resolved: 32, officers: 3, riskLevel: 'low' },
      { id: 5, name: 'Ward 5', complaints: 78, pending: 32, resolved: 46, officers: 5, riskLevel: 'high' },
      { id: 6, name: 'Ward 6', complaints: 51, pending: 15, resolved: 36, officers: 4, riskLevel: 'medium' },
    ];

    const mockEscalations = [
      { id: 1, complaint: 'Water supply disruption', ward: 'Ward 5', days: 4, urgency: 'Critical' },
      { id: 2, complaint: 'Road repair pending', ward: 'Ward 3', days: 3, urgency: 'High' },
      { id: 3, complaint: 'Electricity issues', ward: 'Ward 5', days: 5, urgency: 'Critical' },
    ];

    setWardData(mockWards);
    setEscalations(mockEscalations);
    setStats({
      totalComplaints: mockWards.reduce((sum, w) => sum + w.complaints, 0),
      pendingTotal: mockWards.reduce((sum, w) => sum + w.pending, 0),
      resolvedTotal: mockWards.reduce((sum, w) => sum + w.resolved, 0),
      totalOfficers: mockWards.reduce((sum, w) => sum + w.officers, 0),
      avgResolutionRate: 76.5,
      criticalEscalations: 3
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  const chartData = [
    { date: 'Mon', complaints: 52, resolved: 38 },
    { date: 'Tue', complaints: 61, resolved: 45 },
    { date: 'Wed', complaints: 48, resolved: 41 },
    { date: 'Thu', complaints: 67, resolved: 49 },
    { date: 'Fri', complaints: 59, resolved: 52 }
  ];

  const categoryData = [
    { name: 'Water', value: 89 },
    { name: 'Roads', value: 76 },
    { name: 'Electricity', value: 54 },
    { name: 'Sanitation', value: 43 },
    { name: 'Others', value: 48 }
  ];

  const officerData = [
    { officer: 'Rajesh Kumar', resolved: 28, pending: 6 },
    { officer: 'Priya Patel', resolved: 32, pending: 4 },
    { officer: 'Amit Singh', resolved: 25, pending: 8 },
    { officer: 'Neha Sharma', resolved: 30, pending: 5 }
  ];

  return (
    <div className="district-dashboard">
      <div className="district-container">
        {/* Header */}
        <motion.div 
          className="district-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>🏛️ District Officer Dashboard</h1>
            <p className="district-name">Mumbai District - Governance Overview</p>
          </div>
          <div className="header-stats">
            <div className="mini-stat">
              <TrendingUp size={20} />
              <span>{stats.avgResolutionRate}% Resolution Rate</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="district-stats">
          <motion.div className="stat-box blue" whileHover={{ scale: 1.05 }}>
            <BarChart3 size={32} />
            <div>
              <h3>{stats.totalComplaints}</h3>
              <p>Total Complaints</p>
            </div>
          </motion.div>
          <motion.div className="stat-box orange" whileHover={{ scale: 1.05 }}>
            <AlertTriangle size={32} />
            <div>
              <h3>{stats.pendingTotal}</h3>
              <p>Pending Issues</p>
            </div>
          </motion.div>
          <motion.div className="stat-box green" whileHover={{ scale: 1.05 }}>
            <Shield size={32} />
            <div>
              <h3>{stats.resolvedTotal}</h3>
              <p>Resolved</p>
            </div>
          </motion.div>
          <motion.div className="stat-box purple" whileHover={{ scale: 1.05 }}>
            <Users size={32} />
            <div>
              <h3>{stats.totalOfficers}</h3>
              <p>Field Officers</p>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="district-grid">
          {/* Ward Heatmap */}
          <div className="section-card">
            <h2>🗺️ Ward-wise Heatmap</h2>
            <div className="ward-heatmap">
              {wardData.map(ward => (
                <motion.div
                  key={ward.id}
                  className={`ward-card ${ward.riskLevel}`}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedWard(ward)}
                >
                  <div className="ward-header">
                    <MapPin size={20} />
                    <h4>{ward.name}</h4>
                  </div>
                  <div className="ward-stats">
                    <div className="ward-stat">
                      <span className="label">Total</span>
                      <span className="value">{ward.complaints}</span>
                    </div>
                    <div className="ward-stat">
                      <span className="label">Pending</span>
                      <span className="value pending">{ward.pending}</span>
                    </div>
                    <div className="ward-stat">
                      <span className="label">Resolved</span>
                      <span className="value resolved">{ward.resolved}</span>
                    </div>
                  </div>
                  <div className="ward-footer">
                    <Users size={14} />
                    <span>{ward.officers} Officers</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Escalations */}
          <div className="section-card">
            <h2>⚡ Auto-Escalation Alerts</h2>
            <div className="escalations-list">
              {escalations.map(esc => (
                <motion.div
                  key={esc.id}
                  className="escalation-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <AlertTriangle className="alert-icon" />
                  <div className="escalation-content">
                    <h4>{esc.complaint}</h4>
                    <p>{esc.ward} • {esc.days} days overdue</p>
                  </div>
                  <span className={`urgency-tag ${esc.urgency.toLowerCase()}`}>
                    {esc.urgency}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          <div className="chart-box">
            <h3>📊 Complaint Trends</h3>
            <ComplaintsTrendChart data={chartData} />
          </div>
          <div className="chart-box">
            <h3>📁 Category Distribution</h3>
            <CategoryPieChart data={categoryData} />
          </div>
          <div className="chart-box full-width">
            <h3>👮 Officer Performance</h3>
            <OfficerPerformanceChart data={officerData} />
          </div>
        </div>

        {/* AI Summary */}
        <div className="ai-summary-card">
          <div className="ai-header">
            <h3>🤖 AI-Generated Insights</h3>
            <span className="live-badge">● Live</span>
          </div>
          <div className="insights-grid">
            <div className="insight">
              <h4>Top 5 Unresolved Issues</h4>
              <ol>
                <li>Water supply disruption - Ward 5 (32 complaints)</li>
                <li>Road maintenance - Ward 3 (18 complaints)</li>
                <li>Street lighting - Ward 6 (15 complaints)</li>
                <li>Drainage problems - Ward 5 (14 complaints)</li>
                <li>Waste management - Ward 3 (12 complaints)</li>
              </ol>
            </div>
            <div className="insight">
              <h4>Recommendations</h4>
              <ul>
                <li>✓ Deploy additional resources to Ward 5 (high risk)</li>
                <li>✓ Prioritize water supply issues (highest volume)</li>
                <li>✓ Officer Kumar shows best resolution rate - share best practices</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistrictOfficerDashboard;
