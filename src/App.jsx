import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import Dashboard from './pages/Dashboard'; 
import ReportsPage from './pages/ReportsPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AccessDenied from './pages/AccessDenied';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<ReportsPage />} /> 
        <Route path="/super-admin-portal-ssk" element={<SuperAdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;