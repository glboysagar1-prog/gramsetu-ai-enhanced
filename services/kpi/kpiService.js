/**
 * KPI Service for GramSetu AI - Officer Accountability & Fraud Detection
 * Implements the 23 KPIs across 5 categories as defined in the monitoring framework
 */

class KPIService {
  constructor(db) {
    this.db = db;
  }

  /**
   * 1.1 Complaint Resolution Rate (CRR)
   * Percentage of assigned complaints resolved within SLA timeframe
   */
  async calculateCRR(officerId, date) {
    const query = `
      SELECT 
        COUNT(CASE WHEN status = 'resolved' AND resolved_at <= sla_deadline THEN 1 END) as resolved_within_sla,
        COUNT(*) as total_assigned
      FROM complaints 
      WHERE assigned_officer_id = $1 AND assigned_date = $2
    `;
    
    const result = await this.db.query(query, [officerId, date]);
    const { resolved_within_sla, total_assigned } = result.rows[0];
    
    const crr = total_assigned > 0 ? (resolved_within_sla / total_assigned) * 100 : 0;
    
    // Save to database
    await this.saveOfficerPerformanceMetric(officerId, date, 'crr', {
      complaints_resolved_within_sla: resolved_within_sla,
      total_complaints_assigned: total_assigned,
      crr: crr
    });
    
    // Check for red flag
    if (crr < 70) {
      await this.createFraudAlert(officerId, 'LOW_CRR', 'MEDIUM', 
        `Complaint Resolution Rate (${crr.toFixed(2)}%) is below threshold`);
    }
    
    return crr;
  }

  /**
   * 1.2 Average Resolution Time (ART)
   * Mean time from complaint assignment to verified closure
   */
  async calculateART(officerId, date) {
    const query = `
      SELECT 
        EXTRACT(EPOCH FROM (resolved_at - assigned_at)) as resolution_time_seconds
      FROM complaints 
      WHERE assigned_officer_id = $1 
        AND assigned_date = $2 
        AND status = 'resolved'
        AND resolved_at IS NOT NULL
        AND assigned_at IS NOT NULL
    `;
    
    const result = await this.db.query(query, [officerId, date]);
    const resolutionTimes = result.rows.map(row => parseFloat(row.resolution_time_seconds));
    
    const totalClosed = resolutionTimes.length;
    const totalResolutionTime = resolutionTimes.reduce((sum, time) => sum + time, 0);
    const art = totalClosed > 0 ? totalResolutionTime / totalClosed : 0;
    
    // Save to database
    await this.saveOfficerPerformanceMetric(officerId, date, 'art', {
      total_closed_complaints: totalClosed,
      total_resolution_time_seconds: totalResolutionTime,
      art_seconds: art
    });
    
    return art;
  }

  /**
   * 1.3 First Response Time (FRT)
   * Time taken for officer's first action after assignment
   */
  async calculateFRT(officerId, date) {
    const query = `
      SELECT 
        EXTRACT(EPOCH FROM (first_action_at - assigned_at)) as first_response_time_seconds
      FROM complaints 
      WHERE assigned_officer_id = $1 
        AND assigned_date = $2 
        AND first_action_at IS NOT NULL
        AND assigned_at IS NOT NULL
    `;
    
    const result = await this.db.query(query, [officerId, date]);
    const responseTimes = result.rows.map(row => parseFloat(row.first_response_time_seconds));
    
    const totalWithResponse = responseTimes.length;
    const totalResponseTime = responseTimes.reduce((sum, time) => sum + time, 0);
    const frt = totalWithResponse > 0 ? totalResponseTime / totalWithResponse : 0;
    
    // Save to database
    await this.saveOfficerPerformanceMetric(officerId, date, 'frt', {
      total_complaints_with_response: totalWithResponse,
      total_first_response_time_seconds: totalResponseTime,
      frt_seconds: frt
    });
    
    // Check for red flag
    if (frt > 48 * 3600) { // 48 hours in seconds
      await this.createFraudAlert(officerId, 'SLOW_FIRST_RESPONSE', 'MEDIUM', 
        `First Response Time (${(frt/3600).toFixed(2)} hours) exceeds threshold`);
    }
    
    return frt;
  }

