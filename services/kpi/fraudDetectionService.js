/**
 * Fraud Detection Service for GramSetu AI
 * Implements the multi-layer anomaly detection pipeline
 */

const { IsolationForest } = require('ml-isolation-forest');

class FraudDetectionService {
  constructor(db, kpiService) {
    this.db = db;
    this.kpiService = kpiService;
  }

  /**
   * Layer 1: Rule-Based Filters (Real-Time)
   */
  async applyRuleBasedFilters(officerId, complaintId) {
    const alerts = [];
    
    // Get complaint details
    const complaintQuery = `
      SELECT resolution_time_seconds, fund_amount, officer_remarks, resolution_timestamp
      FROM complaints 
      WHERE id = $1
    `;
    
    const complaintResult = await this.db.query(complaintQuery, [complaintId]);
    const complaint = complaintResult.rows[0];
    
    // Rule 1: Resolution in <5 minutes for infrastructure complaints
    if (complaint.resolution_time_seconds < 300) { // 5 minutes in seconds
      alerts.push({
        officerId,
        alertType: 'IMPOSSIBLE_RESOLUTION',
        severity: 'HIGH',
        description: `Complaint resolved in ${complaint.resolution_time_seconds} seconds`
      });
    }
    
    // Rule 2: Fund approval >₹1 lakh without secondary authorization
    if (complaint.fund_amount > 100000) {
      const authQuery = `
        SELECT COUNT(*) as auth_count 
        FROM fund_approvals 
        WHERE complaint_id = $1 AND status = 'approved'
      `;
      
      const authResult = await this.db.query(authQuery, [complaintId]);
      if (authResult.rows[0].auth_count < 2) {
        alerts.push({
          officerId,
          alertType: 'INSUFFICIENT_AUTHORIZATION',
          severity: 'HIGH',
          description: `Fund approval of ₹${complaint.fund_amount} lacks secondary authorization`
        });
      }
    }
    
    // Rule 3: 10+ complaints closed by same officer within 1-hour window
    const velocityQuery = `
      SELECT COUNT(*) as recent_complaints
      FROM complaints 
      WHERE assigned_officer_id = $1 
        AND resolution_timestamp >= $2 - INTERVAL '1 hour'
        AND resolution_timestamp <= $2
    `;
    
    const velocityResult = await this.db.query(velocityQuery, [officerId, complaint.resolution_timestamp]);
    if (velocityResult.rows[0].recent_complaints >= 10) {
      alerts.push({
        officerId,
        alertType: 'VELOCITY_ANOMALY',
        severity: 'CRITICAL',
        description: `${velocityResult.rows[0].recent_complaints} complaints resolved within 1 hour`
      });
    }
    
    // Rule 4: Officer remarks <20 characters
    if (complaint.officer_remarks && complaint.officer_remarks.length < 20) {
      alerts.push({
        officerId,
        alertType: 'INSUFFICIENT_DOCUMENTATION',
        severity: 'MEDIUM',
        description: `Officer remarks only ${complaint.officer_remarks.length} characters long`
      });
    }
    
    // Create alerts
    for (const alert of alerts) {
      await this.kpiService.createFraudAlert(
        alert.officerId, 
        alert.alertType, 
        alert.severity, 
        alert.description
      );
    }
    
    return alerts;
  }

  /**
   * Layer 2: Statistical Outlier Detection (Hourly)
   */
  async detectStatisticalOutliers() {
    // Get all officer metrics for the past hour
    const query = `
      SELECT officer_id, crr, art_seconds, css, rcr, vcr
      FROM officer_performance_metrics 
      WHERE date >= CURRENT_DATE - INTERVAL '1 day'
    `;
    
    const result = await this.db.query(query);
    const officerMetrics = result.rows;
    
    if (officerMetrics.length === 0) return [];
    
    // Prepare data for isolation forest
    const data = officerMetrics.map(metric => [
      metric.crr || 0,
      metric.art_seconds || 0,
      metric.css || 0,
      metric.rcr || 0,
      metric.vcr || 0
    ]);
    
    // Apply Isolation Forest
    const model = new IsolationForest({
      contamination: 0.05, // Assume 5% of officers are anomalies
      nEstimators: 100
    });
    
    const predictions = model.fit(data).predict(data);
    
    // Create alerts for anomalies
    const alerts = [];
    for (let i = 0; i < officerMetrics.length; i++) {
      if (predictions[i] === -1) { // Anomaly detected
        const officerId = officerMetrics[i].officer_id;
        alerts.push({
          officerId,
          alertType: 'STATISTICAL_ANOMALY',
          severity: 'HIGH',
          description: 'Statistical outlier detected in performance metrics'
        });
        
        await this.kpiService.createFraudAlert(
          officerId, 
          'STATISTICAL_ANOMALY', 
          'HIGH', 
          'Statistical outlier detected in performance metrics'
        );
      }
    }
    
    return alerts;
  }

