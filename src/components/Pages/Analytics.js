import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ComplaintsTrendChart, 
  CategoryPieChart, 
  StatusBarChart,
  ResolutionTimeChart,
  OfficerPerformanceChart,
  UrgencyChart 
} from '../Charts/Charts';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import Skeleton from '../UI/Skeleton';
import './Analytics.css';

const Analytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 15000);
    return () => clearInterval(interval);
  }, [timeRange, user.role]);

  const fetchAnalyticsData = () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      // Role-specific analytics data
      const mockData = {
      citizen: {
        myComplaintsData: [
          { month: 'Jan', complaints: 2 },
          { month: 'Feb', complaints: 1 },
          { month: 'Mar', complaints: 3 },
          { month: 'Apr', complaints: 1 },
          { month: 'May', complaints: 4 },
          { month: 'Jun', complaints: 2 }
        ],
        categoryData: [
          { name: 'Water', value: 5 },
          { name: 'Roads', value: 3 },
          { name: 'Electricity', value: 4 },
          { name: 'Sanitation', value: 2 }
        ],
        resolutionData: [
          { status: 'Resolved', count: 10 },
          { status: 'In Progress', count: 3 },
          { status: 'Pending', count: 1 }
        ]
      },
      field: {
        tasksData: [
          { day: 'Mon', completed: 12, assigned: 15 },
          { day: 'Tue', completed: 14, assigned: 16 },
          { day: 'Wed', completed: 10, assigned: 14 },
          { day: 'Thu', completed: 16, assigned: 18 },
          { day: 'Fri', completed: 13, assigned: 15 }
        ],
        performanceData: [
          { category: 'Water', avgTime: 2.5 },
          { category: 'Roads', avgTime: 4.2 },
          { category: 'Electricity', avgTime: 1.8 },
          { category: 'Sanitation', avgTime: 3.1 }
        ]
      },
      district: {
        wardData: [
          { ward: 'Ward 1', complaints: 45, resolved: 38 },
          { ward: 'Ward 2', complaints: 52, resolved: 44 },
          { ward: 'Ward 3', complaints: 38, resolved: 35 },
          { ward: 'Ward 4', complaints: 61, resolved: 52 }
        ],
        urgencyData: [
          { priority: 'Critical', count: 12 },
          { priority: 'High', count: 28 },
          { priority: 'Medium', count: 45 },
          { priority: 'Low', count: 67 }
        ]
      },
      state: {
        districtData: [
          { district: 'Mumbai', score: 87 },
          { district: 'Pune', score: 82 },
          { district: 'Nagpur', score: 76 },
          { district: 'Nashik', score: 79 }
        ],
        trendData: [
          { month: 'Jan', integrity: 75 },
          { month: 'Feb', integrity: 78 },
          { month: 'Mar', integrity: 82 },
          { month: 'Apr', integrity: 80 },
          { month: 'May', integrity: 85 },
          { month: 'Jun', integrity: 87 }
        ]
      },
      national: {
        stateData: [
          { state: 'Maharashtra', compliance: 92 },
          { state: 'Karnataka', compliance: 88 },
          { state: 'Tamil Nadu', compliance: 85 },
          { state: 'Gujarat', compliance: 90 },
          { state: 'Rajasthan', compliance: 82 }
        ],
        nationalTrend: [
          { quarter: 'Q1', efficiency: 78 },
          { quarter: 'Q2', efficiency: 82 },
          { quarter: 'Q3', efficiency: 85 },
          { quarter: 'Q4', efficiency: 88 }
        ]
      }
    };

    setAnalyticsData(mockData[user.role] || {});
      setLoading(false);
    }, 800); // Simulate 800ms API delay
  };

  const getAnalyticsSummary = () => {
    const summaries = {
      citizen: [
        { icon: TrendingUp, label: 'Total Complaints', value: '14', change: '+2 this month' },
        { icon: Activity, label: 'Resolved', value: '10', change: '71% resolution' },
        { icon: BarChart3, label: 'Avg Resolution', value: '3.2 days', change: '-0.5 days' },
        { icon: PieChart, label: 'Active Issues', value: '4', change: '2 pending' }
      ],
      field: [
        { icon: TrendingUp, label: 'Tasks Completed', value: '65', change: '+12 this week' },
        { icon: Activity, label: 'Success Rate', value: '87%', change: '+3%' },
        { icon: BarChart3, label: 'Avg Response', value: '2.8 hrs', change: '-0.3 hrs' },
        { icon: PieChart, label: 'Pending Tasks', value: '8', change: '3 urgent' }
      ],
      district: [
        { icon: TrendingUp, label: 'Ward Efficiency', value: '84%', change: '+5%' },
        { icon: Activity, label: 'Active Cases', value: '152', change: '-8 today' },
        { icon: BarChart3, label: 'Officer Utilization', value: '76%', change: 'Optimal' },
        { icon: PieChart, label: 'Escalations', value: '12', change: '3 resolved' }
      ],
      state: [
        { icon: TrendingUp, label: 'Integrity Index', value: '87', change: '+2 points' },
        { icon: Activity, label: 'Districts', value: '36', change: '32 compliant' },
        { icon: BarChart3, label: 'Fund Utilization', value: '91%', change: '+4%' },
        { icon: PieChart, label: 'Risk Alerts', value: '5', change: '2 critical' }
      ],
      national: [
        { icon: TrendingUp, label: 'National Compliance', value: '88%', change: '+3%' },
        { icon: Activity, label: 'Active States', value: '28', change: 'All reporting' },
        { icon: BarChart3, label: 'Governance Score', value: '85', change: '+2 points' },
        { icon: PieChart, label: 'Policy Gaps', value: '7', change: '3 addressed' }
      ]
    };

    return summaries[user.role] || [];
  };

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div>
          <h1>📊 Analytics Dashboard</h1>
          <p>Comprehensive insights and data visualization for {user.name}</p>
        </div>
        <div className="time-range-selector">
          <button 
            className={timeRange === '7d' ? 'active' : ''}
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </button>
          <button 
            className={timeRange === '30d' ? 'active' : ''}
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </button>
          <button 
            className={timeRange === '90d' ? 'active' : ''}
            onClick={() => setTimeRange('90d')}
          >
            90 Days
          </button>
          <button 
            className={timeRange === '1y' ? 'active' : ''}
            onClick={() => setTimeRange('1y')}
          >
            1 Year
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="analytics-summary">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton.KPICard key={i} />
          ))
        ) : (
          getAnalyticsSummary().map((item, index) => (
            <div key={index} className="summary-card">
              <div className="summary-icon">
                <item.icon size={24} />
              </div>
              <div className="summary-content">
                <span className="summary-label">{item.label}</span>
                <h3 className="summary-value">{item.value}</h3>
                <span className="summary-change">{item.change}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Charts Grid */}
      <div className="analytics-charts-grid">
        {loading ? (
          <>
            <div className="chart-container full-width">
              <h3>Loading...</h3>
              <Skeleton.Chart height="300px" />
            </div>
            <div className="chart-container">
              <h3>Loading...</h3>
              <Skeleton.Chart height="250px" />
            </div>
            <div className="chart-container">
              <h3>Loading...</h3>
              <Skeleton.Chart height="250px" />
            </div>
          </>
        ) : (
          <>
        {user.role === 'citizen' && (
          <>
            <div className="chart-container full-width">
              <h3>My Complaints Trend</h3>
              <ComplaintsTrendChart data={analyticsData.myComplaintsData || []} />
            </div>
            <div className="chart-container">
              <h3>Category Distribution</h3>
              <CategoryPieChart data={analyticsData.categoryData || []} />
            </div>
            <div className="chart-container">
              <h3>Resolution Status</h3>
              <StatusBarChart data={analyticsData.resolutionData || []} />
            </div>
          </>
        )}

        {user.role === 'field' && (
          <>
            <div className="chart-container full-width">
              <h3>Task Completion Trend</h3>
              <ComplaintsTrendChart data={analyticsData.tasksData || []} />
            </div>
            <div className="chart-container">
              <h3>Performance by Category</h3>
              <ResolutionTimeChart data={analyticsData.performanceData || []} />
            </div>
          </>
        )}

        {user.role === 'district' && (
          <>
            <div className="chart-container full-width">
              <h3>Ward Performance</h3>
              <OfficerPerformanceChart data={analyticsData.wardData || []} />
            </div>
            <div className="chart-container">
              <h3>Urgency Distribution</h3>
              <UrgencyChart data={analyticsData.urgencyData || []} />
            </div>
          </>
        )}

        {user.role === 'state' && (
          <>
            <div className="chart-container full-width">
              <h3>Integrity Index Trend</h3>
              <ComplaintsTrendChart data={analyticsData.trendData || []} />
            </div>
            <div className="chart-container">
              <h3>District Scores</h3>
              <StatusBarChart data={analyticsData.districtData || []} />
            </div>
          </>
        )}

        {user.role === 'national' && (
          <>
            <div className="chart-container full-width">
              <h3>National Efficiency Trend</h3>
              <ComplaintsTrendChart data={analyticsData.nationalTrend || []} />
            </div>
            <div className="chart-container">
              <h3>State Compliance Scores</h3>
              <OfficerPerformanceChart data={analyticsData.stateData || []} />
            </div>
          </>
        )}
          </>
        )}
      </div>

      {/* Export Options */}
      <div className="analytics-actions">
        <button className="export-btn">📥 Export as PDF</button>
        <button className="export-btn">📊 Export as Excel</button>
        <button className="export-btn">📧 Email Report</button>
      </div>
    </div>
  );
};

export default Analytics;