  /**
   * 1.4 Citizen Satisfaction Score (CSS)
   * Average rating from post-resolution IVR feedback (1-5 scale)
   */
  async calculateCSS(officerId, date) {
    const query = `
      SELECT 
        SUM(satisfaction_score) as total_score,
        COUNT(*) as total_feedback
      FROM complaint_feedback 
      WHERE officer_id = $1 AND feedback_date = $2
    `;
    
    const result = await this.db.query(query, [officerId, date]);
    const { total_score, total_feedback } = result.rows[0];
    
    const css = total_feedback > 0 ? total_score / total_feedback : 0;
    
    // Save to database
    await this.saveOfficerPerformanceMetric(officerId, date, 'css', {
      total_resolved_complaints_with_feedback: total_feedback,
      total_satisfaction_score: total_score,
      css: css
    });
    
    // Check for red flag
    if (css > 0 && css < 3.0) {
      await this.createFraudAlert(officerId, 'LOW_SATISFACTION', 'MEDIUM', 
        `Citizen Satisfaction Score (${css.toFixed(2)}) is below threshold`);
    }
    
    return css;
  }

  /**
   * 1.5 Reopened Complaint Rate (RCR)
   * Percentage of "resolved" complaints reopened by citizens
   */
  async calculateRCR(officerId, date) {
    const query = `
      SELECT 
        COUNT(CASE WHEN status = 'reopened' THEN 1 END) as reopened_count,
        COUNT(*) as total_closed
      FROM complaints 
      WHERE assigned_officer_id = $1 
        AND closed_date = $2 
        AND status IN ('resolved', 'reopened')
    `;
    
    const result = await this.db.query(query, [officerId, date]);
    const { reopened_count, total_closed } = result.rows[0];
    
    const rcr = total_closed > 0 ? (reopened_count / total_closed) * 100 : 0;
    
    // Save to database
    await this.saveOfficerPerformanceMetric(officerId, date, 'rcr', {
      reopened_complaints: reopened_count,
      total_closed_complaints_for_rcr: total_closed,
      rcr: rcr
    });
    
    // Check for red flag
    if (rcr > 15) {
      await this.createFraudAlert(officerId, 'HIGH_RCR', 'HIGH', 
        `Reopened Complaint Rate (${rcr.toFixed(2)}%) exceeds threshold`);
    }
    
    return rcr;
  }

  /**
   * 1.6 Verification Compliance Rate (VCR)
   * Percentage of resolutions with geo-tagged proof uploaded
   */
  async calculateVCR(officerId, date) {
    const query = `
      SELECT 
        COUNT(CASE WHEN geo_proof_url IS NOT NULL THEN 1 END) as with_geo_proof,
        COUNT(*) as total_complaints
      FROM complaints 
      WHERE assigned_officer_id = $1 
        AND resolved_date = $2
    `;
    
    const result = await this.db.query(query, [officerId, date]);
    const { with_geo_proof, total_complaints } = result.rows[0];
    
    const vcr = total_complaints > 0 ? (with_geo_proof / total_complaints) * 100 : 0;
    
    // Save to database
    await this.saveOfficerPerformanceMetric(officerId, date, 'vcr', {
      complaints_with_geo_proof: with_geo_proof,
      total_complaints_for_vcr: total_complaints,
      vcr: vcr
    });
    
    // Check for red flag
    if (vcr < 90) {
      await this.createFraudAlert(officerId, 'LOW_VCR', 'HIGH', 
        `Verification Compliance Rate (${vcr.toFixed(2)}%) is below threshold`);
    }
    
    return vcr;
  }

  /**
   * 1.7 Weekend/Off-Hours Activity Rate
   * Percentage of officer actions logged during non-working hours
   */
  async calculateOffHoursActivityRate(officerId, date) {
    const query = `
      SELECT 
        COUNT(CASE WHEN EXTRACT(DOW FROM action_timestamp) IN (0, 6) 
                   OR EXTRACT(HOUR FROM action_timestamp) < 9 
                   OR EXTRACT(HOUR FROM action_timestamp) > 17 THEN 1 END) as off_hours_actions,
        COUNT(*) as total_actions
      FROM officer_actions 
      WHERE officer_id = $1 AND DATE(action_timestamp) = $2
    `;
    
    const result = await this.db.query(query, [officerId, date]);
    const { off_hours_actions, total_actions } = result.rows[0];
    
    const offHoursRate = total_actions > 0 ? (off_hours_actions / total_actions) * 100 : 0;
    
    // Save to database
    await this.saveOfficerPerformanceMetric(officerId, date, 'off_hours_activity_rate', {
      off_hours_actions: off_hours_actions,
      total_actions: total_actions,
      off_hours_activity_rate: offHoursRate
    });
    
    // Check for red flag
    if (offHoursRate > 40) {
      await this.createFraudAlert(officerId, 'HIGH_OFF_HOURS_ACTIVITY', 'HIGH', 
        `Off-Hours Activity Rate (${offHoursRate.toFixed(2)}%) exceeds threshold`);
    }
    
    return offHoursRate;
  }

