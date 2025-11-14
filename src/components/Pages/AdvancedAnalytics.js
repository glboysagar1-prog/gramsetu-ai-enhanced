/**
 * Advanced Analytics Dashboard for GramSetu AI
 * Enhanced analytics and decision support for governance
 */
import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AdvancedAnalytics = () => {
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
  const [resourceData, setResourceData] = useState([]);
  const [predictionData, setPredictionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trends');

  // Mock data for demo
  useEffect(() => {
    // Mock trend data
    const mockTrendData = [
      { date: '2023-06-01', total: 45, resolved: 35, pending: 10 },
      { date: '2023-06-02', total: 52, resolved: 40, pending: 12 },
      { date: '2023-06-03', total: 38, resolved: 30, pending: 8 },
      { date: '2023-06-04', total: 61, resolved: 45, pending: 16 },
      { date: '2023-06-05', total: 55, resolved: 42, pending: 13 },
      { date: '2023-06-06', total: 48, resolved: 38, pending: 10 },
      { date: '2023-06-07', total: 59, resolved: 47, pending: 12 }
    ];
    setTrendData(mockTrendData);

    // Mock category data
    const mockCategoryData = [
      { category: 'Water', total: 125, high_urgency_rate: 25.6, resolution_rate: 82.4 },
      { category: 'Electricity', total: 98, high_urgency_rate: 18.4, resolution_rate: 76.5 },
      { category: 'Road', total: 87, high_urgency_rate: 15.2, resolution_rate: 68.9 },
      { category: 'Health', total: 65, high_urgency_rate: 32.1, resolution_rate: 89.2 },
      { category: 'Sanitation', total: 54, high_urgency_rate: 12.8, resolution_rate: 71.3 },
      { category: 'Education', total: 42, high_urgency_rate: 8.9, resolution_rate: 85.7 }
    ];
    setCategoryData(mockCategoryData);

    // Mock sentiment data
    const mockSentimentData = [
      { category: 'Water', positive: 85, negative: 25, neutral: 15, positive_rate: 68.0, negative_rate: 20.0, neutral_rate: 12.0, total: 125 },
      { category: 'Electricity', positive: 62, negative: 20, neutral: 16, positive_rate: 63.3, negative_rate: 20.4, neutral_rate: 16.3, total: 98 },
      { category: 'Road', positive: 45, negative: 28, neutral: 14, positive_rate: 51.7, negative_rate: 32.2, neutral_rate: 16.1, total: 87 },
      { category: 'Health', positive: 48, negative: 10, neutral: 7, positive_rate: 73.8, negative_rate: 15.4, neutral_rate: 10.8, total: 65 }
    ];
    setSentimentData(mockSentimentData);

    // Mock resource data
    const mockResourceData = {
      workers: [
        { id: 'FW001', name: 'Rajesh Kumar', area: 'North Zone', total_assignments: 45, resolved_count: 38, resolution_rate: 84.4, avg_resolution_hours: 24.5 },
        { id: 'FW002', name: 'Priya Singh', area: 'South Zone', total_assignments: 38, resolved_count: 32, resolution_rate: 84.2, avg_resolution_hours: 22.1 },
        { id: 'FW003', name: 'Amit Sharma', area: 'East Zone', total_assignments: 52, resolved_count: 41, resolution_rate: 78.8, avg_resolution_hours: 28.7 },
        { id: 'FW004', name: 'Deepa Patel', area: 'West Zone', total_assignments: 35, resolved_count: 29, resolution_rate: 82.9, avg_resolution_hours: 20.3 }
      ],
      category_workload: [
        { category: 'Water', complaint_count: 125, avg_resolution_hours: 26.3 },
        { category: 'Electricity', complaint_count: 98, avg_resolution_hours: 24.1 },
        { category: 'Road', complaint_count: 87, avg_resolution_hours: 32.5 },
        { category: 'Health', complaint_count: 65, avg_resolution_hours: 18.7 }
      ]
    };
    setResourceData(mockResourceData);

    // Mock prediction data
    const mockPredictionData = [
      { date: '2023-06-08', predicted_volume: 55, confidence: 'medium' },
      { date: '2023-06-09', predicted_volume: 52, confidence: 'medium' },
      { date: '2023-06-10', predicted_volume: 48, confidence: 'low' },
      { date: '2023-06-11', predicted_volume: 60, confidence: 'high' },
      { date: '2023-06-12', predicted_volume: 57, confidence: 'medium' },
      { date: '2023-06-13', predicted_volume: 53, confidence: 'medium' },
      { date: '2023-06-14', predicted_volume: 58, confidence: 'medium' }
    ];
    setPredictionData(mockPredictionData);

    setLoading(false);
  }, []);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  const SENTIMENT_COLORS = ['#10B981', '#EF4444', '#94A3B8'];

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h1>📊 Advanced Analytics Dashboard</h1>
        <p>Data-driven insights for better governance</p>
      </div>

      {/* Navigation Tabs */}
      <div className="analytics-tabs">
        <button 
          className={`tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          Trends & Forecasting
        </button>
        <button 
          className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Category Analysis
        </button>
        <button 
          className={`tab-btn ${activeTab === 'sentiment' ? 'active' : ''}`}
          onClick={() => setActiveTab('sentiment')}
        >
          Sentiment Analysis
        </button>
        <button 
          className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          Resource Allocation
        </button>
      </div>

      {/* Analytics Content */}
      <div className="analytics-content">
        {activeTab === 'trends' && (
          <div className="trends-section">
            <h2>Complaint Trends</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Complaints" strokeWidth={2} />
                  <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Resolved" strokeWidth={2} />
                  <Line type="monotone" dataKey="pending" stroke="#f59e0b" name="Pending" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <h2>Volume Forecasting</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={predictionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="predicted_volume" name="Predicted Volume">
                    {predictionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.confidence === 'high' ? '#10b981' : entry.confidence === 'medium' ? '#f59e0b' : '#ef4444'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="categories-section">
            <h2>Category Analysis</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" name="Total Complaints" fill="#8884d8" />
                  <Bar dataKey="resolution_rate" name="Resolution Rate (%)" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="category-stats">
              <h3>Category Details</h3>
              <div className="stats-grid">
                {categoryData.map((category, index) => (
                  <div key={index} className="stat-card">
                    <h4>{category.category}</h4>
                    <div className="stat-item">
                      <span className="label">Total:</span>
                      <span className="value">{category.total}</span>
                    </div>
                    <div className="stat-item">
                      <span className="label">High Urgency:</span>
                      <span className="value">{category.high_urgency_rate}%</span>
                    </div>
                    <div className="stat-item">
                      <span className="label">Resolution Rate:</span>
                      <span className="value">{category.resolution_rate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sentiment' && (
          <div className="sentiment-section">
            <h2>Sentiment Analysis</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={sentimentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="positive" name="Positive" stackId="a" fill={SENTIMENT_COLORS[0]} />
                  <Bar dataKey="negative" name="Negative" stackId="a" fill={SENTIMENT_COLORS[1]} />
                  <Bar dataKey="neutral" name="Neutral" stackId="a" fill={SENTIMENT_COLORS[2]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="sentiment-pie-charts">
              <h3>Sentiment Distribution by Category</h3>
              <div className="pie-charts-grid">
                {sentimentData.slice(0, 4).map((category, index) => (
                  <div key={index} className="pie-chart-container">
                    <h4>{category.category}</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Positive', value: category.positive },
                            { name: 'Negative', value: category.negative },
                            { name: 'Neutral', value: category.neutral }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {['Positive', 'Negative', 'Neutral'].map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={SENTIMENT_COLORS[idx]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="resources-section">
            <h2>Resource Allocation Insights</h2>
            
            <div className="workers-performance">
              <h3>Field Worker Performance</h3>
              <div className="performance-table">
                <table>
                  <thead>
                    <tr>
                      <th>Worker</th>
                      <th>Area</th>
                      <th>Total Assignments</th>
                      <th>Resolved</th>
                      <th>Resolution Rate</th>
                      <th>Avg. Resolution Time (hrs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resourceData.workers.map((worker, index) => (
                      <tr key={index}>
                        <td>{worker.name}</td>
                        <td>{worker.area}</td>
                        <td>{worker.total_assignments}</td>
                        <td>{worker.resolved_count}</td>
                        <td>{worker.resolution_rate}%</td>
                        <td>{worker.avg_resolution_hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="workload-analysis">
              <h3>Category Workload Analysis</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={resourceData.category_workload}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="complaint_count" name="Complaint Count" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="avg_resolution_hours" name="Avg Resolution Hours" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .analytics-dashboard {
          padding: 2rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
          min-height: 100vh;
        }

        .dashboard-header {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          margin-bottom: 2rem;
          text-align: center;
        }

        .dashboard-header h1 {
          color: #1e3a8a;
          margin: 0 0 1rem 0;
        }

        .dashboard-header p {
          color: #64748b;
          font-size: 1.1rem;
          margin: 0;
        }

        .analytics-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          background: white;
          padding: 0.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .tab-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          flex: 1;
        }

        .tab-btn.active {
          background: #6366f1;
          color: white;
        }

        .tab-btn:hover:not(.active) {
          background: #f1f5f9;
        }

        .analytics-content {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .analytics-content h2 {
          color: #1e3a8a;
          margin: 0 0 1.5rem 0;
        }

        .chart-container {
          margin-bottom: 2rem;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 8px;
        }

        .category-stats {
          margin-top: 2rem;
        }

        .category-stats h3 {
          color: #1e3a8a;
          margin-bottom: 1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: #f8fafc;
          border-radius: 8px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
        }

        .stat-card h4 {
          margin: 0 0 1rem 0;
          color: #334155;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .stat-item .label {
          font-weight: 500;
          color: #64748b;
        }

        .stat-item .value {
          font-weight: 600;
          color: #334155;
        }

        .sentiment-pie-charts {
          margin-top: 2rem;
        }

        .sentiment-pie-charts h3 {
          color: #1e3a8a;
          margin-bottom: 1rem;
        }

        .pie-charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .pie-chart-container {
          background: #f8fafc;
          border-radius: 8px;
          padding: 1rem;
          border: 1px solid #e2e8f0;
        }

        .pie-chart-container h4 {
          text-align: center;
          margin: 0 0 1rem 0;
          color: #334155;
        }

        .workers-performance {
          margin-bottom: 2rem;
        }

        .workers-performance h3 {
          color: #1e3a8a;
          margin-bottom: 1rem;
        }

        .performance-table {
          overflow-x: auto;
        }

        .performance-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .performance-table th, 
        .performance-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        .performance-table th {
          background: #f1f5f9;
          font-weight: 600;
          color: #64748b;
        }

        .workload-analysis {
          margin-top: 2rem;
        }

        .workload-analysis h3 {
          color: #1e3a8a;
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .analytics-dashboard {
            padding: 1rem;
          }

          .analytics-tabs {
            flex-wrap: wrap;
          }

          .tab-btn {
            min-width: 120px;
            text-align: center;
          }

          .stats-grid, 
          .pie-charts-grid {
            grid-template-columns: 1fr;
          }

          .performance-table {
            font-size: 0.9rem;
          }

          .performance-table th, 
          .performance-table td {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdvancedAnalytics;