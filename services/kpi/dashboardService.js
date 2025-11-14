/**
 * Dashboard Service for GramSetu AI
 * Provides data for the monitoring dashboards
 */

class DashboardService {
  constructor(db) {
    this.db = db;
  }

  /**
   * Get executive command center data (State/Central level)
   */
  async getExecutiveDashboardData() {
    const data = {};
    
    // Integrity Heatmap: Color-coded district performance
    const heatmapQuery = `
      SELECT 
        d.district_name,
        AVG(opm.crr) as avg_crr,
        AVG(opm.css) as avg_css,
        AVG(fdi.z_score) as avg_z_score,
        COUNT(fa.id) as fraud_alerts
      FROM districts d
      LEFT JOIN officers o ON d.id = o.district_id
      LEFT JOIN officer_performance_metrics opm ON o.id = opm.officer_id
      LEFT JOIN fraud_detection_indicators fdi ON o.id = fdi.officer_id AND opm.date = fdi.date
      LEFT JOIN fraud_alerts fa ON o.id = fa.officer_id
      WHERE opm.date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY d.district_name
    `;
    
    const heatmapResult = await this.db.query(heatmapQuery);
    data.integrityHeatmap = heatmapResult.rows.map(row => ({
      district: row.district_name,
      performance: this.calculateDistrictPerformance(row),
      color: this.getPerformanceColor(row)
    }));
    
    // Officer Leaderboard: Top 10 best/worst performers
    const leaderboardQuery = `
      SELECT 
        o.id,
        o.name,
        d.district_name,
        AVG(opm.crr) as avg_crr,
        AVG(opm.art_seconds) as avg_art,
        AVG(opm.css) as avg_css,
        AVG(opm.rcr) as avg_rcr,
        COUNT(fa.id) as fraud_alerts
      FROM officers o
      JOIN districts d ON o.district_id = d.id
      LEFT JOIN officer_performance_metrics opm ON o.id = opm.officer_id
      LEFT JOIN fraud_alerts fa ON o.id = fa.officer_id AND fa.status = 'OPEN'
      WHERE opm.date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY o.id, o.name, d.district_name
      ORDER BY AVG(opm.crr) DESC, AVG(opm.css) DESC
    `;
    
    const leaderboardResult = await this.db.query(leaderboardQuery);
    const allOfficers = leaderboardResult.rows;
    
    data.topPerformers = allOfficers.slice(0, 10);
    data.worstPerformers = allOfficers.slice(-10).reverse();
    
    // Fraud Alert Feed: Live stream of anomaly detections
    const alertFeedQuery = `
      SELECT 
        fa.id,
        fa.officer_id,
        o.name as officer_name,
        d.district_name,
        fa.alert_type,
        fa.severity,
        fa.description,
        fa.created_at
      FROM fraud_alerts fa
      JOIN officers o ON fa.officer_id = o.id
      JOIN districts d ON o.district_id = d.id
      WHERE fa.created_at >= CURRENT_DATE - INTERVAL '7 days'
      ORDER BY fa.created_at DESC
      LIMIT 50
    `;
    
    const alertFeedResult = await this.db.query(alertFeedQuery);
    data.fraudAlertFeed = alertFeedResult.rows;
    
    // Budget Flow Sankey Diagram
    const budgetQuery = `
      SELECT 
        d.district_name,
        SUM(dek.allocated_funds) as allocated,
        SUM(dek.utilized_funds) as utilized,
        SUM(dek.addressed_issues) as issues_addressed
      FROM districts d
      LEFT JOIN departmental_efficiency_kpis dek ON d.id = dek.department_id
      WHERE dek.date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY d.district_name
    `;
    
    const budgetResult = await this.db.query(budgetQuery);
    data.budgetFlow = budgetResult.rows;
    
    return data;
  }

  /**
   * Get district officer dashboard data
   */
  async getDistrictDashboardData(districtId) {
    const data = {};
    
    // Team Performance Matrix
    const teamPerformanceQuery = `
      SELECT 
        o.id,
        o.name,
        AVG(opm.crr) as crr,
        AVG(opm.art_seconds) as art_seconds,
        AVG(opm.css) as css,
        AVG(opm.rcr) as rcr,
        AVG(opm.vcr) as vcr,
        COUNT(fa.id) as open_fraud_alerts
      FROM officers o
      LEFT JOIN officer_performance_metrics opm ON o.id = opm.officer_id
      LEFT JOIN fraud_alerts fa ON o.id = fa.officer_id AND fa.status = 'OPEN'
      WHERE o.district_id = $1 
        AND opm.date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY o.id, o.name
    `;
    
    const teamPerformanceResult = await this.db.query(teamPerformanceQuery, [districtId]);
    data.teamPerformance = teamPerformanceResult.rows;
    
    // Complaint Lifecycle Funnel
    const funnelQuery = `
      SELECT 
        COUNT(*) as filed,
        COUNT(CASE WHEN status IN ('verified', 'assigned', 'resolved') THEN 1 END) as verified,
        COUNT(CASE WHEN status IN ('assigned', 'resolved') THEN 1 END) as assigned,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved
      FROM complaints c
      JOIN officers o ON c.assigned_officer_id = o.id
      WHERE o.district_id = $1 
        AND c.filed_date >= CURRENT_DATE - INTERVAL '30 days'
    `;
    
    const funnelResult = await this.db.query(funnelQuery, [districtId]);
    data.complaintLifecycle = funnelResult.rows[0];
    
    // Fraud Risk Radar Chart
    const radarQuery = `
      SELECT 
        o.id,
        o.name,
        AVG(fdi.z_score) as velocity_anomaly,
        AVG(fdi.cosine_similarity_score) as duplicate_pattern,
        AVG(fdi.gbd_percentage) as ghost_beneficiary,
        AVG(fdi.off_hours_approval_rate) as off_hours_approval,
        AVG(opm.off_hours_activity_rate) as off_hours_activity,
        AVG(fdi.gfvr) as geofence_violation
      FROM officers o
      LEFT JOIN fraud_detection_indicators fdi ON o.id = fdi.officer_id
      LEFT JOIN officer_performance_metrics opm ON o.id = opm.officer_id AND fdi.date = opm.date
      WHERE o.district_id = $1 
        AND fdi.date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY o.id, o.name
    `;
    
    const radarResult = await this.db.query(radarQuery, [districtId]);
    data.fraudRiskRadar = radarResult.rows;
    
    // Predictive Alerts
    const predictiveQuery = `
      SELECT 
        o.id,
        o.name,
        fa.alert_type,
        fa.description,
        fa.created_at,
        fr.risk_score
      FROM officers o
      JOIN fraud_alerts fa ON o.id = fa.officer_id
      LEFT JOIN fraud_risk_scores fr ON o.id = fr.officer_id
      WHERE o.district_id = $1 
        AND fa.created_at >= CURRENT_DATE - INTERVAL '7 days'
        AND fa.status = 'OPEN'
      ORDER BY fa.created_at DESC
    `;
    
    const predictiveResult = await this.db.query(predictiveQuery, [districtId]);
    data.predictiveAlerts = predictiveResult.rows;
    
    return data;
  }

