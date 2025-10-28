import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, PlusCircle } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage customers, inquiries, and system settings</p>
      </div>
    </div>
  );
};

export default AdminDashboard;