  /**
   * Layer 3: Graph Network Analysis (Daily)
   * Detect collusion rings and circular accountability avoidance
   */
  async detectCircularResolutionLoops() {
    // This would typically interface with a graph database like Neo4j
    // For now, we'll simulate the detection with a SQL query
    
    const query = `
      WITH complaint_transfers AS (
        SELECT 
          complaint_id,
          from_officer_id,
          to_officer_id,
          transfer_timestamp,
          ROW_NUMBER() OVER (PARTITION BY complaint_id ORDER BY transfer_timestamp) as transfer_order
        FROM complaint_transfers
      ),
      transfer_chains AS (
        SELECT 
          c1.complaint_id,
          c1.from_officer_id as officer1,
          c1.to_officer_id as officer2,
          c2.to_officer_id as officer3,
          c3.to_officer_id as officer4
        FROM complaint_transfers c1
        JOIN complaint_transfers c2 ON c1.complaint_id = c2.complaint_id AND c2.transfer_order = c1.transfer_order + 1
        JOIN complaint_transfers c3 ON c2.complaint_id = c3.complaint_id AND c3.transfer_order = c2.transfer_order + 1
        WHERE c1.from_officer_id = c3.to_officer_id -- Circular pattern
      )
      SELECT 
        officer1, officer2, officer3, complaint_id,
        COUNT(*) as loop_count
      FROM transfer_chains
      GROUP BY officer1, officer2, officer3, complaint_id
      HAVING COUNT(*) > 3
    `;
    
    const result = await this.db.query(query);
    const circularLoops = result.rows;
    
    const alerts = [];
    for (const loop of circularLoops) {
      alerts.push({
        officerId: loop.officer1,
        alertType: 'CIRCULAR_RESOLUTION_LOOP',
        severity: 'CRITICAL',
        description: `Circular resolution loop detected involving ${loop.loop_count} transfers`
      });
      
      await this.kpiService.createFraudAlert(
        loop.officer1, 
        'CIRCULAR_RESOLUTION_LOOP', 
        'CRITICAL', 
        `Circular resolution loop detected involving ${loop.loop_count} transfers`
      );
    }
    
    return alerts;
  }

  /**
   * Layer 4: NLP Semantic Analysis (Weekly)
   * Detect copied resolution text and low-quality responses
   */
  async detectDuplicateActionPatterns() {
    // This would typically use a library like natural or compromise for NLP
    // For now, we'll simulate with a simple string similarity check
    
    const query = `
      SELECT 
        officer_id,
        complaint_id,
        resolution_text,
        LAG(resolution_text) OVER (PARTITION BY officer_id ORDER BY resolved_at) as previous_resolution
      FROM complaints 
      WHERE resolved_at >= CURRENT_DATE - INTERVAL '7 days'
        AND resolution_text IS NOT NULL
    `;
    
    const result = await this.db.query(query);
    const complaints = result.rows;
    
    const alerts = [];
    for (const complaint of complaints) {
      if (complaint.previous_resolution && complaint.resolution_text) {
        // Calculate cosine similarity (simplified)
        const similarity = this.calculateTextSimilarity(
          complaint.resolution_text, 
          complaint.previous_resolution
        );
        
        if (similarity > 0.95) {
          alerts.push({
            officerId: complaint.officer_id,
            alertType: 'DUPLICATE_ACTION_PATTERN',
            severity: 'HIGH',
            description: `Duplicate action pattern detected (similarity: ${similarity.toFixed(4)})`
          });
          
          // Save to fraud detection indicators
          await this.db.query(`
            INSERT INTO fraud_detection_indicators (
              officer_id, date, complaints_with_similar_remarks, 
              total_complaints_analyzed, cosine_similarity_score
            ) VALUES ($1, CURRENT_DATE, 1, 1, $2)
            ON CONFLICT (officer_id, date) 
            DO UPDATE SET 
              complaints_with_similar_remarks = fraud_detection_indicators.complaints_with_similar_remarks + 1,
              total_complaints_analyzed = fraud_detection_indicators.total_complaints_analyzed + 1,
              cosine_similarity_score = GREATEST(fraud_detection_indicators.cosine_similarity_score, $2),
              updated_at = CURRENT_TIMESTAMP
          `, [complaint.officer_id, similarity]);
          
          await this.kpiService.createFraudAlert(
            complaint.officer_id, 
            'DUPLICATE_ACTION_PATTERN', 
            'HIGH', 
            `Duplicate action pattern detected (similarity: ${similarity.toFixed(4)})`
          );
        }
      }
    }
    
    return alerts;
  }

