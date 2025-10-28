import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { inquiryAPI } from '../../utils/api';
import { FileText, PlusCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import LoadingSpinner from '../common/LoadingSpinner';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    submitted: 0,
    quoted: 0,
    won: 0,
  });

  useEffect(() => {
    if (user) {
      fetchInquiries();
      fetchStatusCounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      
      // Fetch recent inquiries for display
      const response = await inquiryAPI.getAll({
        customer_id: user?.customer_id || user?.id,
        limit: 5,
        page: 1,
      });
      
      // API returns: { data: [...inquiries] } or { data: { data: [...inquiries], pagination } }
      const inquiries = response.data.data || response.data || [];
      setInquiries(Array.isArray(inquiries) ? inquiries : []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusCounts = async () => {
    try {
      const response = await inquiryAPI.getByStatus();
      const counts = response.data?.data || response.data || {};
      setStats({
        total: (counts.draft || 0) + (counts.submitted || 0) + (counts.quoted || 0) + (counts.won || 0) + (counts.lost || 0),
        draft: counts.draft || 0,
        submitted: counts.submitted || 0,
        quoted: counts.quoted || 0,
        won: counts.won || 0,
      });
    } catch (error) {
      console.error('Error fetching status counts:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      quoted: 'bg-yellow-100 text-yellow-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.draft;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
        return <Clock className="mr-2" size={16} />;
      case 'quoted':
      case 'won':
        return <CheckCircle className="mr-2" size={16} />;
      case 'lost':
        return <XCircle className="mr-2" size={16} />;
      default:
        return <FileText className="mr-2" size={16} />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name || 'Customer'}!</h1>
        <p className="text-gray-600 mt-2">Manage your sales inquiries and orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Inquiries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
            </div>
            <FileText className="text-gray-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Submitted</p>
              <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
            </div>
            <Clock className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Quoted</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.quoted}</p>
            </div>
            <CheckCircle className="text-yellow-600" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Inquiries</h2>
          <Link to="/inquiries">
            <Button variant="primary" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : inquiries.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 mb-4">No inquiries yet</p>
            <Link to="/inquiries/new">
              <Button variant="primary">
                <PlusCircle className="mr-2" size={18} />
                Create First Inquiry
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-gray-900 mr-3">
                        {inquiry.inquiry_number}
                      </h3>
                      <Badge className={getStatusColor(inquiry.status)}>
                        {getStatusIcon(inquiry.status)}
                        {inquiry.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {inquiry.inquiry_date && new Date(inquiry.inquiry_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Link to={`/inquiries/${inquiry.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Ready to place an order?</h3>
            <p className="text-blue-100">Create a new sales inquiry to get started</p>
          </div>
          <Link to="/inquiries/new">
            <Button variant="secondary" size="lg">
              <PlusCircle className="mr-2" size={20} />
              New Inquiry
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;

