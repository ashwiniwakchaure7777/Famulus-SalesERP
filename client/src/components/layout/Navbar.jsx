import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, FileText, Home, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isCustomer } = useAuth();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    // Use window.location to force a full page reload and clear all state
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="text-xl font-bold text-gray-900">
                Famulus ERP
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/dashboard') || location.pathname === '/'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Home className="mr-2" size={18} />
                Dashboard
              </Link>
              
              {/* Admin-only navigation */}
              {isAdmin() && (
                <Link
                  to="/customers"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/customers')
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Users className="mr-2" size={18} />
                  Customers
                </Link>
              )}
              
              <Link
                to="/inquiries"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/inquiries')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <FileText className="mr-2" size={18} />
                {isCustomer() ? 'My Inquiries' : 'Sales Inquiries'}
              </Link>
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex sm:items-center sm:space-x-2">
              <User className="text-gray-500" size={18} />
              <span className="text-sm text-gray-700">
                {user?.name || user?.customer_name || 'User'}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {isAdmin() ? 'Admin' : 'Customer'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

