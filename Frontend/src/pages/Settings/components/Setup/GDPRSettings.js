import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../Services/api';

const GDPRSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    enable_gdpr: 'Yes',
    cookie_consent_enabled: 'Yes',
    cookie_consent_message: 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.',
    privacy_policy_url: '',
    data_retention_period: '12',
    data_retention_unit: 'months',
    enable_data_export: 'Yes',
    enable_data_deletion: 'Yes',
    data_processing_agreement: '',
    data_breach_notification: 'Yes',
    breach_notification_email: '',
    data_protection_officer: {
      name: '',
      email: '',
      phone: ''
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/gdpr');
      if (response.data.success) {
        setFormData(response.data.data || {});
      } else {
        toast.error(response.data.message || 'Failed to load GDPR settings');
      }
    } catch (error) {
      console.error('Error fetching GDPR settings:', error);
      toast.error('Failed to load GDPR settings');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDPOChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      data_protection_officer: {
        ...prev.data_protection_officer,
        [name]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/gdpr', formData);
      
      if (response.data.success) {
        toast.success('GDPR settings saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save GDPR settings');
      }
    } catch (error) {
      console.error('Error saving GDPR settings:', error);
      toast.error('Failed to save GDPR settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">GDPR Settings</h2>
        
        {/* General GDPR Settings */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enable GDPR Features
            </label>
            <select
              name="enable_gdpr"
              value={formData.enable_gdpr}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enable Cookie Consent
            </label>
            <select
              name="cookie_consent_enabled"
              value={formData.cookie_consent_enabled}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        {/* Cookie Consent Message */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cookie Consent Message
          </label>
          <textarea
            name="cookie_consent_message"
            value={formData.cookie_consent_message}
            onChange={handleInputChange}
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Privacy Policy URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Privacy Policy URL
          </label>
          <input
            type="url"
            name="privacy_policy_url"
            value={formData.privacy_policy_url}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Data Retention */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Retention Period
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="data_retention_period"
                value={formData.data_retention_period}
                onChange={handleInputChange}
                className="mt-1 block w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <select
                name="data_retention_unit"
                value={formData.data_retention_unit}
                onChange={handleInputChange}
                className="mt-1 block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enable Data Export
            </label>
            <select
              name="enable_data_export"
              value={formData.enable_data_export}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        {/* Data Protection Officer */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Data Protection Officer</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.data_protection_officer.name}
                onChange={handleDPOChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.data_protection_officer.email}
                onChange={handleDPOChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.data_protection_officer.phone}
                onChange={handleDPOChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GDPRSettings; 