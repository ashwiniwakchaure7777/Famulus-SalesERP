import React from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, TrendingUp } from 'lucide-react';
import Button from '../components/common/Button';

const Dashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your ERP Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={32} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Customers</h3>
              <p className="text-gray-600">Manage customer master data</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/customers">
              <Button variant="primary" size="sm" fullWidth>
                View Customers
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="text-green-600" size={32} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Sales Inquiries</h3>
              <p className="text-gray-600">Track and manage inquiries</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/inquiries">
              <Button variant="success" size="sm" fullWidth>
                View Inquiries
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="text-purple-600" size={32} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
              <p className="text-gray-600">View reports and insights</p>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" fullWidth disabled>
              Coming Soon
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/customers/new">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
              <div className="flex items-center">
                <Users className="text-blue-600 mr-3" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-900">Add New Customer</h3>
                  <p className="text-sm text-gray-600">Create a new customer record</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/inquiries/new">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer">
              <div className="flex items-center">
                <FileText className="text-green-600 mr-3" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-900">Create Sales Inquiry</h3>
                  <p className="text-sm text-gray-600">Generate a new inquiry</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

