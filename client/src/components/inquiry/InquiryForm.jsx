import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { inquiryAPI, customerAPI } from '../../utils/api';
import { validateInquiry } from '../../utils/validation';
import { INQUIRY_STATUS, PRIORITY_LEVELS, UNITS } from '../../utils/constants';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import LoadingSpinner from '../common/LoadingSpinner';

const InquiryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    inquiryNumber: '',
    customer: '',
    inquiryDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '',
    status: 'draft',
    priority: 'medium',
    remarks: '',
    lineItems: [{ productName: '', description: '', quantity: '', unit: '', expectedUnitPrice: '' }],
  });

  useEffect(() => {
    fetchCustomers();
    if (isEdit) {
      fetchInquiry();
    }
  }, [id]);

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll({ status: 'active', limit: 1000 });
      setCustomers(response.data.customers || response.data || []);
    } catch (error) {
      toast.error('Failed to fetch customers');
    }
  };

  const fetchInquiry = async () => {
    try {
      setLoading(true);
      const response = await inquiryAPI.getById(id);
      const data = response.data;
      setFormData({
        ...data,
        customer: data.customer?._id || data.customer || '',
        inquiryDate: data.inquiryDate ? data.inquiryDate.split('T')[0] : '',
        expectedDeliveryDate: data.expectedDeliveryDate ? data.expectedDeliveryDate.split('T')[0] : '',
        lineItems: data.lineItems?.length > 0 ? data.lineItems : [{ productName: '', description: '', quantity: '', unit: '', expectedUnitPrice: '' }],
      });
    } catch (error) {
      toast.error('Failed to fetch inquiry');
      navigate('/inquiries');
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
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleLineItemChange = (index, field, value) => {
    setFormData((prev) => {
      const newLineItems = [...prev.lineItems];
      newLineItems[index][field] = value;
      return { ...prev, lineItems: newLineItems };
    });
  };

  const addLineItem = () => {
    setFormData((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, { productName: '', description: '', quantity: '', unit: '', expectedUnitPrice: '' }],
    }));
  };

  const removeLineItem = (index) => {
    if (formData.lineItems.length > 1) {
      setFormData((prev) => ({
        ...prev,
        lineItems: prev.lineItems.filter((_, i) => i !== index),
      }));
    } else {
      toast.error('At least one line item is required');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out empty line items
    const filteredLineItems = formData.lineItems.filter(item => item.productName.trim());
    
    const validationErrors = validateInquiry({ ...formData, lineItems: filteredLineItems });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setSubmitting(true);
      const submitData = {
        ...formData,
        lineItems: filteredLineItems,
        totalItemsCount: filteredLineItems.length,
      };
      
      if (isEdit) {
        await inquiryAPI.update(id, submitData);
        toast.success('Inquiry updated successfully');
      } else {
        await inquiryAPI.create(submitData);
        toast.success('Inquiry created successfully');
      }
      navigate('/inquiries');
    } catch (error) {
      toast.error(error.message || 'Failed to save inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  const customerOptions = customers.map((cust) => ({
    value: cust._id,
    label: `${cust.customerName} (${cust.customerCode})`,
  }));

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Sales Inquiry' : 'New Sales Inquiry'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Input
            label="Inquiry Number"
            name="inquiryNumber"
            value={formData.inquiryNumber}
            disabled
            error={errors.inquiryNumber}
            placeholder="Auto-generated"
          />

          <Select
            label="Customer"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            options={customerOptions}
            required
            error={errors.customer}
          />

          <Input
            label="Inquiry Date"
            name="inquiryDate"
            type="date"
            value={formData.inquiryDate}
            onChange={handleChange}
            required
            error={errors.inquiryDate}
          />

          <Input
            label="Expected Delivery Date"
            name="expectedDeliveryDate"
            type="date"
            value={formData.expectedDeliveryDate}
            onChange={handleChange}
            required
            error={errors.expectedDeliveryDate}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={INQUIRY_STATUS}
            error={errors.status}
            fullWidth={false}
          />

          <Select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            options={PRIORITY_LEVELS}
            error={errors.priority}
            fullWidth={false}
          />

          <div className="md:col-span-2">
            <Input
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              fullWidth
            />
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Line Items</h2>
            <Button type="button" variant="primary" size="sm" onClick={addLineItem}>
              <Plus className="mr-2" size={16} />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {formData.lineItems.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                  {formData.lineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Product Name"
                      value={item.productName}
                      onChange={(e) => handleLineItemChange(index, 'productName', e.target.value)}
                      required
                      fullWidth={false}
                      error={errors[`lineItem_${index}_productName`]}
                    />
                  </div>

                  <div>
                    <Select
                      label="Unit"
                      options={UNITS}
                      value={item.unit}
                      onChange={(e) => handleLineItemChange(index, 'unit', e.target.value)}
                      required
                      error={errors[`lineItem_${index}_unit`]}
                    />
                  </div>

                  <div>
                    <Input
                      label="Description"
                      value={item.description}
                      onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                      fullWidth={false}
                    />
                  </div>

                  <div>
                    <Input
                      label="Quantity"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                      required
                      fullWidth={false}
                      error={errors[`lineItem_${index}_quantity`]}
                    />
                  </div>

                  <div>
                    <Input
                      label="Expected Unit Price"
                      type="number"
                      value={item.expectedUnitPrice}
                      onChange={(e) => handleLineItemChange(index, 'expectedUnitPrice', e.target.value)}
                      fullWidth={false}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {errors.lineItems && (
            <p className="mt-2 text-sm text-red-600">{errors.lineItems}</p>
          )}

          <div className="mt-4 text-sm text-gray-600">
            Total Items: <span className="font-semibold">{formData.lineItems.filter(item => item.productName.trim()).length}</span>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/inquiries')}
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

export default InquiryForm;

