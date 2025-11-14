-- KPI Framework Database Schema for GramSetu AI

-- Officer Performance Metrics
CREATE TABLE officer_performance_metrics (
    id SERIAL PRIMARY KEY,
    officer_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    
    -- 1.1 Complaint Resolution Rate (CRR)
    complaints_resolved_within_sla INTEGER,
    total_complaints_assigned INTEGER,
    crr DECIMAL(5,2),
    
    -- 1.2 Average Resolution Time (ART)
    total_closed_complaints INTEGER,
    total_resolution_time_seconds BIGINT,
    art_seconds DECIMAL(10,2),
    
    -- 1.3 First Response Time (FRT)
    total_complaints_with_response INTEGER,
    total_first_response_time_seconds BIGINT,
    frt_seconds DECIMAL(10,2),
    
    -- 1.4 Citizen Satisfaction Score (CSS)
    total_resolved_complaints_with_feedback INTEGER,
    total_satisfaction_score DECIMAL(10,2),
    css DECIMAL(3,2),
    
    -- 1.5 Reopened Complaint Rate (RCR)
    reopened_complaints INTEGER,
    total_closed_complaints_for_rcr INTEGER,
    rcr DECIMAL(5,2),
    
    -- 1.6 Verification Compliance Rate (VCR)
    complaints_with_geo_proof INTEGER,
    total_complaints_for_vcr INTEGER,
    vcr DECIMAL(5,2),
    
    -- 1.7 Weekend/Off-Hours Activity Rate
    off_hours_actions INTEGER,
    total_actions INTEGER,
    off_hours_activity_rate DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fraud Detection Indicators
CREATE TABLE fraud_detection_indicators (
    id SERIAL PRIMARY KEY,
    officer_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    
    -- 2.1 Velocity Anomaly Score (VAS)
    officer_art_seconds DECIMAL(10,2),
    department_mean_art_seconds DECIMAL(10,2),
    department_std_dev_art_seconds DECIMAL(10,2),
    z_score DECIMAL(5,2),
    
    -- 2.2 Duplicate Action Pattern (DAP)
    complaints_with_similar_remarks INTEGER,
    total_complaints_analyzed INTEGER,
    cosine_similarity_score DECIMAL(5,4),
    
    -- 2.3 Ghost Beneficiary Detection (GBD)
    total_beneficiaries INTEGER,
    verified_beneficiaries INTEGER,
    gbd_percentage DECIMAL(5,2),
    
    -- 2.4 Circular Resolution Loop (CRL)
    complaint_transfer_loops INTEGER,
    
    -- 2.5 Off-Hours Fund Approval Rate
    off_hours_approvals INTEGER,
    total_approvals INTEGER,
    off_hours_approval_rate DECIMAL(5,2),
    
    -- 2.6 Beneficiary-Officer Relationship Score
    related_beneficiaries_count INTEGER,
    
    -- 2.7 Geo-Fence Violation Rate (GFVR)
    geofence_violations INTEGER,
    total_field_verifications INTEGER,
    gfvr DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System Integrity Metrics
CREATE TABLE system_integrity_metrics (
    id SERIAL PRIMARY KEY,
    officer_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    
    -- 3.1 Blockchain Consistency Index (BCI)
    consistent_actions INTEGER,
    total_critical_actions INTEGER,
    bci DECIMAL(5,2),
    
    -- 3.2 Data Tampering Attempts (DTA)
    tampering_attempts INTEGER,
    
    -- 3.3 Audit Log Completeness Score
    complete_audit_logs INTEGER,
    total_actions_for_audit INTEGER,
    audit_log_completeness DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departmental Efficiency KPIs
CREATE TABLE departmental_efficiency_kpis (
    id SERIAL PRIMARY KEY,
    department_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    
    -- 4.1 Inter-Department Response Time
    total_coordinated_actions INTEGER,
    total_response_time_seconds BIGINT,
    inter_dept_response_time_seconds DECIMAL(10,2),
    
    -- 4.2 Escalation Rate (ER)
    escalated_complaints INTEGER,
    total_complaints INTEGER,
    er DECIMAL(5,2),
    
    -- 4.3 Budget Utilization Efficiency (BUE)
    allocated_funds DECIMAL(15,2),
    utilized_funds DECIMAL(15,2),
    bue DECIMAL(5,2),
    
    -- 4.4 Preventive Action Score (PAS)
    predicted_issues INTEGER,
    addressed_issues INTEGER,
    pas DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transparency & Compliance Metrics
CREATE TABLE transparency_compliance_metrics (
    id SERIAL PRIMARY KEY,
    department_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    
    -- 5.1 RTI Response Time
    total_rti_requests INTEGER,
    total_response_time_days INTEGER,
    avg_rti_response_days DECIMAL(5,2),
    
    -- 5.2 Public Dashboard Update Frequency
    total_status_changes INTEGER,
    total_updates_within_hour INTEGER,
    dashboard_update_frequency DECIMAL(5,2),
    
    -- 5.3 Privacy Compliance Score
    compliance_audits_passed INTEGER,
    total_compliance_audits INTEGER,
    privacy_compliance_score DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fraud Detection Alerts
CREATE TABLE fraud_alerts (
    id SERIAL PRIMARY KEY,
    officer_id VARCHAR(50),
    department_id VARCHAR(50),
    alert_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- CRITICAL, HIGH, MEDIUM, LOW
    description TEXT,
    metrics JSONB, -- Store relevant metric values
    status VARCHAR(20) DEFAULT 'OPEN', -- OPEN, INVESTIGATING, RESOLVED, DISMISSED
    assigned_to VARCHAR(50), -- User ID of investigator
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- KPI Targets and Thresholds
CREATE TABLE kpi_targets (
    id SERIAL PRIMARY KEY,
    kpi_category VARCHAR(50) NOT NULL,
    kpi_name VARCHAR(100) NOT NULL,
    target_value DECIMAL(10,2),
    red_flag_threshold DECIMAL(10,2),
    unit VARCHAR(20),
    jurisdiction_level VARCHAR(20), -- DISTRICT, STATE, CENTRAL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_officer_performance_officer_date ON officer_performance_metrics(officer_id, date);
CREATE INDEX idx_fraud_detection_officer_date ON fraud_detection_indicators(officer_id, date);
CREATE INDEX idx_fraud_alerts_status ON fraud_alerts(status);
CREATE INDEX idx_fraud_alerts_severity ON fraud_alerts(severity);
CREATE INDEX idx_fraud_alerts_officer ON fraud_alerts(officer_id);
