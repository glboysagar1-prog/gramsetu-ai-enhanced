import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import './App.css';

// Import components
import ComplaintsTable from './components/ComplaintsTable';
import HeatmapSimulation from './components/HeatmapSimulation';
import OfficerTracker from './components/OfficerTracker';
import AutoEscalation from './components/AutoEscalation';
import ModernDashboard from './components/ModernDashboard';
import AnimationBackground from './components/AnimationBackground';
import FloatingObjects from './components/FloatingObjects';
import VoiceComplaint from './components/VoiceComplaint';
import Login from './components/Auth/Login';
import CitizenDashboard from './components/Dashboards/CitizenDashboard';

// Register Chart.js components
Chart.register(...registerables);

function App() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModernUI, setShowModernUI] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
// Check if user is already logged in
    const storedUser = localStorage.getItem('gramsetuUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('gramsetuUser');
      }
    }
    
    // Fetch complaints data from backend
    fetchComplaints();
  }, []);
      try {
        setLoading(true);
        
        // Connect to Flask backend API
        try {
          const response = await axios.get('http://localhost:5000/api/v1/dashboard');
          if (response.data && response.data.status === 'success') {
            // Transform backend data to match frontend format
            const backendData = response.data.data;
            
            // Process complaints data from backend
            const complaintsData = await axios.get('http://localhost:5000/api/v1/complaints');
            if (complaintsData.data && complaintsData.data.status === 'success') {
              const formattedComplaints = complaintsData.data.data.map(c => ({
                id: c.id,
                text: c.text,
                category: c.category,
                status: c.status,
                createdAt: c.timestamp,
                resolvedAt: c.resolved_at,
                fieldWorker: c.field_worker_name,
                urgency: c.urgency
              }));
              
              setComplaints(formattedComplaints);
              setLoading(false);
              return;
            }
          }
          throw new Error('Invalid response format from backend');
        } catch (apiError) {
          console.error('API connection error:', apiError);
          // Fallback to mock data if API fails
          const mockData = generateMockData();
          setComplaints(mockData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in data handling:', error);
        // Still use mock data even if there's an error
        const mockData = generateMockData();
        setComplaints(mockData);
        setLoading(false);
      }
    };

    };

    fetchComplaints();
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('gramsetuUser');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="App">
        <AnimationBackground color="#64ffda" density={30} speed={0.3} />
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  if (user && user.role === 'citizen') {
    return (
      <div className="App">
        <AnimationBackground color="#64ffda" density={30} speed={0.3} />
        <CitizenDashboard user={user} onLogout={handleLogout} />
      </div>
    );
  }

  // For other roles (admin/officer/collector/national), show the main dashboard
  if (loading) return <div className="loading">Loading dashboard data...</div>;
    const statuses = ['Open', 'In Progress', 'Resolved', 'Escalated'];
    const categories = ['Water Supply', 'Road Maintenance', 'Electricity', 'Sanitation', 'Education'];
    
    return Array.from({ length: 20 }, (_, i) => {
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 10));
      
      const resolvedDate = Math.random() > 0.3 ? new Date() : null;
      if (resolvedDate) {
        resolvedDate.setDate(createdDate.getDate() + Math.floor(Math.random() * 5) + 1);
      }
      
      return {
        id: i + 1,
        text: `Sample complaint about ${categories[Math.floor(Math.random() * categories.length)].toLowerCase()}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: createdDate.toISOString(),
        resolvedAt: resolvedDate ? resolvedDate.toISOString() : null,
      };
    });
  };

  // Calculate statistics for dashboard
  const getStatistics = () => {
    if (!complaints.length) return null;
    
    const openComplaints = complaints.filter(c => c.status === 'Open' || c.status === 'In Progress' || c.status === 'Escalated');
    const resolvedComplaints = complaints.filter(c => c.status === 'Resolved');
    
    // Calculate average resolution time
    const resolutionTimes = complaints
      .filter(c => c.status === 'Resolved' && c.createdAt && c.resolvedAt)
      .map(c => {
        const created = new Date(c.createdAt);
        const resolved = new Date(c.resolvedAt);
        return (resolved - created) / (1000 * 60 * 60); // hours
      });
    
    const avgResolutionTime = resolutionTimes.length 
      ? resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length 
      : 0;
    
    // Find complaints older than 72 hours
    const oldComplaints = complaints.filter(c => {
      if (c.status === 'Resolved') return false;
      const created = new Date(c.createdAt);
      const now = new Date();
      const hoursDiff = (now - created) / (1000 * 60 * 60);
      return hoursDiff > 72;
    });
    
    return {
      total: complaints.length,
      open: openComplaints.length,
      resolved: resolvedComplaints.length,
      avgResolutionTime: avgResolutionTime.toFixed(1),
      oldComplaints: oldComplaints.length,
    };
  };

  const statistics = getStatistics();

  // Data for the bar chart
  const chartData = {
    labels: ['Open', 'Resolved'],
    datasets: [
      {
        label: 'Complaints Status',
        data: statistics ? [statistics.open, statistics.resolved] : [0, 0],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)'],
        borderColor: ['rgb(255, 99, 132)', 'rgb(75, 192, 192)'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  if (loading) return <div className="loading">Loading dashboard data...</div>;
  if (error) return <div className="error">{error}</div>;

  const toggleUI = () => {
    setShowModernUI(!showModernUI);
  };

  return (
    <div className="App">
      {/* Add animation background for all UIs */}
      <AnimationBackground color="#64ffda" density={30} speed={0.3} />
      
      {/* Header with user info and logout */}
      <div className="app-header">
        <div className="user-info">
          <span className="role-icon">
            {user?.role === 'admin' ? '⚙️' : 
             user?.role === 'officer' ? '👮' : 
             user?.role === 'collector' ? '🏛️' : 
             user?.role === 'national' ? '🇮🇳' : '👤'}
          </span>
          <span>Welcome, {user?.name || 'User'}</span>
        </div>
        <button className="btn-logout-header" onClick={handleLogout}>
          Logout
        </button>
      </div>
      
      {showModernUI ? (
        <>
          <FloatingObjects objectCount={10} />
          <div className="toggle-ui-container">
            <button className="toggle-ui-button" onClick={toggleUI}>
              Switch to Classic UI
            </button>
          </div>
          <ModernDashboard 
            complaints={complaints} 
            statistics={statistics} 
            chartData={chartData} 
            chartOptions={chartOptions} 
          />
        </>
      ) : (
        <>
          <div className="toggle-ui-container">
            <button className="toggle-ui-button" onClick={toggleUI}>
              Switch to Modern 3D UI
            </button>
          </div>
          <div className="dashboard">
            <header className="dashboard-header">
              <h1>🇮🇳 GramSetu AI</h1>
              <p>National Governance Intelligence Network - Empowering Every Voice</p>
            </header>

            {/* Voice Complaint Section */}
            <VoiceComplaint />

            <div className="dashboard-stats">
              <div className="stat-card fade-in">
                <h3>Total Complaints</h3>
                <p className="stat-value">{statistics?.total || 0}</p>
              </div>
              <div className="stat-card fade-in" style={{animationDelay: '0.1s'}}>
                <h3>Open Complaints</h3>
                <p className="stat-value">{statistics?.open || 0}</p>
              </div>
              <div className="stat-card fade-in" style={{animationDelay: '0.2s'}}>
                <h3>Resolved Complaints</h3>
                <p className="stat-value">{statistics?.resolved || 0}</p>
              </div>
              <div className="stat-card fade-in" style={{animationDelay: '0.3s'}}>
                <h3>Avg. Resolution Time</h3>
                <p className="stat-value">{statistics?.avgResolutionTime || 0}h</p>
              </div>
            </div>

            <div className="dashboard-row">
              <div className="dashboard-column">
                <div className="dashboard-card fade-in" style={{animationDelay: '0.4s'}}>
                  <h2>📊 Complaints Status</h2>
                  <div className="chart-container">
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                </div>
              </div>
              <div className="dashboard-column">
                <div className="dashboard-card fade-in" style={{animationDelay: '0.5s'}}>
                  <h2>🗺️ Heatmap Simulation</h2>
                  <HeatmapSimulation complaints={complaints} />
                </div>
              </div>
            </div>

            <div className="dashboard-row">
              <div className="dashboard-column">
                <div className="dashboard-card fade-in" style={{animationDelay: '0.6s'}}>
                  <h2>👮 Officer Tracker</h2>
                  <OfficerTracker complaints={complaints} avgResolutionTime={statistics?.avgResolutionTime} />
                </div>
              </div>
              <div className="dashboard-column">
                <div className="dashboard-card fade-in" style={{animationDelay: '0.7s'}}>
                  <h2>⚡ Auto-Escalation Monitor</h2>
                  <AutoEscalation complaints={complaints} oldComplaintsCount={statistics?.oldComplaints} />
                </div>
              </div>
            </div>

            <div className="dashboard-card full-width fade-in" style={{animationDelay: '0.8s'}}>
              <h2>📋 Complaints Table</h2>
              <ComplaintsTable complaints={complaints} />
            </div>
          </div>
        </>
      )}
      <style jsx>{`
        .toggle-ui-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
        }
        
        .toggle-ui-button {
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        
        .toggle-ui-button:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

export default App;