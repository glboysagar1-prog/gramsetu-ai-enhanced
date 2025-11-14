import React from 'react';

const AutoEscalation = ({ complaints, oldComplaintsCount }) => {
  // Find complaints older than 72 hours that need escalation
  const oldComplaints = complaints.filter(c => {
    if (c.status === 'Resolved') return false;
    const created = new Date(c.createdAt);
    const now = new Date();
    const hoursDiff = (now - created) / (1000 * 60 * 60);
    return hoursDiff > 72;
  });

  // Calculate hours since creation for each complaint
  const complaintsWithAge = oldComplaints.map(c => {
    const created = new Date(c.createdAt);
    const now = new Date();
    const hoursDiff = Math.floor((now - created) / (1000 * 60 * 60));
    return { ...c, hoursSinceCreation: hoursDiff };
  });

  // Sort by age (oldest first)
  complaintsWithAge.sort((a, b) => b.hoursSinceCreation - a.hoursSinceCreation);

  return (
    <div>
      {oldComplaintsCount > 0 ? (
        <div className="escalation-alert">
          <strong>Alert:</strong> {oldComplaintsCount} complaints are pending for more than 72 hours and require escalation.
        </div>
      ) : (
        <div style={{ padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '15px' }}>
          No complaints require escalation at this time.
        </div>
      )}

      <div className="escalation-list">
        {complaintsWithAge.map((complaint) => (
          <div key={complaint.id} className="escalation-item">
            <span className="escalation-id">#{complaint.id}</span>
            <span>{complaint.text.substring(0, 40)}...</span>
            <div className="escalation-time">
              {complaint.hoursSinceCreation} hours old
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutoEscalation;