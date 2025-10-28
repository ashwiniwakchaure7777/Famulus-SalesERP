import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import CustomerList from './components/customer/CustomerList';
import CustomerForm from './components/customer/CustomerForm';
import InquiryList from './components/inquiry/InquiryList';
import InquiryForm from './components/inquiry/InquiryForm';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LandingPage />} />
          <Route path="/login-user" element={<LoginPage />} />
          <Route path="/login-customer" element={<LoginPage />} />
          <Route path="/register-user" element={<RegisterPage />} />
          <Route path="/register-customer" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute requireAuth>
                <Navbar />
                <div className="max-w-7xl mx-auto">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    
                    {/* Customer Management - Admin Only */}
                    <Route
                      path="/customers"
                      element={
                        <ProtectedRoute allowedRoles={['user']}>
                          <CustomerList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/customers/new"
                      element={
                        <ProtectedRoute allowedRoles={['user']}>
                          <CustomerForm />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/customers/:id"
                      element={
                        <ProtectedRoute allowedRoles={['user']}>
                          <CustomerForm />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/customers/:id/edit"
                      element={
                        <ProtectedRoute allowedRoles={['user']}>
                          <CustomerForm />
                        </ProtectedRoute>
                      }
                    />

                    {/* Sales Inquiries - Both Admin and Customer */}
                    <Route path="/inquiries" element={<InquiryList />} />
                    <Route path="/inquiries/new" element={<InquiryForm />} />
                    <Route path="/inquiries/:id" element={<InquiryForm />} />
                    <Route path="/inquiries/:id/edit" element={<InquiryForm />} />
                  </Routes>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;

