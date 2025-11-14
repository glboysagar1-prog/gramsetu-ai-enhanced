import React, { useState } from 'react';
import useOfflineComplaint from '../hooks/useOfflineComplaint';
import useFraudDetection from '../hooks/useFraudDetection';

const ComplaintsTable = ({ complaints = [], onComplaintSubmit, authToken }) => {
  const [newComplaint, setNewComplaint] = useState({
    text: '',
    category: 'Water',
    urgency: 'Medium'
  });
  
  const { fraudRisk, isCheckingFraud, checkFraudRisk } = useFraudDetection();
  const { 
    isOnline, 
    pendingSyncCount, 
    submitComplaintWithOfflineSupport 
  } = useOfflineComplaint(authToken);
  
  const [showFraudWarning, setShowFraudWarning] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComplaint(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComplaint.text.trim()) return;
    
    try {
      // Check fraud risk before submitting
      const fraudResult = await checkFraudRisk(newComplaint);
      
      // If high risk, show warning
      if (fraudResult.risk_level === 'high') {
        setShowFraudWarning(true);
        return;
      }
      
      // Use offline-aware submission
      const result = await submitComplaintWithOfflineSupport({
        text: newComplaint.text,
        citizen_id: 'CITIZEN001', // This would come from auth context
        category: newComplaint.category,
        urgency: newComplaint.urgency
      });
      
      if (result.success) {
        // Reset form
        setNewComplaint({
          text: '',
          category: 'Water',
          urgency: 'Medium'
        });
        
        // Notify parent component if needed
        if (onComplaintSubmit) {
          onComplaintSubmit(result.data);
        }
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  const handleFraudWarningConfirm = async () => {
    setShowFraudWarning(false);
    
    try {
      // Proceed with submission despite fraud risk
      const result = await submitComplaintWithOfflineSupport({
        text: newComplaint.text,
        citizen_id: 'CITIZEN001', // This would come from auth context
        category: newComplaint.category,
        urgency: newComplaint.urgency
      });
      
      if (result.success) {
        // Reset form
        setNewComplaint({
          text: '',
          category: 'Water',
          urgency: 'Medium'
        });
        
        // Notify parent component if needed
        if (onComplaintSubmit) {
          onComplaintSubmit(result.data);
        }
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  const handleFraudWarningCancel = () => {
    setShowFraudWarning(false);
  };

  return (
    <div className="complaints-table-container">
      <div className="complaint-form-section">
        <h3>File New Complaint</h3>
        <form onSubmit={handleSubmit} className="complaint-form">
          <div className="form-group">
            <label htmlFor="complaintText">Complaint Description</label>
            <textarea
              id="complaintText"
              name="text"
              value={newComplaint.text}
              onChange={handleInputChange}
              placeholder="Describe your complaint in detail..."
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={newComplaint.category}
                onChange={handleInputChange}
              >
                <option value="Water">Water</option>
                <option value="Health">Health</option>
                <option value="Electricity">Electricity</option>
                <option value="Road">Road</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Education">Education</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Law & Order">Law & Order</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="urgency">Urgency</label>
              <select
                id="urgency"
                name="urgency"
                value={newComplaint.urgency}
                onChange={handleInputChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isCheckingFraud}
          >
            {isCheckingFraud ? 'Checking...' : 'Submit Complaint'}
          </button>
        </form>
        
        {/* Offline Status Indicator */}
        <div className="offline-status">
          <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </span>
          {pendingSyncCount > 0 && (
            <span className="pending-count">
              {pendingSyncCount} pending sync
            </span>
          )}
        </div>
        
        {/* Fraud Risk Display */}
        {fraudRisk && fraudRisk.risk_level !== 'low' && (
          <div className={`fraud-risk-display ${fraudRisk.risk_level}`}>
            <h4>Fraud Risk Assessment</h4>
            <p>Risk Level: <span className="risk-level">{fraudRisk.risk_level.toUpperCase()}</span></p>
            <p>Risk Score: {fraudRisk.risk_score}/100</p>
            {fraudRisk.risk_factors.length > 0 && (
              <div>
                <p>Risk Factors:</p>
                <ul>
                  {fraudRisk.risk_factors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Fraud Warning Modal */}
      {showFraudWarning && (
        <div className="fraud-warning-modal">
          <div className="modal-content">
            <h3>⚠️ High Fraud Risk Detected</h3>
            <p>Your complaint has been flagged as potentially suspicious.</p>
            <p>Risk Score: {fraudRisk?.risk_score}/100</p>
            {fraudRisk?.risk_factors.length > 0 && (
              <div>
                <p>Risk Factors:</p>
                <ul>
                  {fraudRisk.risk_factors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
            <p>Are you sure you want to submit this complaint?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={handleFraudWarningConfirm}>
                Yes, Submit Anyway
              </button>
              <button className="cancel-btn" onClick={handleFraudWarningCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="complaints-list-section">
        <h3>Recent Complaints</h3>
        <div className="complaints-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Category</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(complaint => (
                <tr key={complaint.id}>
                  <td>{complaint.id}</td>
                  <td>{complaint.text}</td>
                  <td>{complaint.category}</td>
                  <td>{complaint.urgency}</td>
                  <td>
                    <span className={`status-badge ${complaint.status.toLowerCase()}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td>{new Date(complaint.timestamp).toLocaleDateString()}</td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr>
                  <td colSpan="6" className="no-complaints">
                    No complaints found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <style jsx>{`
        .complaints-table-container {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin: 2rem 0;
          position: relative;
        }
        
        .complaint-form-section, .complaints-list-section {
          margin-bottom: 2rem;
        }
        
        .complaint-form-section h3, .complaints-list-section h3 {
          color: #1e293b;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }
        
        .complaint-form {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 10px;
          margin-bottom: 2rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #334155;
        }
        
        .form-group textarea, .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        
        .form-group textarea {
          min-height: 120px;
          resize: vertical;
        }
        
        .form-group textarea:focus, .form-group select:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        
        .submit-btn {
          background: #6366f1;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .submit-btn:hover:not(:disabled) {
          background: #4f46e5;
        }
        
        .submit-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }
        
        .offline-status {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .status-indicator {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 500;
        }
        
        .status-indicator.online {
          background: #d1fae5;
          color: #059669;
        }
        
        .status-indicator.offline {
          background: #fee2e2;
          color: #ef4444;
        }
        
        .pending-count {
          background: #fef3c7;
          color: #d97706;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 500;
        }
        
        .fraud-risk-display {
          background: #fffbeb;
          border: 1px solid #fbbf24;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
        }
        
        .fraud-risk-display.high {
          background: #fef2f2;
          border-color: #ef4444;
        }
        
        .fraud-risk-display.medium {
          background: #fffbeb;
          border-color: #f59e0b;
        }
        
        .fraud-risk-display h4 {
          margin-top: 0;
          color: #334155;
        }
        
        .risk-level {
          font-weight: 700;
          text-transform: uppercase;
        }
        
        .fraud-risk-display.high .risk-level {
          color: #ef4444;
        }
        
        .fraud-risk-display.medium .risk-level {
          color: #f59e0b;
        }
        
        .fraud-warning-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }
        
        .modal-content h3 {
          margin-top: 0;
          color: #dc2626;
        }
        
        .modal-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .confirm-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
        }
        
        .confirm-btn:hover {
          background: #dc2626;
        }
        
        .cancel-btn {
          background: #f1f5f9;
          color: #64748b;
          border: 1px solid #cbd5e1;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
        }
        
        .cancel-btn:hover {
          background: #e2e8f0;
        }
        
        .complaints-table {
          overflow-x: auto;
        }
        
        .complaints-table table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .complaints-table th, .complaints-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .complaints-table th {
          background: #f1f5f9;
          font-weight: 600;
          color: #64748b;
        }
        
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .status-badge.pending {
          background: #fef3c7;
          color: #d97706;
        }
        
        .status-badge.resolved {
          background: #d1fae5;
          color: #059669;
        }
        
        .status-badge.in-progress {
          background: #dbeafe;
          color: #2563eb;
        }
        
        .no-complaints {
          text-align: center;
          color: #94a3b8;
          font-style: italic;
          padding: 2rem;
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .complaints-table-container {
            padding: 1rem;
          }
          
          .complaints-table th, .complaints-table td {
            padding: 0.5rem;
            font-size: 0.875rem;
          }
          
          .modal-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ComplaintsTable;