import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import Select from '../common/Select';
import toast from 'react-hot-toast';

const RegisterForm = ({ userType = 'user', title, subtitle }) => {
  const navigate = useNavigate();
  const { registerUser, registerCustomer } = useAuth();
  const [formData, setFormData] = useState({
    ...(userType === 'user' 
      ? {
          first_name: '',
          last_name: '',
          email: '',
          phone_number: '',
          password: '',
          confirmPassword: '',
        }
      : {
          customer_name: '',
          email: '',
          phone_number: '',
          business_type: '',
          address_street: '',
          address_city: '',
          address_state: '',
          address_pincode: '',
          gst_number: '',
          password: '',
          confirmPassword: '',
        }
    ),
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone number validation
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone_number.replace(/\s/g, ''))) {
      newErrors.phone_number = 'Please provide a valid phone number';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // User-specific fields
    if (userType === 'user') {
      if (!formData.first_name.trim()) {
        newErrors.first_name = 'First name is required';
      } else if (formData.first_name.length < 2) {
        newErrors.first_name = 'First name must be at least 2 characters';
      }

      if (!formData.last_name.trim()) {
        newErrors.last_name = 'Last name is required';
      } else if (formData.last_name.length < 2) {
        newErrors.last_name = 'Last name must be at least 2 characters';
      }
    }

    // Customer-specific fields
    if (userType === 'customer') {
      if (!formData.customer_name.trim()) {
        newErrors.customer_name = 'Customer name is required';
      } else if (formData.customer_name.length < 2) {
        newErrors.customer_name = 'Customer name must be at least 2 characters';
      }

      if (!formData.business_type) {
        newErrors.business_type = 'Business type is required';
      }

      if (!formData.address_street.trim()) {
        newErrors.address_street = 'Street address is required';
      }

      if (!formData.address_city.trim()) {
        newErrors.address_city = 'City is required';
      }

      if (!formData.address_state.trim()) {
        newErrors.address_state = 'State is required';
      }

      if (!formData.address_pincode.trim()) {
        newErrors.address_pincode = 'Pincode is required';
      } else if (!/^[1-9][0-9]{5}$/.test(formData.address_pincode)) {
        newErrors.address_pincode = 'Pincode must be a valid 6-digit number';
      }

      if (formData.gst_number && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst_number)) {
        newErrors.gst_number = 'Please provide a valid GST number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    // Send all data including confirmPassword - backend will validate and remove it
    
    const result = userType === 'user' 
      ? await registerUser(formData)
      : await registerCustomer(formData);
    
    setLoading(false);

    if (result.success) {
      toast.success(result.message || 'Registration successful! Please login.');
      navigate(`/login-${userType}`);
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            <p className="mt-2 text-gray-600">{subtitle}</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {userType === 'user' ? (
                <>
                  <Input
                    label="First Name"
                    name="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleChange}
                    error={errors.first_name}
                    placeholder="Enter your first name"
                  />

                  <Input
                    label="Last Name"
                    name="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleChange}
                    error={errors.last_name}
                    placeholder="Enter your last name"
                  />
                </>
              ) : (
                <>
                  <Input
                    label="Customer Name"
                    name="customer_name"
                    type="text"
                    value={formData.customer_name}
                    onChange={handleChange}
                    error={errors.customer_name}
                    placeholder="Enter your customer name"
                  />

                  <Select
                    label="Business Type"
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleChange}
                    error={errors.business_type}
                    placeholder="Select business type"
                    options={[
                      { value: 'Retailer', label: 'Retailer' },
                      { value: 'Wholesaler', label: 'Wholesaler' },
                      { value: 'Distributor', label: 'Distributor' },
                    ]}
                  />
                </>
              )}

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Enter your email"
                autoComplete="email"
              />

              <Input
                label="Phone Number"
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleChange}
                error={errors.phone_number}
                placeholder="Enter your phone number"
              />

              {userType === 'customer' && (
                <>
                  <Input
                    label="Street Address"
                    name="address_street"
                    type="text"
                    value={formData.address_street}
                    onChange={handleChange}
                    error={errors.address_street}
                    placeholder="Enter street address"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City"
                      name="address_city"
                      type="text"
                      value={formData.address_city}
                      onChange={handleChange}
                      error={errors.address_city}
                      placeholder="Enter city"
                    />

                    <Input
                      label="State"
                      name="address_state"
                      type="text"
                      value={formData.address_state}
                      onChange={handleChange}
                      error={errors.address_state}
                      placeholder="Enter state"
                    />
                  </div>

                  <Input
                    label="Pincode"
                    name="address_pincode"
                    type="text"
                    value={formData.address_pincode}
                    onChange={handleChange}
                    error={errors.address_pincode}
                    placeholder="Enter pincode"
                  />

                  <Input
                    label="GST Number (Optional)"
                    name="gst_number"
                    type="text"
                    value={formData.gst_number}
                    onChange={handleChange}
                    error={errors.gst_number}
                    placeholder="Enter GST number (optional)"
                  />
                </>
              )}

              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Enter your password"
                autoComplete="new-password"
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate(`/login-${userType}`)}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

