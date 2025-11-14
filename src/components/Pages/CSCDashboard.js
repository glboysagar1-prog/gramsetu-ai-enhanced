/**
 * CSC Dashboard Component for GramSetu AI
 * Dashboard for Common Service Center agents to assist citizens
 */
import React, { useState, useEffect } from 'react';
import useOfflineComplaint from '../../hooks/useOfflineComplaint';

const CSCDashboard = () => {
  const [cscInfo, setCscInfo] = useState(null);
  const [agents, setAgents] = useState([]);
  const [citizenData, setCitizenData] = useState({
    name: '',
    phone: '',
    aadhaar: ''
  });
  const [complaintData, setComplaintData] = useState({
    category: 'Water',
    description: '',
    urgency: 'Medium'
  });
  const [isKioskMode, setIsKioskMode] = useState(false);
  const [activeTab, setActiveTab] = useState('complaint');

  const { isOnline, submitComplaintWithOfflineSupport } = useOfflineComplaint();

  // Mock CSC info (in real app, this would come from API)
  useEffect(() => {
    setCscInfo({
      id: 1,
      name: 'CSC Sector 5',
      location: 'Main Market, Sector 5',
      district: 'South Delhi',
      state: 'Delhi',
      pincode: '110010',
      contact_person: 'Rajesh Kumar',
      phone: '+919876543210',
      email: 'csc5@example.com'
    });

    setAgents([
      { id: 1, name: 'Priya Sharma', phone: '+919876543211', role: 'Agent' },
      { id: 2, name: 'Amit Patel', phone: '+919876543212', role: 'Supervisor' }
    ]);
  }, []);

  const handleCitizenDataChange = (e) => {
    const { name, value } = e.target;
    setCitizenData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleComplaintDataChange = (e) => {
    const { name, value } = e.target;
    setComplaintData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileComplaint = async (e) => {
    e.preventDefault();
    
    if (!complaintData.description.trim()) {
      alert('Please enter complaint description');
      return;
    }
    
    try {
      // In a real app, this would include citizen data and authentication
      const result = await submitComplaintWithOfflineSupport({
        text: `Citizen: ${citizenData.name} (${citizenData.phone})\n${complaintData.description}`,
        citizen_id: `CSC_CITIZEN_${Date.now()}`,
        category: complaintData.category,
        urgency: complaintData.urgency
      });
      
      if (result.success) {
        alert('Complaint filed successfully!');
        // Reset form
        setComplaintData({
          category: 'Water',
          description: '',
          urgency: 'Medium'
        });
      }
    } catch (error) {
      console.error('Error filing complaint:', error);
      alert('Error filing complaint. Please try again.');
    }
  };

  const toggleKioskMode = () => {
    setIsKioskMode(!isKioskMode);
  };

  return (
    <div className={`csc-dashboard ${isKioskMode ? 'kiosk-mode' : ''}`}>
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🏛️ GramSetu AI - CSC Dashboard</h1>
          <div className="csc-info">
            <span className="csc-name">{cscInfo?.name}</span>
            <span className="csc-location">{cscInfo?.location}, {cscInfo?.district}</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="kiosk-toggle-btn" onClick={toggleKioskMode}>
            {isKioskMode ? 'Exit Kiosk Mode' : 'Kiosk Mode'}
          </button>
          <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'complaint' ? 'active' : ''}`}
          onClick={() => setActiveTab('complaint')}
        >
          File Complaint
        </button>
        <button 
          className={`tab-btn ${activeTab === 'citizens' ? 'active' : ''}`}
          onClick={() => setActiveTab('citizens')}
        >
          Citizen Records
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {activeTab === 'complaint' && (
          <div className="complaint-filing-section">
            <h2>File Citizen Complaint</h2>
            
            {/* Citizen Information */}
            <div className="citizen-info-form">
              <h3>Citizen Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="citizenName">Name</label>
                  <input
                    type="text"
                    id="citizenName"
                    name="name"
                    value={citizenData.name}
                    onChange={handleCitizenDataChange}
                    placeholder="Enter citizen's name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="citizenPhone">Phone</label>
                  <input
                    type="tel"
                    id="citizenPhone"
                    name="phone"
                    value={citizenData.phone}
                    onChange={handleCitizenDataChange}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="citizenAadhaar">Aadhaar (Optional)</label>
                  <input
                    type="text"
                    id="citizenAadhaar"
                    name="aadhaar"
                    value={citizenData.aadhaar}
                    onChange={handleCitizenDataChange}
                    placeholder="Enter Aadhaar number"
                  />
                </div>
              </div>
            </div>

            {/* Complaint Form */}
            <div className="complaint-form">
              <h3>Complaint Details</h3>
              <form onSubmit={handleFileComplaint}>
                <div className="form-group">
                  <label htmlFor="complaintCategory">Category</label>
                  <select
                    id="complaintCategory"
                    name="category"
                    value={complaintData.category}
                    onChange={handleComplaintDataChange}
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
                  <label htmlFor="complaintDescription">Description</label>
                  <textarea
                    id="complaintDescription"
                    name="description"
                    value={complaintData.description}
                    onChange={handleComplaintDataChange}
                    placeholder="Describe the complaint in detail..."
                    rows="4"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="complaintUrgency">Urgency</label>
                  <select
                    id="complaintUrgency"
                    name="urgency"
                    value={complaintData.urgency}
                    onChange={handleComplaintDataChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    File Complaint
                  </button>
                  <button type="button" className="reset-btn" onClick={() => {
                    setComplaintData({
                      category: 'Water',
                      description: '',
                      urgency: 'Medium'
                    });
                  }}>
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'citizens' && (
          <div className="citizen-records-section">
            <h2>Citizen Records</h2>
            <div className="records-content">
              <p>Citizen records management system would be implemented here.</p>
              <p>In a real implementation, this would show:</p>
              <ul>
                <li>Previously filed complaints by citizens</li>
                <li>Citizen profiles and contact information</li>
                <li>Complaint history and resolution status</li>
                <li>Service level agreements and follow-ups</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-section">
            <h2>Reports & Analytics</h2>
            <div className="reports-content">
              <p>Reporting and analytics dashboard for CSC operations.</p>
              <p>In a real implementation, this would show:</p>
              <ul>
                <li>Daily/weekly/monthly complaint statistics</li>
                <li>Category-wise complaint distribution</li>
                <li>Resolution time analytics</li>
                <li>Agent performance metrics</li>
                <li>Geographical complaint hotspots</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* CSC Agents Info */}
      <div className="csc-agents-section">
        <h3>CSC Agents</h3>
        <div className="agents-list">
          {agents.map(agent => (
            <div key={agent.id} className="agent-card">
              <div className="agent-info">
                <h4>{agent.name}</h4>
                <p>{agent.role}</p>
                <p>{agent.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .csc-dashboard {
          padding: 2rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
          min-height: 100vh;
        }

        .csc-dashboard.kiosk-mode {
          padding: 1rem;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          margin-bottom: 2rem;
        }

        .header-content h1 {
          margin: 0;
          color: #1e3a8a;
          font-size: 1.8rem;
        }

        .csc-info {
          display: flex;
          flex-direction: column;
          margin-top: 0.5rem;
        }

        .csc-name {
          font-weight: 600;
          color: #334155;
        }

        .csc-location {
          font-size: 0.9rem;
          color: #64748b;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .kiosk-toggle-btn {
          background: #6366f1;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .kiosk-toggle-btn:hover {
          background: #4f46e5;
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

        .dashboard-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          background: white;
          padding: 0.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .tab-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn.active {
          background: #6366f1;
          color: white;
        }

        .tab-btn:hover:not(.active) {
          background: #f1f5f9;
        }

        .dashboard-content {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          margin-bottom: 2rem;
        }

        .complaint-filing-section h2,
        .citizen-records-section h2,
        .reports-section h2 {
          color: #1e3a8a;
          margin-top: 0;
          margin-bottom: 1.5rem;
        }

        .citizen-info-form, .complaint-form {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 10px;
          margin-bottom: 2rem;
        }

        .citizen-info-form h3,
        .complaint-form h3 {
          margin-top: 0;
          color: #334155;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
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

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
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

        .submit-btn:hover {
          background: #4f46e5;
        }

        .reset-btn {
          background: #f1f5f9;
          color: #64748b;
          border: 1px solid #cbd5e1;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .reset-btn:hover {
          background: #e2e8f0;
        }

        .records-content ul,
        .reports-content ul {
          padding-left: 1.5rem;
        }

        .records-content li,
        .reports-content li {
          margin-bottom: 0.5rem;
        }

        .csc-agents-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .csc-agents-section h3 {
          margin-top: 0;
          color: #1e3a8a;
          margin-bottom: 1.5rem;
        }

        .agents-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .agent-card {
          background: #f8fafc;
          border-radius: 10px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
        }

        .agent-info h4 {
          margin: 0 0 0.5rem 0;
          color: #334155;
        }

        .agent-info p {
          margin: 0.25rem 0;
          color: #64748b;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .csc-dashboard {
            padding: 1rem;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .header-actions {
            width: 100%;
            justify-content: center;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .dashboard-tabs {
            flex-wrap: wrap;
          }

          .tab-btn {
            flex: 1;
            min-width: 120px;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .dashboard-content,
          .csc-agents-section {
            padding: 1rem;
          }

          .citizen-info-form,
          .complaint-form {
            padding: 1rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .submit-btn,
          .reset-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CSCDashboard;