  /**
   * 2.1 Velocity Anomaly Score (VAS)
   * Statistical outlier detection for unusually fast resolutions
   */
  async calculateVAS(officerId, date) {
    // Get officer's ART
    const officerART = await this.calculateART(officerId, date);
    
    // Get department average and standard deviation
    const deptQuery = `
      SELECT 
        AVG(art_seconds) as mean_art,
        STDDEV(art_seconds) as std_dev_art
      FROM officer_performance_metrics 
      WHERE date = $1
    `;
    
    const deptResult = await this.db.query(deptQuery, [date]);
    const { mean_art, std_dev_art } = deptResult.rows[0];
    
    // Calculate Z-score
    const zScore = std_dev_art > 0 ? (officerART - mean_art) / std_dev_art : 0;
    
    // Save to database
    await this.saveFraudDetectionIndicator(officerId, date, 'vas', {
      officer_art_seconds: officerART,
      department_mean_art_seconds: mean_art,
      department_std_dev_art_seconds: std_dev_art,
      z_score: zScore
    });
    
    // Check for red flag
    if (zScore < -2.5) {
      await this.createFraudAlert(officerId, 'VELOCITY_ANOMALY', 'CRITICAL', 
        `Velocity Anomaly detected (Z-score: ${zScore.toFixed(2)})`);
    }
    
    return zScore;
  }

  /**
   * Save officer performance metric to database
   */
  async saveOfficerPerformanceMetric(officerId, date, metricType, values) {
    const query = `
      INSERT INTO officer_performance_metrics (
        officer_id, date, ${Object.keys(values).join(', ')}
      ) VALUES (
        $1, $2, ${Object.values(values).map((_, i) => $${i+3}).join(', ')}
      )
      ON CONFLICT (officer_id, date) 
      DO UPDATE SET 
        ${Object.keys(values).map((key, i) => `${key} = $${i+3}`).join(', ')},
        updated_at = CURRENT_TIMESTAMP
    `;
    
    const params = [officerId, date, ...Object.values(values)];
    await this.db.query(query, params);
  }

  /**
   * Save fraud detection indicator to database
   */
  async saveFraudDetectionIndicator(officerId, date, indicatorType, values) {
    const query = `
      INSERT INTO fraud_detection_indicators (
        officer_id, date, ${Object.keys(values).join(', ')}
      ) VALUES (
        $1, $2, ${Object.values(values).map((_, i) => $${i+3}).join(', ')}
      )
      ON CONFLICT (officer_id, date) 
      DO UPDATE SET 
        ${Object.keys(values).map((key, i) => `${key} = $${i+3}`).join(', ')},
        updated_at = CURRENT_TIMESTAMP
    `;
    
    const params = [officerId, date, ...Object.values(values)];
    await this.db.query(query, params);
  }

  /**
   * Create fraud alert
   */
  async createFraudAlert(officerId, alertType, severity, description) {
    const query = `
      INSERT INTO fraud_alerts (officer_id, alert_type, severity, description)
      VALUES ($1, $2, $3, $4)
    `;
    
    await this.db.query(query, [officerId, alertType, severity, description]);
  }

  /**
   * Calculate all KPIs for an officer on a specific date
   */
  async calculateAllKPIsForOfficer(officerId, date) {
    await this.calculateCRR(officerId, date);
    await this.calculateART(officerId, date);
    await this.calculateFRT(officerId, date);
    await this.calculateCSS(officerId, date);
    await this.calculateRCR(officerId, date);
    await this.calculateVCR(officerId, date);
    await this.calculateOffHoursActivityRate(officerId, date);
    await this.calculateVAS(officerId, date);
    
    // Additional KPI calculations would go here
  }
}

module.exports = KPIService;
