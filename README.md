# GramSetu AI KPI Framework

## Overview
This comprehensive monitoring system transforms officer performance from subjective annual reviews to real-time, data-driven accountability using 23 actionable KPIs across five categories, integrated with automated fraud detection algorithms that flag suspicious patterns within 24 hours.

## KPI Categories

### 1. Officer Performance Metrics (Core Accountability)
- Complaint Resolution Rate (CRR)
- Average Resolution Time (ART)
- First Response Time (FRT)
- Citizen Satisfaction Score (CSS)
- Reopened Complaint Rate (RCR)
- Verification Compliance Rate (VCR)
- Weekend/Off-Hours Activity Rate

### 2. Fraud Detection Indicators (Red Flags)
- Velocity Anomaly Score (VAS)
- Duplicate Action Pattern (DAP)
- Ghost Beneficiary Detection (GBD)
- Circular Resolution Loop (CRL)
- Off-Hours Fund Approval Rate
- Beneficiary-Officer Relationship Score
- Geo-Fence Violation Rate (GFVR)

### 3. System Integrity Metrics
- Blockchain Consistency Index (BCI)
- Data Tampering Attempts (DTA)
- Audit Log Completeness Score

### 4. Departmental Efficiency KPIs
- Inter-Department Response Time
- Escalation Rate (ER)
- Budget Utilization Efficiency (BUE)
- Preventive Action Score (PAS)

### 5. Transparency & Compliance Metrics
- RTI Response Time
- Public Dashboard Update Frequency
- Privacy Compliance Score

## Fraud Detection Algorithm Framework

### Multi-Layer Anomaly Detection Pipeline
1. **Rule-Based Filters** (Real-Time)
2. **Statistical Outlier Detection** (Hourly)
3. **Graph Network Analysis** (Daily)
4. **NLP Semantic Analysis** (Weekly)
5. **Predictive ML Model** (Monthly)

## Installation
```bash
npm install
```

## Usage
```bash
npm start
```

## Services
- **KPIService**: Calculates all KPIs for officers
- **FraudDetectionService**: Implements multi-layer fraud detection
- **DashboardService**: Provides data for monitoring dashboards
- **SchedulerService**: Runs KPI calculations and fraud detection at appropriate intervals

## Database Schema
The database schema is defined in `database/kpi_schema.sql` and includes tables for:
- Officer performance metrics
- Fraud detection indicators
- System integrity metrics
- Departmental efficiency KPIs
- Transparency & compliance metrics
- Fraud alerts
- KPI targets and thresholds
