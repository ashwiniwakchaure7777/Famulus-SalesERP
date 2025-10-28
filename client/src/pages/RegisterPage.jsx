import React from 'react';
import { useLocation } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  const location = useLocation();
  const userType = location.pathname.includes('customer') ? 'customer' : 'user';
  const title = userType === 'customer' ? 'Customer Registration' : 'Admin Registration';
  const subtitle = userType === 'customer'
    ? 'Create your account to access inquiries'
    : 'Create your admin account';

  return <RegisterForm userType={userType} title={title} subtitle={subtitle} />;
};

export default RegisterPage;

