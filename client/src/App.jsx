import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ConnectivityProvider } from './context/ConnectivityContext';

import RootLayout from './layouts/RootLayout';
import LandingPage from './pages/LandingPage';
import CitizenDashboard from './pages/CitizenDashboard';
import VoiceAssistantPage from './pages/VoiceAssistantPage';
import SchemeExplorerPage from './pages/SchemeExplorerPage';
import EligibilityCheckerPage from './pages/EligibilityCheckerPage';
import DocumentChecklistPage from './pages/DocumentChecklistPage';
import HelplineDirectoryPage from './pages/HelplineDirectoryPage';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-4 border-teal-800 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <ConnectivityProvider>
            <Routes>
              <Route path="/" element={<RootLayout />}>
                <Route index element={<LandingPage />} />
                <Route path="assistant" element={<VoiceAssistantPage />} />
                <Route path="schemes" element={<SchemeExplorerPage />} />
                <Route path="eligibility" element={<EligibilityCheckerPage />} />
                <Route path="documents" element={<DocumentChecklistPage />} />
                <Route path="helplines" element={<HelplineDirectoryPage />} />
                <Route path="dashboard" element={<CitizenDashboard />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route
                  path="volunteer"
                  element={
                    <ProtectedRoute requiredRole="volunteer">
                      <VolunteerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </ConnectivityProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
