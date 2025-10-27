export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

export const validateGST = (gst) => {
  const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return re.test(gst);
};

export const validateCustomer = (data) => {
  const errors = {};

  if (!data.customerName?.trim()) {
    errors.customerName = 'Customer Name is required';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.phoneNumber?.trim()) {
    errors.phoneNumber = 'Phone Number is required';
  } else if (!validatePhone(data.phoneNumber)) {
    errors.phoneNumber = 'Phone must be 10 digits';
  }

  if (!data.businessType) {
    errors.businessType = 'Business Type is required';
  }

  if (data.creditLimit && data.creditLimit < 0) {
    errors.creditLimit = 'Credit Limit cannot be negative';
  }

  if (!data.addressCity?.trim()) {
    errors.addressCity = 'City is required';
  }

  if (!data.addressState?.trim()) {
    errors.addressState = 'State is required';
  }

  if (!data.addressPincode?.trim()) {
    errors.addressPincode = 'Pincode is required';
  } else if (!/^[0-9]{6}$/.test(data.addressPincode)) {
    errors.addressPincode = 'Pincode must be 6 digits';
  }

  if (data.gstNumber && data.gstNumber.trim() && !validateGST(data.gstNumber)) {
    errors.gstNumber = 'Invalid GST format';
  }

  return errors;
};

export const validateInquiry = (data) => {
  const errors = {};

  if (!data.customer) {
    errors.customer = 'Customer is required';
  }

  if (!data.inquiryDate) {
    errors.inquiryDate = 'Inquiry Date is required';
  }

  if (!data.expectedDeliveryDate) {
    errors.expectedDeliveryDate = 'Expected Delivery Date is required';
  } else if (data.expectedDeliveryDate <= data.inquiryDate) {
    errors.expectedDeliveryDate = 'Expected delivery date must be after inquiry date';
  }

  if (!data.lineItems || data.lineItems.length === 0) {
    errors.lineItems = 'At least one line item is required';
  } else {
    data.lineItems.forEach((item, index) => {
      if (!item.productName?.trim()) {
        errors[`lineItem_${index}_productName`] = 'Product Name is required';
      }
      if (!item.quantity || item.quantity <= 0) {
        errors[`lineItem_${index}_quantity`] = 'Valid quantity is required';
      }
      if (!item.unit) {
        errors[`lineItem_${index}_unit`] = 'Unit is required';
      }
    });
  }

  return errors;
};

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const formatDateDisplay = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

