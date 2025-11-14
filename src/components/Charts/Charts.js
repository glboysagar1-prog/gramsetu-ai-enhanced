import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Charts.css';

// Color schemes - Digital India theme
const COLORS = {
  primary: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd'],
  accent: ['#fbbf24', '#f59e0b', '#d97706', '#b45309'],
  success: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  danger: ['#ef4444', '#f87171', '#fca5a5', '#fecaca'],
  mixed: ['#1e40af', '#fbbf24', '#10b981', '#ef4444', '#8b5cf6', '#ec4899']
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="tooltip-value" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Complaints Trend Line Chart
export const ComplaintsTrendChart = ({ data }) => {
  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            stroke="#64748b"
            style={{ fontSize: '0.875rem' }}
          />
          <YAxis 
            stroke="#64748b"
            style={{ fontSize: '0.875rem' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '0.875rem', fontWeight: 600 }}
          />
          <Line 
            type="monotone" 
            dataKey="complaints" 
            stroke="#1e40af" 
            strokeWidth={3}
            dot={{ fill: '#1e40af', r: 5 }}
            activeDot={{ r: 7 }}
            name="Total Complaints"
          />
          <Line 
            type="monotone" 
            dataKey="resolved" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 5 }}
            name="Resolved"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Category Distribution Pie Chart
export const CategoryPieChart = ({ data }) => {
  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS.mixed[index % COLORS.mixed.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Status Bar Chart
export const StatusBarChart = ({ data }) => {
  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="status" 
            stroke="#64748b"
            style={{ fontSize: '0.875rem' }}
          />
          <YAxis 
            stroke="#64748b"
            style={{ fontSize: '0.875rem' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '0.875rem', fontWeight: 600 }} />
          <Bar 
            dataKey="count" 
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
            name="Complaints"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Resolution Time Area Chart
export const ResolutionTimeChart = ({ data }) => {
  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            stroke="#64748b"
            style={{ fontSize: '0.875rem' }}
          />
          <YAxis 
            stroke="#64748b"
            style={{ fontSize: '0.875rem' }}
            label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '0.875rem', fontWeight: 600 }} />
          <Area 
            type="monotone" 
            dataKey="avgTime" 
            stroke="#fbbf24" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorTime)"
            name="Avg. Resolution Time (hrs)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Officer Performance Bar Chart
export const OfficerPerformanceChart = ({ data }) => {
  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            type="number"
            stroke="#64748b"
            style={{ fontSize: '0.875rem' }}
          />
          <YAxis 
            dataKey="officer" 
            type="category"
            stroke="#64748b"
            style={{ fontSize: '0.875rem' }}
            width={120}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '0.875rem', fontWeight: 600 }} />
          <Bar 
            dataKey="resolved" 
            fill="#10b981"
            radius={[0, 8, 8, 0]}
            name="Resolved"
          />
          <Bar 
            dataKey="pending" 
            fill="#fbbf24"
            radius={[0, 8, 8, 0]}
            name="Pending"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Urgency Distribution Chart
export const UrgencyChart = ({ data }) => {
  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label
          >
            {data.map((entry, index) => {
              const colors = {
                High: '#ef4444',
                Medium: '#fbbf24',
                Low: '#10b981'
              };
              return <Cell key={`cell-${index}`} fill={colors[entry.name] || '#3b82f6'} />;
            })}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Export all charts
export default {
  ComplaintsTrendChart,
  CategoryPieChart,
  StatusBarChart,
  ResolutionTimeChart,
  OfficerPerformanceChart,
  UrgencyChart
};
