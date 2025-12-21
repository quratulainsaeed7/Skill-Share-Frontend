// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

import MainLayout from './layouts/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Skills from './pages/Skills/Skills';
import SkillDetails from './pages/SkillDetails/SkillDetails';
import MentorProfile from './pages/MentorProfile/MentorProfile';
import Settings from './pages/Settings/Settings';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import CompleteProfile from './pages/CompleteProfile/CompleteProfile';
import Dashboard from './pages/Dashboard/Dashboard';
import styles from './App.module.css';

// Protected Route Wrapper
const ProtectedRoute = () => {

  // if (loading) return <div>Loading...</div>;
  // if (!user) return <Navigate to="/login" replace />;
  // if (!user.isVerified) return <Navigate to={`/verify-email?email=${user.email}`} replace />;
  // if (!user.profileCompleted && window.location.pathname !== '/complete-profile') {
  //   return <Navigate to="/complete-profile" replace />;
  // }
  return <Outlet />;
};

function App() {
  return (

    <ThemeProvider>
      <BrowserRouter>
        <div className={styles.app}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/skills/:skillId" element={<SkillDetails />} />
              <Route path="/mentors/:mentorId" element={<MentorProfile />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/complete-profile" element={<CompleteProfile />} />
                <Route path="/dashboard" element={<Dashboard />} />
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
