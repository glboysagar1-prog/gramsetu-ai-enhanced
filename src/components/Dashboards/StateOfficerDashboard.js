import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, AlertCircle, Map, DollarSign, Network } from 'lucide-react';
import { ComplaintsTrendChart, CategoryPieChart } from '../Charts/Charts';
import './StateDashboard.css';

const StateOfficerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [districtData, setDistrictData] = useState([]);
  const [integrityIndex, setIntegrityIndex] = useState({});
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    fetchStateData();
    const interval = setInterval(fetchStateData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStateData = () => {
    const mockDistricts = [
      { name: 'Mumbai', score: 87, complaints: 310, resolved: 270, risk: 'low', trend: 'up' },
      { name: 'Pune', score: 82, complaints: 245, resolved: 201, risk: 'low', trend: 'up' },
      { name: 'Nagpur', score: 71, complaints: 189, resolved: 134, risk: 'medium', trend: 'down' },
      { name: 'Nashik', score: 68, complaints: 156, resolved: 106, risk: 'medium', trend: 'stable' },
      { name: 'Aurangabad', score: 55, complaints: 142, resolved: 78, risk: 'high', trend: 'down' },
    ];

    const mockPredictions = [
      { type: 'Flood Risk', location: 'Ward 9, Mumbai', probability: 80, action: 'Deploy resources' },
      { type: 'Corruption Risk', location: 'Procurement Dept, Aurangabad', probability: 72, action: 'Audit required' },
      { type: 'Fund Delay', location: 'District Treasury, Nagpur', probability: 65, action: 'Streamline process' },
    ];

    setDistrictData(mockDistricts);
    setIntegrityIndex({
      overall: 74.6,
      red: 1,
      yellow: 2,
      green: 2
    });
    setPredictions(mockPredictions);
  };

  if (!user) return <div>Loading...</div>;

  const trendData = [
    { date: 'Week 1', complaints: 142, resolved: 108 },
    { date: 'Week 2', complaints: 156, resolved: 121 },
    { date: 'Week 3', complaints: 139, resolved: 115 },
    { date: 'Week 4', complaints: 167, resolved: 138 }
  ];

  const categoryData = [
    { name: 'Infrastructure', value: 245 },
    { name: 'Corruption', value: 89 },
    { name: 'Fund Misuse', value: 67 },
    { name: 'Service Delay', value: 134 }
  ];

  return (
    <div className="state-dashboard">
      <div className="state-container">
        <motion.div className="state-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <h1>⚖️ State Officer Dashboard</h1>
            <p>Maharashtra State - Integrity & Performance Monitoring</p>
          </div>
          <div className="integrity-badge">
            <Shield size={32} />
            <div>
              <span className="score">{integrityIndex.overall}</span>
              <span className="label">Integrity Index</span>
            </div>
          </div>
        </motion.div>

        {/* Integrity Map */}
        <div className="section-card">
          <h2>🗺️ District Integrity Index Map</h2>
          <div className="integrity-grid">
            {districtData.map((district, idx) => (
              <motion.div
                key={idx}
                className={`district-card ${district.risk}`}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="district-header">
                  <Map size={20} />
                  <h4>{district.name}</h4>
                  <TrendingUp className={`trend-icon ${district.trend}`} size={16} />
                </div>
                <div className="score-display">
                  <div className="score-circle" style={{
                    background: `conic-gradient(${
                      district.risk === 'low' ? '#10b981' :
                      district.risk === 'medium' ? '#fbbf24' : '#ef4444'
                    } ${district.score * 3.6}deg, #e2e8f0 0deg)`
                  }}>
                    <span>{district.score}</span>
                  </div>
                </div>
                <div className="district-stats">
                  <div><span>Total:</span> {district.complaints}</div>
                  <div><span>Resolved:</span> {district.resolved}</div>
                  <div><span>Rate:</span> {((district.resolved/district.complaints)*100).toFixed(0)}%</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Predictive Alerts */}
        <div className="section-card">
          <h2>🔮 AI Predictive Alerts</h2>
          <div className="predictions-list">
            {predictions.map((pred, idx) => (
              <motion.div
                key={idx}
                className="prediction-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
              >
                <div className="pred-header">
                  <AlertCircle size={24} className="pred-icon" />
                  <div>
                    <h4>{pred.type}</h4>
                    <p>{pred.location}</p>
                  </div>
                  <div className="probability">
                    <div className="prob-circle">{pred.probability}%</div>
                  </div>
                </div>
                <div className="pred-action">
                  <strong>Recommended Action:</strong> {pred.action}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="charts-row">
          <div className="chart-container">
            <h3>📊 Corruption Risk Trends</h3>
            <ComplaintsTrendChart data={trendData} />
          </div>
          <div className="chart-container">
            <h3>📁 Risk Categories</h3>
            <CategoryPieChart data={categoryData} />
          </div>
        </div>

        {/* Fund Flow Analytics */}
        <div className="section-card">
          <h2>💰 Fund Flow Analytics</h2>
          <div className="fund-grid">
            <div className="fund-stat">
              <DollarSign size={32} />
              <div>
                <h3>₹2.4 Cr</h3>
                <p>Total Allocated</p>
              </div>
            </div>
            <div className="fund-stat">
              <DollarSign size={32} />
              <div>
                <h3>₹1.8 Cr</h3>
                <p>Disbursed</p>
              </div>
            </div>
            <div className="fund-stat">
              <DollarSign size={32} />
              <div>
                <h3>₹0.6 Cr</h3>
                <p>Pending</p>
              </div>
            </div>
            <div className="fund-stat warning">
              <AlertCircle size={32} />
              <div>
                <h3>5 Districts</h3>
                <p>Delayed Disbursement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Recommendations */}
        <div className="policy-card">
          <h2>📋 AI Policy Recommendations</h2>
          <div className="recommendations">
            <div className="recommendation">
              <span className="rec-badge">High Priority</span>
              <p>Strengthen oversight in Aurangabad district procurement processes - corruption risk detected at 72%</p>
            </div>
            <div className="recommendation">
              <span className="rec-badge">Medium Priority</span>
              <p>Streamline fund disbursement in 5 districts to prevent delays and improve service delivery</p>
            </div>
            <div className="recommendation">
              <span className="rec-badge">Low Priority</span>
              <p>Implement blockchain-verified tracking across all districts to boost transparency by 23%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateOfficerDashboard;
