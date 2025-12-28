// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';
import Skills from './pages/Skills/Skills';
import SkillDetails from './pages/SkillDetails/SkillDetails';
import MentorProfile from './pages/MentorProfile/MentorProfile';
import Settings from './pages/Settings/Settings';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import CompleteProfile from './pages/CompleteProfile/CompleteProfile';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import Wallet from './pages/Wallet/Wallet';
import Meetings from './pages/Meetings/Meetings';
import CreateSkill from './pages/CreateSkill/CreateSkill';
import UserService from './services/userService';
import styles from './App.module.css';

// Admin Imports
import AdminLayout from './layouts/AdminLayout/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import UserManagement from './pages/Admin/Users/UserManagement';
import CategoryManagement from './pages/Admin/Categories/CategoryManagement';
import FinanceMonitoring from './pages/Admin/Finance/FinanceMonitoring';

// Protected Route Wrapper - uses UserService for auth check
const ProtectedRoute = () => {
  // Use centralized UserService instead of direct localStorage access
  const isAuthenticated = UserService.isAuthenticated();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};

function App() {
  return (

    <ThemeProvider>
      <BrowserRouter>
        <div className={styles.app}>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="finance" element={<FinanceMonitoring />} />
            </Route>

            {/* Auth Routes - No Layout */}
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />

            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/skills/:skillId" element={<SkillDetails />} />
              <Route path="/mentors/:mentorId" element={<MentorProfile />} />



              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/complete-profile" element={<CompleteProfile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create-skill" element={<CreateSkill />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/meetings" element={<Meetings />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;
