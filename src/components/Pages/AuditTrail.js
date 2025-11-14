/**
 * Audit Trail Component for GramSetu AI
 * Visualization of tamper-proof audit logs
 */
import React, { useState, useEffect } from 'react';

const AuditTrail = () => {
  const [auditEvents, setAuditEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState({ type: '', id: '' });
  const [filter, setFilter] = useState('all');

  // Mock audit events for demo
  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        event_type: 'complaint_submitted',
        entity_type: 'complaint',
        entity_id: 'COMPLAINT001',
        action: 'submit',
        actor_id: 'CITIZEN001',
        actor_role: 'citizen',
        timestamp: '2023-06-15T10:30:00Z',
        data: { category: 'Water', urgency: 'High' },
        hash: 'a1b2c3d4e5f6...',
        previous_hash: null,
        signature: 'sig123456...'
      },
      {
        id: 2,
        event_type: 'complaint_assigned',
        entity_type: 'complaint',
        entity_id: 'COMPLAINT001',
        action: 'assign',
        actor_id: 'OFFICER001',
        actor_role: 'field_worker',
        timestamp: '2023-06-15T11:15:00Z',
        data: { assigned_to: 'FW001', notes: 'Urgent water issue' },
        hash: 'b2c3d4e5f6a7...',
        previous_hash: 'a1b2c3d4e5f6...',
        signature: 'sig234567...'
      },
      {
        id: 3,
        event_type: 'complaint_resolved',
        entity_type: 'complaint',
        entity_id: 'COMPLAINT001',
        action: 'resolve',
        actor_id: 'FW001',
        actor_role: 'field_worker',
        timestamp: '2023-06-16T14:20:00Z',
        data: { resolution: 'Water supply restored', evidence: 'photo123.jpg' },
        hash: 'c3d4e5f6a7b8...',
        previous_hash: 'b2c3d4e5f6a7...',
        signature: 'sig345678...'
      }
    ];

    setAuditEvents(mockEvents);
    setLoading(false);

    // Mock verification result
    setVerificationResult({
      verified: true,
      verification_rate: 1.0,
      total_events: 3,
      verified_events: 3,
      tampered_events: [],
      timestamp: new Date().toISOString()
    });
  }, []);

  const handleVerifyAuditTrail = () => {
    // In a real implementation, this would call the backend API
    alert('Audit trail verification would be performed here');
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleEntitySearch = () => {
    if (selectedEntity.type && selectedEntity.id) {
      // In a real implementation, this would filter the audit events
      alert(`Searching for ${selectedEntity.type} ${selectedEntity.id}`);
    }
  };

  const filteredEvents = auditEvents.filter(event => {
    if (filter === 'all') return true;
    return event.entity_type === filter;
  });

  return (
    <div className="audit-trail-container">
      <div className="audit-header">
        <h1>🔍 Audit Trail</h1>
        <p>Tamper-proof logging of all governance activities</p>
      </div>

      {/* Verification Status */}
      {verificationResult && (
        <div className={`verification-status ${verificationResult.verified ? 'verified' : 'tampered'}`}>
          <div className="status-header">
            <span className="status-icon">
              {verificationResult.verified ? '✅' : '⚠️'}
            </span>
            <h3>
              {verificationResult.verified ? 'Audit Trail Verified' : 'Audit Trail Tampered'}
            </h3>
          </div>
          <div className="status-details">
            <p>
              Verification Rate: {(verificationResult.verification_rate * 100).toFixed(1)}% 
              ({verificationResult.verified_events}/{verificationResult.total_events} events)
            </p>
            <p>Last checked: {new Date(verificationResult.timestamp).toLocaleString()}</p>
          </div>
          <button className="verify-btn" onClick={handleVerifyAuditTrail}>
            Verify Now
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="audit-filters">
        <div className="filter-group">
          <label htmlFor="entityFilter">Filter by Entity Type:</label>
          <select id="entityFilter" value={filter} onChange={handleFilterChange}>
            <option value="all">All Entities</option>
            <option value="complaint">Complaints</option>
            <option value="user">Users</option>
            <option value="assignment">Assignments</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="entityType">Search Entity:</label>
          <div className="entity-search">
            <input
              type="text"
              placeholder="Entity Type"
              value={selectedEntity.type}
              onChange={(e) => setSelectedEntity({...selectedEntity, type: e.target.value})}
            />
            <input
              type="text"
              placeholder="Entity ID"
              value={selectedEntity.id}
              onChange={(e) => setSelectedEntity({...selectedEntity, id: e.target.value})}
            />
            <button onClick={handleEntitySearch}>Search</button>
          </div>
        </div>
      </div>

      {/* Audit Events */}
      <div className="audit-events">
        <h2>Audit Events</h2>
        
        {loading ? (
          <div className="loading">Loading audit trail...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="no-events">No audit events found</div>
        ) : (
          <div className="events-list">
            {filteredEvents.map((event, index) => (
              <div key={event.id} className="audit-event">
                <div className="event-header">
                  <div className="event-icon">
                    {event.event_type === 'complaint_submitted' && '📝'}
                    {event.event_type === 'complaint_assigned' && '👤'}
                    {event.event_type === 'complaint_resolved' && '✅'}
                    {event.event_type === 'complaint_rejected' && '❌'}
                  </div>
                  <div className="event-title">
                    <h3>{event.event_type.replace('_', ' ')}</h3>
                    <p className="entity-ref">
                      {event.entity_type} {event.entity_id}
                    </p>
                  </div>
                  <div className="event-timestamp">
                    {new Date(event.timestamp).toLocaleString()}
                  </div>
                </div>
                
                <div className="event-details">
                  <div className="actor-info">
                    <span className="actor-id">{event.actor_id}</span>
                    <span className="actor-role">{event.actor_role}</span>
                  </div>
                  
                  <div className="event-action">
                    <strong>Action:</strong> {event.action}
                  </div>
                  
                  {event.data && Object.keys(event.data).length > 0 && (
                    <div className="event-data">
                      <strong>Data:</strong>
                      <ul>
                        {Object.entries(event.data).map(([key, value]) => (
                          <li key={key}>
                            <span className="data-key">{key}:</span> 
                            <span className="data-value">{String(value)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="event-hash">
                    <strong>Hash:</strong> 
                    <span className="hash-value" title={event.hash}>
                      {event.hash.substring(0, 20)}...
                    </span>
                  </div>
                  
                  {event.previous_hash && (
                    <div className="previous-hash">
                      <strong>Previous Hash:</strong> 
                      <span className="hash-value" title={event.previous_hash}>
                        {event.previous_hash.substring(0, 20)}...
                      </span>
                    </div>
                  )}
                  
                  {event.signature && (
                    <div className="signature">
                      <strong>Signature:</strong> 
                      <span className="signature-value" title={event.signature}>
                        {event.signature.substring(0, 20)}...
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Blockchain-like linking visualization */}
                {index < filteredEvents.length - 1 && (
                  <div className="chain-link">
                    <div className="link-line"></div>
                    <div className="link-icon">🔗</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .audit-trail-container {
          padding: 2rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
          min-height: 100vh;
        }

        .audit-header {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          margin-bottom: 2rem;
          text-align: center;
        }

        .audit-header h1 {
          color: #1e3a8a;
          margin: 0 0 1rem 0;
        }

        .audit-header p {
          color: #64748b;
          font-size: 1.1rem;
          margin: 0;
        }

        .verification-status {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .verification-status.verified {
          border-left: 5px solid #10b981;
        }

        .verification-status.tampered {
          border-left: 5px solid #ef4444;
        }

        .status-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .status-icon {
          font-size: 2rem;
        }

        .status-details {
          flex: 1;
        }

        .status-details p {
          margin: 0.25rem 0;
          color: #64748b;
        }

        .verify-btn {
          background: #6366f1;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .verify-btn:hover {
          background: #4f46e5;
        }

        .audit-filters {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-group label {
          font-weight: 600;
          color: #334155;
        }

        .filter-group select {
          padding: 0.5rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 1rem;
        }

        .entity-search {
          display: flex;
          gap: 0.5rem;
        }

        .entity-search input {
          padding: 0.5rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 1rem;
        }

        .entity-search button {
          background: #6366f1;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .audit-events h2 {
          color: #1e3a8a;
          margin-bottom: 1.5rem;
        }

        .loading, .no-events {
          text-align: center;
          padding: 2rem;
          color: #94a3b8;
          font-style: italic;
        }

        .events-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .audit-event {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .event-header {
          display: flex;
          align-items: center;
          padding: 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .event-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
        }

        .event-title {
          flex: 1;
        }

        .event-title h3 {
          margin: 0 0 0.25rem 0;
          color: #1e293b;
        }

        .entity-ref {
          margin: 0;
          color: #64748b;
          font-size: 0.9rem;
        }

        .event-timestamp {
          color: #64748b;
          font-size: 0.9rem;
        }

        .event-details {
          padding: 1.5rem;
        }

        .actor-info {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .actor-id {
          font-weight: 600;
          color: #334155;
        }

        .actor-role {
          background: #e0f2fe;
          color: #0369a1;
          padding: 0.25rem 0.5rem;
          border-radius: 20px;
          font-size: 0.8rem;
        }

        .event-action {
          margin-bottom: 1rem;
        }

        .event-data ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }

        .event-data li {
          margin-bottom: 0.25rem;
        }

        .data-key {
          font-weight: 600;
          color: #334155;
        }

        .data-value {
          color: #64748b;
        }

        .event-hash, .previous-hash, .signature {
          margin-top: 0.5rem;
          font-size: 0.9rem;
        }

        .hash-value, .signature-value {
          font-family: monospace;
          background: #f1f5f9;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          margin-left: 0.5rem;
          color: #64748b;
        }

        .chain-link {
          position: relative;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .link-line {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 2.5rem;
          width: 2px;
          background: #cbd5e1;
        }

        .link-icon {
          background: white;
          border: 2px solid #cbd5e1;
          border-radius: 50%;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .audit-trail-container {
            padding: 1rem;
          }

          .verification-status {
            flex-direction: column;
            align-items: flex-start;
          }

          .audit-filters {
            flex-direction: column;
            gap: 1rem;
          }

          .entity-search {
            flex-direction: column;
          }

          .event-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .actor-info {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AuditTrail;