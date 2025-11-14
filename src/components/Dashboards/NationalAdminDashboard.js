import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Globe, TrendingUp, Shield, Award, AlertCircle, Users } from 'lucide-react';
import './NationalDashboard.css';

const NationalAdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stateData, setStateData] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [complianceData, setComplianceData] = useState({});

  useEffect(() => {
    fetchNationalData();
    const interval = setInterval(fetchNationalData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchNationalData = () => {
    const mockStates = [
      { name: 'Tamil Nadu', score: 92, complaints: 4521, resolved: 4159, population: '7.8 Cr', rank: 1 },
      { name: 'Kerala', score: 88, complaints: 3214, resolved: 2829, population: '3.5 Cr', rank: 2 },
      { name: 'Maharashtra', score: 85, complaints: 8932, resolved: 7592, population: '12.4 Cr', rank: 3 },
      { name: 'Madhya Pradesh', score: 76, complaints: 5678, resolved: 4315, population: '8.5 Cr', rank: 4 },
      { name: 'Uttar Pradesh', score: 71, complaints: 12453, resolved: 8842, population: '23.8 Cr', rank: 5 },
    ];

    const mockRecs = [
      { priority: 'Critical', text: 'Increase water infrastructure funding in MP by 15% to address seasonal shortages' },
      { priority: 'High', text: 'Implement blockchain-verified complaint tracking to boost citizen trust by 23%' },
      { priority: 'Medium', text: 'Deploy AI chatbots in Hindi belt states to improve accessibility by 34%' },
    ];

    setStateData(mockStates);
    setAiRecommendations(mockRecs);
    setComplianceData({
      total: 28,
      compliant: 18,
      partialCompliant: 8,
      nonCompliant: 2,
      dataProtectionNeeded: 18
    });
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="national-dashboard">
      <div className="national-container">
        <motion.div className="national-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <h1>🇮🇳 National Governance Command Center</h1>
            <p>Unified Intelligence Network - Pan-India Overview</p>
          </div>
          <div className="india-badge">
            <Globe size={40} />
            <div>
              <span className="total">28 States</span>
              <span className="subtitle">1.4B Citizens</span>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <motion.div className="metric-card" whileHover={{ scale: 1.05 }}>
            <div className="metric-icon blue">
              <Users size={32} />
            </div>
            <div className="metric-data">
              <h3>34,798</h3>
              <p>Total Complaints (24h)</p>
              <span className="trend up">↑ 12% vs yesterday</span>
            </div>
          </motion.div>

          <motion.div className="metric-card" whileHover={{ scale: 1.05 }}>
            <div className="metric-icon green">
              <TrendingUp size={32} />
            </div>
            <div className="metric-data">
              <h3>81.3%</h3>
              <p>National Avg Resolution</p>
              <span className="trend up">↑ 3.2% this month</span>
            </div>
          </motion.div>

          <motion.div className="metric-card" whileHover={{ scale: 1.05 }}>
            <div className="metric-icon purple">
              <Shield size={32} />
            </div>
            <div className="metric-data">
              <h3>18/28</h3>
              <p>AI Compliant States</p>
              <span className="trend stable">64% compliance</span>
            </div>
          </motion.div>

          <motion.div className="metric-card" whileHover={{ scale: 1.05 }}>
            <div className="metric-icon gold">
              <Award size={32} />
            </div>
            <div className="metric-data">
              <h3>92/100</h3>
              <p>Top State (Tamil Nadu)</p>
              <span className="trend up">Best performer</span>
            </div>
          </motion.div>
        </div>

        {/* State Comparison Table */}
        <div className="section-card">
          <h2>🏆 State Performance Rankings</h2>
          <div className="comparison-table">
            <div className="table-header">
              <div className="col-rank">Rank</div>
              <div className="col-state">State</div>
              <div className="col-score">Score</div>
              <div className="col-complaints">Total Complaints</div>
              <div className="col-resolved">Resolved</div>
              <div className="col-rate">Resolution Rate</div>
              <div className="col-population">Population</div>
            </div>
            {stateData.map((state, idx) => (
              <motion.div
                key={idx}
                className="table-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ backgroundColor: '#f8fafc' }}
              >
                <div className="col-rank">
                  <span className={`rank-badge rank-${state.rank}`}>#{state.rank}</span>
                </div>
                <div className="col-state">
                  <strong>{state.name}</strong>
                </div>
                <div className="col-score">
                  <div className="score-bar" style={{
                    background: `linear-gradient(90deg, ${
                      state.score >= 85 ? '#10b981' :
                      state.score >= 75 ? '#fbbf24' : '#ef4444'
                    } ${state.score}%, #e2e8f0 ${state.score}%)`
                  }}>
                    <span>{state.score}</span>
                  </div>
                </div>
                <div className="col-complaints">{state.complaints.toLocaleString()}</div>
                <div className="col-resolved">{state.resolved.toLocaleString()}</div>
                <div className="col-rate">
                  <span className={
                    (state.resolved/state.complaints) >= 0.85 ? 'rate-high' :
                    (state.resolved/state.complaints) >= 0.75 ? 'rate-medium' : 'rate-low'
                  }>
                    {((state.resolved/state.complaints)*100).toFixed(1)}%
                  </span>
                </div>
                <div className="col-population">{state.population}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="section-card">
          <h2>🤖 AI Policy Recommendations</h2>
          <div className="ai-recommendations">
            {aiRecommendations.map((rec, idx) => (
              <motion.div
                key={idx}
                className={`ai-rec-item priority-${rec.priority.toLowerCase()}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
              >
                <div className="rec-header">
                  <AlertCircle size={20} />
                  <span className="priority-label">{rec.priority} Priority</span>
                </div>
                <p>{rec.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Compliance Monitor */}
        <div className="compliance-section">
          <div className="compliance-header">
            <h2>🛡️ Ethical AI Compliance Monitor</h2>
            <div className="compliance-score">
              <span className="score-value">{((complianceData.compliant / complianceData.total) * 100).toFixed(0)}%</span>
              <span className="score-label">Compliance Rate</span>
            </div>
          </div>
          <div className="compliance-grid">
            <div className="compliance-stat green">
              <h4>{complianceData.compliant}</h4>
              <p>Fully Compliant</p>
            </div>
            <div className="compliance-stat yellow">
              <h4>{complianceData.partialCompliant}</h4>
              <p>Partial Compliance</p>
            </div>
            <div className="compliance-stat red">
              <h4>{complianceData.nonCompliant}</h4>
              <p>Non-Compliant</p>
            </div>
            <div className="compliance-stat blue">
              <h4>{complianceData.dataProtectionNeeded}</h4>
              <p>Need Data Protection</p>
            </div>
          </div>
        </div>

        {/* Federation Analytics */}
        <div className="federation-card">
          <h2>📊 Federation Analytics</h2>
          <div className="analytics-grid">
            <div className="analytic-box">
              <h4>Citizen Distribution</h4>
              <div className="analytic-data">
                <div className="data-row">
                  <span>Urban</span>
                  <strong>42%</strong>
                </div>
                <div className="data-row">
                  <span>Rural</span>
                  <strong>58%</strong>
                </div>
                <div className="data-row">
                  <span>Digital Access</span>
                  <strong>67%</strong>
                </div>
              </div>
            </div>
            <div className="analytic-box">
              <h4>Complaint Velocity</h4>
              <div className="analytic-data">
                <div className="data-row">
                  <span>Avg per State</span>
                  <strong>1,242/day</strong>
                </div>
                <div className="data-row">
                  <span>Peak Hours</span>
                  <strong>10AM-2PM</strong>
                </div>
                <div className="data-row">
                  <span>Response Time</span>
                  <strong>2.4 hrs</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NationalAdminDashboard;