  /**
   * Simplified cosine similarity calculation
   */
  calculateTextSimilarity(text1, text2) {
    // In a real implementation, this would use vector embeddings
    // For now, we'll use a simple character-level similarity
    
    const getCharFrequency = (text) => {
      const freq = {};
      for (const char of text.toLowerCase()) {
        freq[char] = (freq[char] || 0) + 1;
      }
      return freq;
    };
    
    const freq1 = getCharFrequency(text1);
    const freq2 = getCharFrequency(text2);
    
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;
    
    const allChars = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);
    
    for (const char of allChars) {
      const f1 = freq1[char] || 0;
      const f2 = freq2[char] || 0;
      
      dotProduct += f1 * f2;
      magnitude1 += f1 * f1;
      magnitude2 += f2 * f2;
    }
    
    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);
    
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    
    return dotProduct / (magnitude1 * magnitude2);
  }

  /**
   * Layer 5: Predictive ML Model (Monthly)
   * Predict which officers likely to commit fraud in next quarter
   */
  async predictFraudRisk() {
    // This would typically use a library like TensorFlow.js or scikit-learn
    // For now, we'll simulate with a simple risk scoring algorithm
    
    const query = `
      SELECT 
        officer_id,
        AVG(rcr) as avg_rcr,
        AVG(CASE WHEN z_score < -2.5 THEN 1 ELSE 0 END) as high_velocity_incidents,
        AVG(off_hours_activity_rate) as avg_off_hours_rate,
        AVG(css) as avg_css
      FROM officer_performance_metrics opm
      LEFT JOIN fraud_detection_indicators fdi ON opm.officer_id = fdi.officer_id AND opm.date = fdi.date
      WHERE opm.date >= CURRENT_DATE - INTERVAL '3 months'
      GROUP BY officer_id
    `;
    
    const result = await this.db.query(query);
    const officerMetrics = result.rows;
    
    const riskScores = [];
    for (const officer of officerMetrics) {
      // Calculate risk score based on multiple factors
      let riskScore = 0;
      
      // Factor 1: High RCR (Reopened Complaint Rate)
      if (officer.avg_rcr > 15) {
        riskScore += 30;
      } else if (officer.avg_rcr > 10) {
        riskScore += 20;
      } else if (officer.avg_rcr > 5) {
        riskScore += 10;
      }
      
      // Factor 2: Velocity anomalies
      if (officer.high_velocity_incidents > 0.1) { // More than 10% of cases
        riskScore += 25;
      } else if (officer.high_velocity_incidents > 0.05) {
        riskScore += 15;
      }
      
      // Factor 3: Off-hours activity
      if (officer.avg_off_hours_rate > 40) {
        riskScore += 20;
      } else if (officer.avg_off_hours_rate > 25) {
        riskScore += 10;
      }
      
      // Factor 4: Low citizen satisfaction
      if (officer.avg_css < 3.0) {
        riskScore += 15;
      } else if (officer.avg_css < 3.5) {
        riskScore += 10;
      }
      
      // Cap at 100
      riskScore = Math.min(riskScore, 100);
      
      riskScores.push({
        officerId: officer.officer_id,
        riskScore: riskScore
      });
      
      // Create preventive counseling alerts for high-risk officers
      if (riskScore > 75) {
        await this.kpiService.createFraudAlert(
          officer.officer_id, 
          'HIGH_FRAUD_RISK', 
          'HIGH', 
          `Predicted fraud risk score: ${riskScore.toFixed(0)}/100`
        );
      }
    }
    
    return riskScores;
  }

  /**
   * Run all fraud detection layers
   */
  async runFraudDetectionPipeline() {
    const results = {
      ruleBasedAlerts: [],
      statisticalOutliers: [],
      circularLoops: [],
      duplicatePatterns: [],
      fraudRiskScores: []
    };
    
    try {
      // Layer 1: Rule-based filters (real-time, but we'll run on recent data)
      // This would typically be triggered by events rather than batch processed
      
      // Layer 2: Statistical outlier detection (hourly)
      results.statisticalOutliers = await this.detectStatisticalOutliers();
      
      // Layer 3: Graph network analysis (daily)
      results.circularLoops = await this.detectCircularResolutionLoops();
      
      // Layer 4: NLP semantic analysis (weekly)
      results.duplicatePatterns = await this.detectDuplicateActionPatterns();
      
      // Layer 5: Predictive ML model (monthly)
      results.fraudRiskScores = await this.predictFraudRisk();
    } catch (error) {
      console.error('Error in fraud detection pipeline:', error);
    }
    
    return results;
  }
}

module.exports = FraudDetectionService;
