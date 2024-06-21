import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ActivateAccount from './features/auth/ActivateAccount';
import Dashboard from './features/dashboard/Dashboard';
import Schedule from './features/appointment/Appointment';
import Reports from './features/reports/Reports';
import Settings from './features/settings/Settings';
import ProtectedRoute from './features/auth/ProtectedRoute';
import ResetPassword from './features/auth/ResetPassword';
import AuthRoute from './features/auth/AuthRoute';
import Layout from './components/Layout';
import NotFound from './features/404/NotFound';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
      <Route path="/activate-account" element={<ActivateAccount />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/appointment" element={<ProtectedRoute><Layout><Schedule /></Layout></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
