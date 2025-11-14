import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

// Import components
import SplashScreen from './components/SplashScreen';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import PasswordReset from './components/Auth/PasswordReset';
import GoogleCallback from './components/Auth/GoogleCallback';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Layout/Sidebar';
import CitizenDashboard from './components/Dashboards/CitizenDashboard';
import OfficerDashboard from './components/Dashboards/OfficerDashboard';
import FieldWorkerDashboard from './components/Dashboards/FieldWorkerDashboard';
import DistrictOfficerDashboard from './components/Dashboards/DistrictOfficerDashboard';
import StateOfficerDashboard from './components/Dashboards/StateOfficerDashboard';
import NationalAdminDashboard from './components/Dashboards/NationalAdminDashboard';
import AnimationBackground from './components/AnimationBackground';
import GovernanceGPT from './components/AI/GovernanceGPT';
import Analytics from './components/Pages/Analytics';
import AIChat from './components/Pages/AIChat';
import Settings from './components/Pages/Settings';
import Unauthorized from './components/Auth/Unauthorized';
import OfflineIndicator from './components/UI/OfflineIndicator';
import CSCDashboard from './components/Pages/CSCDashboard';
import AuditTrail from './components/Pages/AuditTrail';
import AdvancedAnalytics from './components/Pages/AdvancedAnalytics';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AnimationBackground color="#64ffda" density={30} speed={0.3} />
          
          {/* Offline Indicator */}
          <OfflineIndicator />
          
          <Routes>
            {/* Login Route */}
            <Route path="/login" element={<Login />} />
            
            {/* Signup Route */}
            <Route path="/signup" element={<Signup />} />
            
            {/* Password Reset Routes */}
            <Route path="/reset-password" element={<PasswordReset />} />
            
            {/* Google OAuth Callback */}
            <Route path="/auth/callback/google" element={<GoogleCallback />} />
            
            {/* Unauthorized Route */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Dashboard Routes with nested pages */}
            <Route path="/dashboard/:role/*" element={<DashboardLayout />} />
            
            {/* CSC Dashboard Route */}
            <Route path="/csc" element={<CSCDashboard />} />
            
            {/* Audit Trail Route */}
            <Route path="/audit" element={<AuditTrail />} />
            
            {/* Advanced Analytics Route */}
            <Route path="/analytics" element={<AdvancedAnalytics />} />
            
            {/* Default redirect to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          
          {/* Governance GPT - Available on all authenticated pages */}
          <GovernanceGPT />
        </div>
      </Router>
    </AuthProvider>
  );
}

// Dashboard Layout Component with nested routing
const DashboardLayout = () => {
  const { role } = useParams();
  
  // Map roles to their dashboard components
  const dashboardComponents = {
    citizen: CitizenDashboard,
    field: FieldWorkerDashboard,
    district: DistrictOfficerDashboard,
    state: StateOfficerDashboard,
    national: NationalAdminDashboard
  };

  const DashboardComponent = dashboardComponents[role];
  
  if (!DashboardComponent) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ProtectedRoute allowedRoles={[role]}>
      <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route index element={<DashboardComponent />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="ai-chat" element={<AIChat />} />
            <Route path="settings" element={<Settings />} />
            {/* Catch-all for role-specific pages - show main dashboard */}
            <Route path="*" element={<DashboardComponent />} />
          </Routes>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default App;