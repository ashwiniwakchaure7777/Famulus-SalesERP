import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { customerAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import LoadingSpinner from '../common/LoadingSpinner';
import Badge from '../common/Badge';
import DeleteConfirm from '../common/DeleteConfirm';
import { BUSINESS_TYPES, CUSTOMER_STATUS } from '../../utils/constants';
import { formatDateDisplay } from '../../utils/validation';

const CustomerList = () => {
  const navigate = useNavigate();
  const { isAdmin, isCustomer } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBusinessType, setFilterBusinessType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, customer: null });

  const pageSize = 10;

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, filterBusinessType, filterStatus, searchTerm]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
        business_type: filterBusinessType,
        status: filterStatus,
        search: searchTerm,
      };
      const response = await customerAPI.getAll(params);
      // Handle response structure properly
      const customersData = response.data?.data || response.data || [];
      setCustomers(Array.isArray(customersData) ? customersData : []);
      // Use pagination from response if available, otherwise fall back to total count
      if (response.data?.pagination?.totalPages) {
        setTotalPages(response.data.pagination.totalPages);
      } else {
        const totalCount = response.data?.pagination?.totalDocuments || response.data?.count || 0;
        setTotalPages(Math.ceil(totalCount / pageSize));
      }
    } catch (error) {
      toast.error('Failed to fetch customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await customerAPI.delete(deleteConfirm.customer.ID);
      toast.success('Customer deleted successfully');
      setDeleteConfirm({ open: false, customer: null });
      fetchCustomers();
    } catch (error) {
      toast.error('Failed to delete customer');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading && customers.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Master</h1>
        {!isAdmin() && (
          <Button onClick={() => navigate('/customers/new')}>
            <Plus className="mr-2" size={20} />
            Add Customer
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search by name or code..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            fullWidth
          />
          <Select
            options={BUSINESS_TYPES}
            value={filterBusinessType}
            onChange={(e) => {
              setFilterBusinessType(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Business Type"
            fullWidth
          />
          <Select
            options={CUSTOMER_STATUS}
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Status"
            fullWidth
          />
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setFilterBusinessType('');
                setFilterStatus('');
                setCurrentPage(1);
              }}
            >
              Clear Filters
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
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.ID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.customer_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.phone_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.business_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge status={customer.status?.toLowerCase()}>{customer.status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateDisplay(customer.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/customers/${customer.ID}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/customers/${customer.ID}/edit`)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ open: true, customer })}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
        onClose={() => setDeleteConfirm({ open: false, customer: null })}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete customer "${deleteConfirm.customer?.customer_name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default CustomerList;

