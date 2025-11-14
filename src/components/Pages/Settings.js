import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, Mail, Phone, MapPin, Bell, Lock, 
  Palette, Globe, Shield, Database, Save
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    // Profile
    name: user.name,
    email: user.email,
    phone: '+91 98765 43210',
    location: 'Mumbai, Maharashtra',
    avatar: user.avatar || '👤',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    escalationAlerts: true,
    weeklyReports: true,
    
    // Appearance
    theme: 'light',
    language: 'en',
    timezone: 'Asia/Kolkata',
    
    // Privacy
    profileVisibility: 'public',
    dataSharing: true,
    analytics: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Simulate save
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Manage your account preferences and configurations</p>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>Profile Information</h2>
              <p className="section-description">Update your personal information and profile details</p>
              
              <div className="form-group">
                <label>Avatar</label>
                <div className="avatar-selector">
                  {['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '👨‍🔧', '👩‍🔧'].map(emoji => (
                    <button
                      key={emoji}
                      className={`avatar-option ${settings.avatar === emoji ? 'selected' : ''}`}
                      onClick={() => handleChange('avatar', emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label><User size={18} /> Full Name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label><Mail size={18} /> Email Address</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label><Phone size={18} /> Phone Number</label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label><MapPin size={18} /> Location</label>
                <input
                  type="text"
                  value={settings.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                />
              </div>

              <div className="role-badge-display">
                <strong>Role:</strong> <span className="role-badge">{user.role}</span>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              <p className="section-description">Choose how you want to receive updates and alerts</p>
              
              <div className="toggle-group">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <strong>Email Notifications</strong>
                    <span>Receive updates via email</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <strong>SMS Notifications</strong>
                    <span>Get text messages for critical updates</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <strong>Push Notifications</strong>
                    <span>Browser notifications for real-time alerts</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <strong>Escalation Alerts</strong>
                    <span>Immediate notifications for escalated issues</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.escalationAlerts}
                      onChange={(e) => handleChange('escalationAlerts', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <strong>Weekly Reports</strong>
                    <span>Summary reports sent every Monday</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.weeklyReports}
                      onChange={(e) => handleChange('weeklyReports', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Security Settings</h2>
              <p className="section-description">Manage your password and account security</p>
              
              <div className="form-group">
                <label><Lock size={18} /> Current Password</label>
                <input type="password" placeholder="Enter current password" />
              </div>

              <div className="form-group">
                <label><Lock size={18} /> New Password</label>
                <input type="password" placeholder="Enter new password" />
              </div>

              <div className="form-group">
                <label><Lock size={18} /> Confirm Password</label>
                <input type="password" placeholder="Confirm new password" />
              </div>

              <button className="change-password-btn">Change Password</button>

              <div className="security-info">
                <h3>Two-Factor Authentication</h3>
                <p>Add an extra layer of security to your account</p>
                <button className="enable-2fa-btn">Enable 2FA</button>
              </div>

              <div className="security-info">
                <h3>Active Sessions</h3>
                <div className="session-item">
                  <div>
                    <strong>Current Device</strong>
                    <span>Chrome on MacOS • Mumbai, India</span>
                  </div>
                  <span className="session-active">Active Now</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2>Appearance Settings</h2>
              <p className="section-description">Customize the look and feel of your dashboard</p>
              
              <div className="form-group">
                <label><Palette size={18} /> Theme</label>
                <div className="theme-selector">
                  <button 
                    className={`theme-option ${settings.theme === 'light' ? 'selected' : ''}`}
                    onClick={() => handleChange('theme', 'light')}
                  >
                    ☀️ Light
                  </button>
                  <button 
                    className={`theme-option ${settings.theme === 'dark' ? 'selected' : ''}`}
                    onClick={() => handleChange('theme', 'dark')}
                  >
                    🌙 Dark
                  </button>
                  <button 
                    className={`theme-option ${settings.theme === 'auto' ? 'selected' : ''}`}
                    onClick={() => handleChange('theme', 'auto')}
                  >
                    🔄 Auto
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label><Globe size={18} /> Language</label>
                <select 
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Timezone</label>
                <select 
                  value={settings.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                >
                  <option value="Asia/Kolkata">India (IST)</option>
                  <option value="Asia/Dubai">Dubai (GST)</option>
                  <option value="America/New_York">New York (EST)</option>
                  <option value="Europe/London">London (GMT)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h2>Privacy & Data</h2>
              <p className="section-description">Control your data and privacy preferences</p>
              
              <div className="toggle-group">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <strong>Public Profile</strong>
                    <span>Allow others to see your profile information</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.profileVisibility === 'public'}
                      onChange={(e) => handleChange('profileVisibility', e.target.checked ? 'public' : 'private')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <strong>Data Sharing</strong>
                    <span>Share anonymized data for governance improvement</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.dataSharing}
                      onChange={(e) => handleChange('dataSharing', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <strong>Analytics Tracking</strong>
                    <span>Help improve our services with usage analytics</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.analytics}
                      onChange={(e) => handleChange('analytics', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="data-export">
                <h3><Database size={20} /> Data Management</h3>
                <p>Download or delete your personal data</p>
                <div className="data-actions">
                  <button className="export-data-btn">📥 Export My Data</button>
                  <button className="delete-data-btn">🗑️ Delete My Account</button>
                </div>
              </div>
            </div>
          )}

          <div className="settings-actions">
            <button className="save-btn" onClick={handleSave}>
              <Save size={20} />
              {saved ? '✓ Saved!' : 'Save Changes'}
            </button>
            {saved && <span className="save-message">Your settings have been updated successfully!</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
