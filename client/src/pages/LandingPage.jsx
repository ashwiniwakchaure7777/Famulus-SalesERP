import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, User, Lock } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl w-full px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="text-blue-600" size={48} />
            <h1 className="text-4xl font-bold text-gray-900 ml-3">Famulus ERP</h1>
          </div>
          <p className="text-xl text-gray-600">Sales Inquiry Management System</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Admin Login */}
          <Link to="/login-user" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Shield className="text-blue-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Admin Login</h2>
              <p className="text-gray-600 text-center mb-4">
                Access the admin dashboard to manage customers, inquiries, and system settings
              </p>
              <div className="mt-6 flex items-center justify-center text-blue-600 font-medium">
                Login as Admin
                <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Customer Login */}
          <Link to="/login-customer" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <User className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Customer Login</h2>
              <p className="text-gray-600 text-center mb-4">
                Access your customer portal to manage inquiries and track orders
              </p>
              <div className="mt-6 flex items-center justify-center text-green-600 font-medium">
                Login as Customer
                <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <Lock className="inline mr-2" size={16} />
          Secure authentication powered by JWT
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

