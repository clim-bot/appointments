import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../../components/Layout';
import Profile from './Profile';
import ChangePassword from './ChangePassword';

function Settings() {
  return (
    <Layout>
      <Routes>
        <Route path="profile" element={<Profile />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="*" element={<Profile />} />
      </Routes>
    </Layout>
  );
}

export default Settings;
