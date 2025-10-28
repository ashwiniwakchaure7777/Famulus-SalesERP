import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { inquiryAPI } from '../../utils/api';
import { validateInquiry } from '../../utils/validation';
import { PRIORITY_LEVELS, UNITS } from '../../utils/constants';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import LoadingSpinner from '../common/LoadingSpinner';
import Badge from '../common/Badge';

const InquiryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savingAsDraft, setSavingAsDraft] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStatus, setCurrentStatus] = useState('Draft');
  const [inquiryDetails, setInquiryDetails] = useState(null);

  const [formData, setFormData] = useState({
    inquiryDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '',
    priority: 'Medium',
    remarks: '',
    lineItems: [{ productName: '', description: '', quantity: '', unit: '', expectedUnitPrice: '' }],
  });

  useEffect(() => {
    if (isEdit) {
      fetchInquiry();
    }
  }, [id]);

  useEffect(() => {
    if (currentStatus && ['Submitted', 'Won', 'Lost'].includes(currentStatus)) {
      // Show message that status cannot be changed
      if (currentStatus === 'Submitted') {
        toast('This inquiry has been submitted.', { 
          icon: 'ℹ️',
          duration: 5000 
        });
      }
    }
  }, [currentStatus]);

  const fetchInquiry = async () => {
    try {
      setLoading(true);
      const response = await inquiryAPI.getById(id);
      // API response structure: { status: true, data: inquiry }
      const data = response.data?.data || response.data;
      
      if (!data) {
        toast.error('Inquiry data not found');
        navigate('/inquiries');
        return;
      }
      
      setInquiryDetails(data); // Store inquiry details
      setFormData({
        inquiryDate: data.inquiry_date ? data.inquiry_date.split('T')[0] : '',
        expectedDeliveryDate: data.expected_delivery_date ? data.expected_delivery_date.split('T')[0] : '',
        priority: data.priority || 'Medium',
        remarks: data.remarks || '',
        lineItems: data.lineItems?.length > 0 ? data.lineItems.map(item => ({
          productName: item.product_name || '',
          description: item.description || '',
          quantity: item.quantity || '',
          unit: item.unit || '',
          expectedUnitPrice: item.expected_unit_price || '',
        })) : [{ productName: '', description: '', quantity: '', unit: '', expectedUnitPrice: '' }],
      });
      setCurrentStatus(data.status || 'Draft');
    } catch (error) {
      console.error('Error fetching inquiry:', error);
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

  const saveInquiry = async (newStatus) => {
    try {
      setSubmitting(true);
      const submitData = {
        inquiry_date: formData.inquiryDate,
        expected_delivery_date: formData.expectedDeliveryDate,
        priority: formData.priority,
        remarks: formData.remarks,
        line_items: formData.lineItems.filter(item => item.productName.trim()).map(item => ({
          product_name: item.productName,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          expected_unit_price: item.expectedUnitPrice,
        })),
      };
      
      // Only update status if it's a draft or quoted (customers can't change submitted/won/lost status)
      if (isEdit && (currentStatus === 'Draft' || currentStatus === 'Quoted')) {
        submitData.status = newStatus;
      } else if (!isEdit) {
        // New inquiry can set status
        submitData.status = newStatus;
      }
      // For submitted/won/lost inquiries, don't update status (preserve existing status)
      
      if (isEdit) {
        await inquiryAPI.update(id, submitData);
        const message = newStatus === 'Submitted' && currentStatus !== 'Submitted' 
          ? 'Inquiry submitted successfully' 
          : 'Inquiry updated successfully';
        toast.success(message);
      } else {
        await inquiryAPI.create(submitData);
        toast.success(newStatus === 'Submitted' ? 'Inquiry submitted successfully' : 'Inquiry saved as draft');
      }
      navigate('/inquiries');
    } catch (error) {
      toast.error(error.message || 'Failed to save inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();
    
    // Save as draft without validation
    await saveInquiry('Draft');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out empty line items
    const filteredLineItems = formData.lineItems.filter(item => item.productName.trim());
    
    // Only validate if this is a new submission (not updating an existing submitted inquiry)
    if (currentStatus !== 'Submitted' && currentStatus !== 'Won' && currentStatus !== 'Lost') {
      const validationErrors = validateInquiry({ ...formData, lineItems: filteredLineItems });
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        toast.error('Please fix the errors in the form');
        return;
      }

      // Submit with Submitted status (only for draft/quoted)
      await saveInquiry('Submitted');
    } else {
      // For submitted/won/lost inquiries, just update without changing status
      await saveInquiry(currentStatus);
    }
  };

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
          {/* Inquiry details - read-only fields shown in edit mode */}
          {isEdit && inquiryDetails && (
            <>
              <Input
                label="Inquiry Number"
                name="inquiryNumber"
                type="text"
                value={inquiryDetails.inquiry_number || 'N/A'}
                readOnly
              />
              <Input
                label="Status"
                name="status"
                type="text"
                value={inquiryDetails.status || 'Draft'}
                readOnly
                className="bg-gray-100"
              />
              
            </>
          )}
          <Input
            label="Inquiry Date"
            name="inquiryDate"
            type="date"
            value={formData.inquiryDate}
            onChange={handleChange}
            required
            error={errors.inquiryDate}
            min={new Date().toISOString().split('T')[0]}
          />

          <Input
            label="Expected Delivery Date"
            name="expectedDeliveryDate"
            type="date"
            value={formData.expectedDeliveryDate}
            onChange={handleChange}
            required
            error={errors.expectedDeliveryDate}
            min={formData.inquiryDate || new Date().toISOString().split('T')[0]}
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

        <div className="flex justify-between mt-6">
          <div>
            {currentStatus && (
              <span className="text-sm text-gray-600">
                Status: <span className="font-semibold">{currentStatus}</span>
              </span>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/inquiries')}
            >
              Cancel
            </Button>
            {/* Show Save as Draft button only for Draft and Quoted statuses */}
            {(currentStatus === 'Draft' || currentStatus === 'Quoted' || !currentStatus) && (
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Save as Draft'}
              </Button>
            )}
            {/* Submit button - for Draft/Quoted submits, for Submitted shows as Update */}
            {currentStatus !== 'Won' && currentStatus !== 'Lost' && (
              <Button type="submit" disabled={submitting} onClick={handleSubmit}>
                {submitting 
                  ? 'Saving...' 
                  : currentStatus === 'Submitted' 
                    ? 'Update' 
                    : currentStatus === 'Draft' || currentStatus === 'Quoted'
                      ? 'Submit'
                      : 'Submit'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;

