import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, BarChart3, MessageSquare, Settings, 
  LogOut, ChevronLeft, ChevronRight, FileText,
  Users, MapPin, Shield, TrendingUp, Bell
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role-specific menu items
  const getMenuItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', path: `/dashboard/${user.role}`, roles: ['all'] },
      { icon: BarChart3, label: 'Analytics', path: `/dashboard/${user.role}/analytics`, roles: ['all'] },
      { icon: MessageSquare, label: 'AI Assistant', path: `/dashboard/${user.role}/ai-chat`, roles: ['all'] },
    ];

    const roleSpecific = {
      citizen: [
        { icon: FileText, label: 'My Complaints', path: '/dashboard/citizen/complaints', roles: ['citizen'] },
        { icon: Bell, label: 'Notifications', path: '/dashboard/citizen/notifications', roles: ['citizen'] }
      ],
      field: [
        { icon: MapPin, label: 'My Tasks', path: '/dashboard/field/tasks', roles: ['field'] },
        { icon: Users, label: 'Citizens', path: '/dashboard/field/citizens', roles: ['field'] }
      ],
      district: [
        { icon: MapPin, label: 'Ward Map', path: '/dashboard/district/map', roles: ['district'] },
        { icon: Users, label: 'Officers', path: '/dashboard/district/officers', roles: ['district'] },
        { icon: Shield, label: 'Escalations', path: '/dashboard/district/escalations', roles: ['district'] }
      ],
      state: [
        { icon: TrendingUp, label: 'Integrity Index', path: '/dashboard/state/integrity', roles: ['state'] },
        { icon: MapPin, label: 'District Map', path: '/dashboard/state/map', roles: ['state'] },
        { icon: Shield, label: 'Risk Analysis', path: '/dashboard/state/risk', roles: ['state'] }
      ],
      national: [
        { icon: MapPin, label: 'India Map', path: '/dashboard/national/map', roles: ['national'] },
        { icon: Shield, label: 'Compliance', path: '/dashboard/national/compliance', roles: ['national'] },
        { icon: TrendingUp, label: 'Policy AI', path: '/dashboard/national/policy', roles: ['national'] }
      ]
    };

    return [...baseItems, ...(roleSpecific[user.role] || [])];
  };

  const menuItems = getMenuItems();

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🧠</span>
          {!collapsed && <span className="logo-text">GramSetu AI</span>}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* User Profile */}
      <div className="sidebar-user">
        <div className="user-avatar">{user?.avatar || '👤'}</div>
        {!collapsed && (
          <div className="user-info">
            <h4>{user?.name}</h4>
            <span className="user-role">{getRoleBadge(user?.role)}</span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            title={collapsed ? item.label : ''}
          >
            <item.icon className="nav-icon" size={20} />
            {!collapsed && <span className="nav-label">{item.label}</span>}
            {isActive(item.path) && <div className="active-indicator" />}
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        <button 
          className="nav-item"
          onClick={() => navigate(`/dashboard/${user.role}/settings`)}
          title={collapsed ? 'Settings' : ''}
        >
          <Settings className="nav-icon" size={20} />
          {!collapsed && <span className="nav-label">Settings</span>}
        </button>
        
        <button 
          className="nav-item logout-btn"
          onClick={handleLogout}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut className="nav-icon" size={20} />
          {!collapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>

      {/* Digital India Badge */}
      {!collapsed && (
        <div className="sidebar-footer">
          <span className="footer-badge">🇮🇳 Digital India</span>
        </div>
      )}
    </div>
  );
};

const getRoleBadge = (role) => {
  const badges = {
    citizen: 'Citizen',
    field: 'Field Worker',
    district: 'District Officer',
    state: 'State Officer',
    national: 'National Admin'
  };
  return badges[role] || role;
};

export default Sidebar;
