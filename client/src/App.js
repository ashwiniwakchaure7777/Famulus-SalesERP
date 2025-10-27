import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import CustomerList from './components/customer/CustomerList';
import CustomerForm from './components/customer/CustomerForm';
import InquiryList from './components/inquiry/InquiryList';
import InquiryForm from './components/inquiry/InquiryForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/new" element={<CustomerForm />} />
          <Route path="/customers/:id" element={<CustomerForm />} />
          <Route path="/customers/:id/edit" element={<CustomerForm />} />
          <Route path="/inquiries" element={<InquiryList />} />
          <Route path="/inquiries/new" element={<InquiryForm />} />
          <Route path="/inquiries/:id" element={<InquiryForm />} />
          <Route path="/inquiries/:id/edit" element={<InquiryForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

