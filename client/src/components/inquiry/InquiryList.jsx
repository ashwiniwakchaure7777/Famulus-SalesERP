import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { inquiryAPI } from '../../utils/api';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import LoadingSpinner from '../common/LoadingSpinner';
import Badge from '../common/Badge';
import DeleteConfirm from '../common/DeleteConfirm';
import { INQUIRY_STATUS, PRIORITY_LEVELS } from '../../utils/constants';
import { formatDateDisplay } from '../../utils/validation';

const InquiryList = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, inquiry: null });

  const pageSize = 10;

  useEffect(() => {
    fetchInquiries();
    fetchStatusCounts();
  }, [currentPage, filterStatus, filterPriority, dateFrom, dateTo]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
        status: filterStatus,
        priority: filterPriority,
        dateFrom,
        dateTo,
      };
      const response = await inquiryAPI.getAll(params);
      setInquiries(response.data.inquiries || response.data);
      setTotalPages(Math.ceil((response.data.total || response.data.length) / pageSize));
    } catch (error) {
      toast.error('Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusCounts = async () => {
    try {
      const response = await inquiryAPI.getByStatus();
      setStatusCounts(response.data || {});
    } catch (error) {
      console.error('Failed to fetch status counts');
    }
  };

  const handleDelete = async () => {
    try {
      const inquiry = deleteConfirm.inquiry;
      if (inquiry.status === 'won' || inquiry.status === 'lost') {
        toast.error('Cannot delete inquiry with Won or Lost status');
        setDeleteConfirm({ open: false, inquiry: null });
        return;
      }
      await inquiryAPI.delete(inquiry._id);
      toast.success('Inquiry deleted successfully');
      setDeleteConfirm({ open: false, inquiry: null });
      fetchInquiries();
      fetchStatusCounts();
    } catch (error) {
      toast.error('Failed to delete inquiry');
    }
  };

  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      await inquiryAPI.updateStatus(inquiryId, newStatus);
      toast.success('Status updated successfully');
      fetchInquiries();
      fetchStatusCounts();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading && inquiries.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales Inquiries</h1>
        <Button onClick={() => navigate('/inquiries/new')}>
          <Plus className="mr-2" size={20} />
          New Inquiry
        </Button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-2xl font-bold text-gray-900">
            {Object.values(statusCounts).reduce((a, b) => a + b, 0)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="text-sm text-gray-600">Draft</div>
          <div className="text-2xl font-bold text-gray-900">{statusCounts.draft || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="text-sm text-gray-600">Quoted</div>
          <div className="text-2xl font-bold text-gray-900">{statusCounts.quoted || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-sm text-gray-600">Won</div>
          <div className="text-2xl font-bold text-gray-900">{statusCounts.won || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="text-sm text-gray-600">Lost</div>
          <div className="text-2xl font-bold text-gray-900">{statusCounts.lost || 0}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Select
            options={INQUIRY_STATUS}
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Status"
            fullWidth
          />
          <Select
            options={PRIORITY_LEVELS}
            value={filterPriority}
            onChange={(e) => {
              setFilterPriority(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Priority"
            fullWidth
          />
          <Input
            type="date"
            placeholder="From Date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setCurrentPage(1);
            }}
            fullWidth
          />
          <Input
            type="date"
            placeholder="To Date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setCurrentPage(1);
            }}
            fullWidth
          />
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setFilterStatus('');
                setFilterPriority('');
                setDateFrom('');
                setDateTo('');
                setCurrentPage(1);
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inquiry No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inquiry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No inquiries found
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {inquiry.inquiryNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inquiry.customer?.customerName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateDisplay(inquiry.inquiryDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateDisplay(inquiry.expectedDeliveryDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={inquiry.status}
                        onChange={(e) => handleStatusChange(inquiry._id, e.target.value)}
                        className={`border-none bg-transparent ${Badge} focus:outline-none cursor-pointer`}
                      >
                        {INQUIRY_STATUS.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge status={inquiry.priority}>{inquiry.priority}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inquiry.totalItemsCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/inquiries/${inquiry._id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye size={18} />
                        </button>
                        {inquiry.status !== 'won' && inquiry.status !== 'lost' && (
                          <>
                            <button
                              onClick={() => navigate(`/inquiries/${inquiry._id}/edit`)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ open: true, inquiry })}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - same as CustomerList */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * pageSize, totalPages * pageSize)}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    return null;
                  })}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      <DeleteConfirm
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, inquiry: null })}
        onConfirm={handleDelete}
        title="Delete Inquiry"
        message={`Are you sure you want to delete inquiry "${deleteConfirm.inquiry?.inquiryNumber}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default InquiryList;

