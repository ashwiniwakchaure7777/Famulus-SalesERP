import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/authAPI';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, userType) => {
    try {
      let response;
      if (userType === 'user') {
        response = await authAPI.loginUser(email, password);
      } else {
        response = await authAPI.loginCustomer(email, password);
      }

      // API response structure: { status, message, data: { user/customer, token } }
      const { data } = response.data;
      const token = data.token;
      const userOrCustomer = data.user || data.customer;
      
      // Store token and user data with type
      const userWithType = { ...userOrCustomer, type: userType };
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userWithType));
      
      setUser(userWithType);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await authAPI.registerUser(userData);
      // Check if backend response has status field (some APIs use status, others use success)
      const isSuccess = response.data?.status || response.data?.success;
      if (isSuccess) {
        return { success: true, message: response.data?.message };
      } else {
        return { 
          success: false, 
          error: Array.isArray(response.data?.message) 
            ? response.data.message.join(', ') 
            : response.data?.message || 'Registration failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: Array.isArray(error.response?.data?.message) 
          ? error.response.data.message.join(', ') 
          : error.response?.data?.message || error.message || 'Registration failed' 
      };
    }
  };

  const registerCustomer = async (customerData) => {
    try {
      const response = await authAPI.registerCustomer(customerData);
      // Check if backend response has status field
      const isSuccess = response.data?.status || response.data?.success;
      if (isSuccess) {
        return { success: true, message: response.data?.message };
      } else {
        return { 
          success: false, 
          error: Array.isArray(response.data?.message) 
            ? response.data.message.join(', ') 
            : response.data?.message || 'Registration failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: Array.isArray(error.response?.data?.message) 
          ? error.response.data.message.join(', ') 
          : error.response?.data?.message || error.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    // Clear all authentication-related data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const isAuthenticated = () => !!user;
  const isAdmin = () => user?.type === 'user';
  const isCustomer = () => user?.type === 'customer';

  const value = {
    user,
    loading,
    login,
    logout,
    registerUser,
    registerCustomer,
    isAuthenticated,
    isAdmin,
    isCustomer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

