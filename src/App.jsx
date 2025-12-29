// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';
import Skills from './pages/Skills/Skills';
import SkillDetails from './pages/SkillDetails/SkillDetails';
import MentorProfile from './pages/MentorProfile/MentorProfile';
import Settings from './pages/Settings/Settings';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import CompleteProfile from './pages/CompleteProfile/CompleteProfile';
import Profile from './pages/Profile/Profile';
import Wallet from './pages/Wallet/Wallet';
import Meetings from './pages/Meetings/Meetings';
import CreateSkill from './pages/CreateSkill/CreateSkill';
import ProtectedRoute from './components/common/ProtectedRoute';
import styles from './App.module.css';

// Admin Imports
import AdminLayout from './layouts/AdminLayout/AdminLayout';
import UserManagement from './pages/Admin/Users/UserManagement';
import CategoryManagement from './pages/Admin/Categories/CategoryManagement';
import FinanceMonitoring from './pages/Admin/Finance/FinanceMonitoring';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className={styles.app}>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="users" replace />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="finance" element={<FinanceMonitoring />} />
              </Route>

              {/* Auth Routes - No Layout */}
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />

              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />

                {/* 
                  Workflow Checkpoint Routes (requires authentication but bypasses email/profile checks)
                  - /verify-email: User must verify email before accessing protected routes
                  - /complete-profile: User must complete profile before accessing protected routes
                */}
                <Route path="/verify-email" element={
                  <ProtectedRoute bypassWorkflow={true}>
                    <VerifyEmail />
                  </ProtectedRoute>
                } />
                <Route path="/complete-profile" element={
                  <ProtectedRoute bypassWorkflow={true}>
                    <CompleteProfile />
                  </ProtectedRoute>
                } />

                {/* Public routes */}
                <Route path="/skills" element={<Skills />} />
                <Route path="/mentors/:mentorId" element={<MentorProfile />} />

                {/* Dynamic route - must be after specific routes */}
                <Route path="/skills/:skillId" element={<SkillDetails />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/create-skill" element={
                  <ProtectedRoute>
                    <CreateSkill />
                  </ProtectedRoute>
                } />
                <Route path="/wallet" element={
                  <ProtectedRoute>
                    <Wallet />
                  </ProtectedRoute>
                } />
                <Route path="/meetings" element={
                  <ProtectedRoute>
                    <Meetings />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
