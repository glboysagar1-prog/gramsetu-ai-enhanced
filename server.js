const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for dashboard data (mock implementation)
app.get('/api/dashboard', (req, res) => {
  // Mock data for preview
  const mockData = {
    integrityHeatmap: [
      { district: 'Mumbai', performance: 92, color: 'green' },
      { district: 'Delhi', performance: 76, color: 'yellow' },
      { district: 'Bangalore', performance: 88, color: 'green' },
      { district: 'Chennai', performance: 65, color: 'red' },
      { district: 'Kolkata', performance: 81, color: 'green' },
      { district: 'Hyderabad', performance: 73, color: 'yellow' },
      { district: 'Pune', performance: 85, color: 'green' },
      { district: 'Ahmedabad', performance: 78, color: 'yellow' }
    ],
    topPerformers: [
      { id: 1, name: 'Officer A', district: 'Mumbai', avg_crr: 98, avg_css: 4.8, fraud_alerts: 0 },
      { id: 2, name: 'Officer B', district: 'Bangalore', avg_crr: 96, avg_css: 4.7, fraud_alerts: 1 },
      { id: 3, name: 'Officer C', district: 'Pune', avg_crr: 95, avg_css: 4.6, fraud_alerts: 0 },
      { id: 4, name: 'Officer D', district: 'Hyderabad', avg_crr: 94, avg_css: 4.5, fraud_alerts: 2 },
      { id: 5, name: 'Officer E', district: 'Mumbai', avg_crr: 93, avg_css: 4.4, fraud_alerts: 0 }
    ],
    worstPerformers: [
      { id: 6, name: 'Officer F', district: 'Chennai', avg_crr: 42, avg_css: 2.1, fraud_alerts: 8 },
      { id: 7, name: 'Officer G', district: 'Delhi', avg_crr: 48, avg_css: 2.3, fraud_alerts: 7 },
      { id: 8, name: 'Officer H', district: 'Kolkata', avg_crr: 55, avg_css: 2.5, fraud_alerts: 5 },
      { id: 9, name: 'Officer I', district: 'Chennai', avg_crr: 58, avg_css: 2.7, fraud_alerts: 4 },
      { id: 10, name: 'Officer J', district: 'Delhi', avg_crr: 62, avg_css: 2.9, fraud_alerts: 3 }
    ],
    fraudAlertFeed: [
      { id: 1, officer_name: 'Officer F', district: 'Chennai', alert_type: 'HIGH_RCR', severity: 'HIGH', description: 'Reopened Complaint Rate (22%) exceeds threshold', created_at: '2023-06-15T10:30:00Z' },
      { id: 2, officer_name: 'Officer G', district: 'Delhi', alert_type: 'VELOCITY_ANOMALY', severity: 'CRITICAL', description: 'Velocity Anomaly detected (Z-score: -3.2)', created_at: '2023-06-15T09:15:00Z' },
      { id: 3, officer_name: 'Officer K', district: 'Bangalore', alert_type: 'LOW_CRR', severity: 'MEDIUM', description: 'Complaint Resolution Rate (68%) is below threshold', created_at: '2023-06-15T08:45:00Z' },
      { id: 4, officer_name: 'Officer L', district: 'Mumbai', alert_type: 'HIGH_OFF_HOURS_ACTIVITY', severity: 'HIGH', description: 'Off-Hours Activity Rate (45%) exceeds threshold', created_at: '2023-06-15T07:20:00Z' },
      { id: 5, officer_name: 'Officer M', district: 'Hyderabad', alert_type: 'DUPLICATE_ACTION_PATTERN', severity: 'HIGH', description: 'Duplicate action pattern detected (similarity: 0.96)', created_at: '2023-06-15T06:50:00Z' }
    ],
    budgetFlow: [
      { district: 'Mumbai', allocated: 5000000, utilized: 4750000, issues_addressed: 1250 },
      { district: 'Delhi', allocated: 4500000, utilized: 4050000, issues_addressed: 1100 },
      { district: 'Bangalore', allocated: 4000000, utilized: 3800000, issues_addressed: 1050 },
      { district: 'Chennai', allocated: 3500000, utilized: 2975000, issues_addressed: 875 },
      { district: 'Kolkata', allocated: 3000000, utilized: 2700000, issues_addressed: 800 }
    ]
  };
  
  res.json(mockData);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