  /**
   * Get individual officer dashboard data
   */
  async getOfficerDashboardData(officerId) {
    const data = {};
    
    // Personal KPI Scorecard
    const kpiQuery = `
      SELECT 
        AVG(crr) as crr,
        AVG(art_seconds) as art_seconds,
        AVG(frt_seconds) as frt_seconds,
        AVG(css) as css,
        AVG(rcr) as rcr,
        AVG(vcr) as vcr,
        AVG(off_hours_activity_rate) as off_hours_activity_rate
      FROM officer_performance_metrics
      WHERE officer_id = $1 
        AND date >= CURRENT_DATE - INTERVAL '30 days'
    `;
    
    const kpiResult = await this.db.query(kpiQuery, [officerId]);
    data.personalKPIs = kpiResult.rows[0];
    
    // Pending Task Queue
    const pendingQuery = `
      SELECT 
        id,
        complaint_type,
        filed_date,
        sla_deadline,
        EXTRACT(EPOCH FROM (sla_deadline - NOW())) as seconds_until_deadline
      FROM complaints
      WHERE assigned_officer_id = $1 
        AND status IN ('assigned', 'in_progress')
      ORDER BY sla_deadline ASC
    `;
    
    const pendingResult = await this.db.query(pendingQuery, [officerId]);
    data.pendingTasks = pendingResult.rows.map(task => ({
      ...task,
      urgency: this.calculateTaskUrgency(task.seconds_until_deadline)
    }));
    
    // Peer Comparison
    const peerQuery = `
      SELECT 
        AVG(crr) as dept_avg_crr,
        AVG(css) as dept_avg_css,
        AVG(rcr) as dept_avg_rcr
      FROM officer_performance_metrics opm
      JOIN officers o ON opm.officer_id = o.id
      WHERE o.district_id = (SELECT district_id FROM officers WHERE id = $1)
        AND opm.date >= CURRENT_DATE - INTERVAL '30 days'
    `;
    
    const peerResult = await this.db.query(peerQuery, [officerId]);
    data.peerComparison = peerResult.rows[0];
    
    // Recent Fraud Alerts
    const alertQuery = `
      SELECT 
        id,
        alert_type,
        severity,
        description,
        created_at
      FROM fraud_alerts
      WHERE officer_id = $1 
        AND created_at >= CURRENT_DATE - INTERVAL '30 days'
      ORDER BY created_at DESC
      LIMIT 5
    `;
    
    const alertResult = await this.db.query(alertQuery, [officerId]);
    data.recentAlerts = alertResult.rows;
    
    return data;
  }

  /**
   * Calculate district performance score
   */
  calculateDistrictPerformance(row) {
    // Simple weighted average
    const crrScore = (row.avg_crr || 0) * 0.3;
    const cssScore = (row.avg_css || 0) * 20 * 0.2; // Scale 5-point to 100-point
    const zScore = (2.5 + (row.avg_z_score || 0)) * 20 * 0.3; // Normalize z-score
    const fraudScore = Math.max(0, 100 - (row.fraud_alerts || 0) * 2) * 0.2;
    
    return crrScore + cssScore + zScore + fraudScore;
  }

  /**
   * Get performance color based on metrics
   */
  getPerformanceColor(row) {
    const performance = this.calculateDistrictPerformance(row);
    
    if (performance >= 80) return 'green';
    if (performance >= 60) return 'yellow';
    return 'red';
  }

  /**
   * Calculate task urgency
   */
  calculateTaskUrgency(secondsUntilDeadline) {
    if (secondsUntilDeadline < 0) return 'overdue';
    if (secondsUntilDeadline < 3600) return 'critical'; // < 1 hour
    if (secondsUntilDeadline < 86400) return 'high'; // < 1 day
    if (secondsUntilDeadline < 604800) return 'medium'; // < 1 week
    return 'low';
  }
}

module.exports = DashboardService;
