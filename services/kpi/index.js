/**
 * Main entry point for GramSetu AI KPI Framework
 */

const SchedulerService = require('./schedulerService');

// Initialize with database connection
// In a real implementation, this would be your actual database connection
const db = {
  query: async (sql, params) => {
    // Mock database query implementation
    console.log('Executing query:', sql, params);
    return { rows: [] };
  }
};

// Create and start scheduler service
const schedulerService = new SchedulerService(db);

// Start scheduled jobs
schedulerService.start();

// Export services for external use
module.exports = {
  KPIService: require('./kpiService'),
  FraudDetectionService: require('./fraudDetectionService'),
  DashboardService: require('./dashboardService'),
  SchedulerService
};
