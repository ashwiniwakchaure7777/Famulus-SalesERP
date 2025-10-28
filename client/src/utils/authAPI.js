import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8056';

const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  // User authentication
  loginUser: (email, password) => 
    authClient.post('/api/v1/users/login', { email, password }),
  
  registerUser: (data) => 
    authClient.post('/api/v1/users/register', data),

  // Customer authentication
  loginCustomer: (email, password) => 
    authClient.post('/api/v1/customers/login', { email, password }),
  
  registerCustomer: (data) => 
    authClient.post('/api/v1/customers/register', data),
};

export default authAPI;

