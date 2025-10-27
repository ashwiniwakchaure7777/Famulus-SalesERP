import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { customerAPI } from '../../utils/api';
import { validateCustomer } from '../../utils/validation';
import { BUSINESS_TYPES, CUSTOMER_STATUS } from '../../utils/constants';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import LoadingSpinner from '../common/LoadingSpinner';

const CustomerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    customerCode: '',
    customerName: '',
    email: '',
    phoneNumber: '',
    businessType: '',
    creditLimit: 50000,
    addressStreet: '',
    addressCity: '',
    addressState: '',
    addressPincode: '',
    gstNumber: '',
    status: 'active',
  });

  useEffect(() => {
    if (isEdit) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getById(id);
      setFormData(response.data);
    } catch (error) {
      toast.error('Failed to fetch customer');
      navigate('/customers');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateCustomer(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setSubmitting(true);
      if (isEdit) {
        await customerAPI.update(id, formData);
        toast.success('Customer updated successfully');
      } else {
        await customerAPI.create(formData);
        toast.success('Customer created successfully');
      }
      navigate('/customers');
    } catch (error) {
      toast.error(error.message || 'Failed to save customer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Customer' : 'Add New Customer'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Customer Code"
            name="customerCode"
            value={formData.customerCode}
            disabled
            error={errors.customerCode}
            placeholder="Auto-generated"
          />

          <Input
            label="Customer Name"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            error={errors.customerName}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            error={errors.email}
          />

          <Input
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            error={errors.phoneNumber}
          />

          <Select
            label="Business Type"
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            options={BUSINESS_TYPES}
            required
            error={errors.businessType}
          />

          <Input
            label="Credit Limit"
            name="creditLimit"
            type="number"
            value={formData.creditLimit}
            onChange={handleChange}
            error={errors.creditLimit}
          />

          <Input
            label="Street Address"
            name="addressStreet"
            value={formData.addressStreet}
            onChange={handleChange}
            fullWidth
          />

          <div className="md:col-span-1">
            <Input
              label="City"
              name="addressCity"
              value={formData.addressCity}
              onChange={handleChange}
              required
              error={errors.addressCity}
            />
          </div>

          <Input
            label="State"
            name="addressState"
            value={formData.addressState}
            onChange={handleChange}
            required
            error={errors.addressState}
          />

          <Input
            label="Pincode"
            name="addressPincode"
            value={formData.addressPincode}
            onChange={handleChange}
            required
            error={errors.addressPincode}
          />

          <Input
            label="GST Number"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            error={errors.gstNumber}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={CUSTOMER_STATUS}
            fullWidth={false}
          />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/customers')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;

