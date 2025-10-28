import React from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  const location = useLocation();
  const userType = location.pathname.includes('customer') ? 'customer' : 'user';
  const title = userType === 'customer' ? 'Customer Login' : 'Admin Login';
  const subtitle = userType === 'customer'
    ? 'Access your account to manage inquiries'
    : 'Access the admin panel';

  return <LoginForm userType={userType} title={title} subtitle={subtitle} />;
};

export default LoginPage;

