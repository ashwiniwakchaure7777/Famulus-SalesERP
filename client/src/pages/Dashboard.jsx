import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import CustomerDashboard from '../components/dashboard/CustomerDashboard';

const Dashboard = () => {
  const { user, isAdmin, isCustomer } = useAuth();

  if (isAdmin()) {
    return <AdminDashboard />;
  }

  if (isCustomer()) {
    return <CustomerDashboard />;
  }

  return null;
};

export default Dashboard;

