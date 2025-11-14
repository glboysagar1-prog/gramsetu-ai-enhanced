import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, Upload, CheckCircle, Clock, Camera, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { ComplaintsTrendChart, UrgencyChart } from '../Charts/Charts';
import './FieldWorkerDashboard.css';

const FieldWorkerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, inProgress: 0 });
  const [selectedTask, setSelectedTask] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [geoLocation, setGeoLocation] = useState(null);

  useEffect(() => {
    fetchAssignedTasks();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const fetchAssignedTasks = () => {
    // Mock data for field worker tasks
    const mockTasks = [
      {
        id: 'TASK-001',
        complaintId: 'GSAI-2025-0001',
        title: 'Water supply disruption in Ward 5',
        description: 'Main pipeline damaged, affecting 150+ households',
        category: 'Water Supply',
        urgency: 'High',
        status: 'In Progress',
        assignedDate: '2025-10-21T09:00:00Z',
        dueDate: '2025-10-24T17:00:00Z',
        location: 'Ward 5, North Zone, Mumbai',
        citizenName: 'Ramesh Kumar',
        citizenPhone: '+91 98765 43210',
        evidenceRequired: true,
        proofUploaded: false
      },
      {
        id: 'TASK-002',
        complaintId: 'GSAI-2025-0012',
        title: 'Street lights not working on MG Road',
        description: '8 street lights malfunctioning for past 3 days',
        category: 'Electricity',
        urgency: 'Medium',
        status: 'Pending',
        assignedDate: '2025-10-22T10:30:00Z',
        dueDate: '2025-10-25T17:00:00Z',
        location: 'MG Road, Ward 3, Mumbai',
        citizenName: 'Priya Sharma',
        citizenPhone: '+91 98765 43211',
        evidenceRequired: true,
        proofUploaded: false
      },
      {
        id: 'TASK-003',
        complaintId: 'GSAI-2025-0008',
        title: 'Road pothole repair needed',
        description: 'Large pothole causing traffic issues',
        category: 'Road Maintenance',
        urgency: 'Medium',
        status: 'Completed',
        assignedDate: '2025-10-18T14:00:00Z',
        dueDate: '2025-10-21T17:00:00Z',
        completedDate: '2025-10-20T16:30:00Z',
        location: 'Station Road, Ward 2, Mumbai',
        citizenName: 'Amit Patel',
        citizenPhone: '+91 98765 43212',
        evidenceRequired: true,
        proofUploaded: true,
        proofImages: ['before.jpg', 'after.jpg']
      }
    ];

    setAssignedTasks(mockTasks);
    setStats({
      total: mockTasks.length,
      completed: mockTasks.filter(t => t.status === 'Completed').length,
      pending: mockTasks.filter(t => t.status === 'Pending').length,
      inProgress: mockTasks.filter(t => t.status === 'In Progress').length
    });
  };

  const handleUploadEvidence = (taskId) => {
    // Simulate file upload
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAssignedTasks(tasks => 
            tasks.map(t => t.id === taskId ? { ...t, proofUploaded: true } : t)
          );
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleMarkComplete = (taskId) => {
    setAssignedTasks(tasks =>
      tasks.map(t =>
        t.id === taskId
          ? { ...t, status: 'Completed', completedDate: new Date().toISOString() }
          : t
      )
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  // Mock chart data
  const dailyTasksData = [
    { date: 'Mon', completed: 4, assigned: 6 },
    { date: 'Tue', completed: 5, assigned: 7 },
    { date: 'Wed', completed: 3, assigned: 5 },
    { date: 'Thu', completed: 6, assigned: 8 },
    { date: 'Fri', completed: 4, assigned: 6 }
  ];

  const urgencyData = [
    { name: 'High', value: 8 },
    { name: 'Medium', value: 12 },
    { name: 'Low', value: 5 }
  ];

  return (
    <div className="field-dashboard">
      <div className="dashboard-container">
        {/* Welcome Header */}
        <motion.div 
          className="welcome-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="welcome-content">
            <h1>Welcome, {user?.name || 'Field Worker'}</h1>
            <p className="role-badge">👮 Field Officer Dashboard</p>
          </div>
          <div className="location-badge">
            <MapPin size={20} />
            <div>
              <p className="location-label">Current Location</p>
              {geoLocation ? (
                <p className="location-coords">
                  {geoLocation.lat.toFixed(4)}, {geoLocation.lng.toFixed(4)}
                  <span className="accuracy"> (±{geoLocation.accuracy.toFixed(0)}m)</span>
                </p>
              ) : (
                <p className="location-coords">Fetching location...</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <motion.div 
            className="stat-card blue"
            whileHover={{ scale: 1.05 }}
          >
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total Assigned</p>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card orange"
            whileHover={{ scale: 1.05 }}
          >
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{stats.inProgress}</h3>
              <p>In Progress</p>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card yellow"
            whileHover={{ scale: 1.05 }}
          >
            <div className="stat-icon">🕐</div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card green"
            whileHover={{ scale: 1.05 }}
          >
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.completed}</h3>
              <p>Completed Today</p>
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-header">
            <h3>Daily Completion Progress</h3>
            <span className="progress-percent">
              {((stats.completed / stats.total) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="progress-bar">
            <motion.div 
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.completed / stats.total) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* Assigned Tasks */}
          <div className="section-card tasks-section">
            <h2>📋 My Assigned Tasks</h2>
            <div className="tasks-list">
              {assignedTasks.map(task => (
                <motion.div
                  key={task.id}
                  className={`task-item ${task.status.toLowerCase().replace(/\s+/g, '-')}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="task-header">
                    <div>
                      <h4>{task.title}</h4>
                      <p className="task-id">{task.complaintId}</p>
                    </div>
                    <span className={`urgency-badge ${task.urgency.toLowerCase()}`}>
                      {task.urgency}
                    </span>
                  </div>

                  <p className="task-description">{task.description}</p>

                  <div className="task-meta">
                    <span className="meta-item">
                      <MapPin size={14} /> {task.location}
                    </span>
                    <span className="meta-item">
                      <Clock size={14} /> Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="task-actions">
                    {task.status !== 'Completed' && (
                      <>
                        {!task.proofUploaded && (
                          <button 
                            className="btn-upload"
                            onClick={() => handleUploadEvidence(task.id)}
                          >
                            <Upload size={16} />
                            Upload Proof
                          </button>
                        )}
                        {task.proofUploaded && (
                          <button 
                            className="btn-complete"
                            onClick={() => handleMarkComplete(task.id)}
                          >
                            <CheckCircle size={16} />
                            Mark Complete
                          </button>
                        )}
                      </>
                    )}
                    {task.status === 'Completed' && (
                      <div className="completed-badge">
                        <CheckCircle size={16} />
                        Completed
                      </div>
                    )}
                  </div>

                  {uploadProgress > 0 && uploadProgress < 100 && task.id === selectedTask && (
                    <div className="upload-progress">
                      <div className="upload-bar" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            <div className="chart-card">
              <h3>📊 Task Priority Distribution</h3>
              <UrgencyChart data={urgencyData} />
            </div>

            <div className="quick-actions-card">
              <h3>⚡ Quick Actions</h3>
              <div className="quick-actions">
                <button className="action-btn">
                  <Camera size={20} />
                  <span>Take Photo</span>
                </button>
                <button className="action-btn">
                  <FileText size={20} />
                  <span>Add Report</span>
                </button>
                <button className="action-btn">
                  <MapPin size={20} />
                  <span>View Map</span>
                </button>
                <button className="action-btn">
                  <Upload size={20} />
                  <span>Upload Files</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldWorkerDashboard;
