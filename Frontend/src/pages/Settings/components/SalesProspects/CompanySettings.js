import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../Services/api';

const CompanySettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    vat_number: '',
    is_default: false,
    logo: ''
  });

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/company');
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        const company = response.data.data[0]; // Get the first company (Drighna Technology)
        setFormData({
          name: company.name || '',
          address: company.address || '',
          phone: company.phone || '',
          email: company.email || '',
          website: company.website || '',
          vat_number: company.vat_number || '',
          is_default: company.is_default === 1,
          logo: company.logo || ''
        });
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
      toast.error('Failed to load company data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Company name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await api.put(`/company/1`, formData); // Update the existing company
      
      if (response.data.success) {
        toast.success('Company settings saved successfully');
        fetchCompanyData(); // Refresh data after update
      }
    } catch (error) {
      console.error('Error saving company settings:', error);
      toast.error(error.response?.data?.message || 'Failed to save company settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#1a1f2e] rounded-lg text-white">
      <h2 className="text-2xl font-semibold mb-6">Company Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Company Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 bg-[#2a3041] border border-[#3a4054] rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="Enter company name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Company Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows="4"
            className="w-full p-3 bg-[#2a3041] border border-[#3a4054] rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="Enter company address"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-3 bg-[#2a3041] border border-[#3a4054] rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 bg-[#2a3041] border border-[#3a4054] rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full p-3 bg-[#2a3041] border border-[#3a4054] rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter website URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">VAT Number</label>
            <input
              type="text"
              name="vat_number"
              value={formData.vat_number}
              onChange={handleInputChange}
              className="w-full p-3 bg-[#2a3041] border border-[#3a4054] rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter VAT number"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition-colors"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
          
          <button
            type="button"
            className="p-3 bg-black rounded-lg hover:bg-gray-900 focus:outline-none transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanySettings; 