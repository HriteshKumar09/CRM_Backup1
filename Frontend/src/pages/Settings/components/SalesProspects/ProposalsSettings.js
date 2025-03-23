import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../Services/api';

const ProposalsSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    proposal_prefix: 'PROP',
    proposal_number_format: 'PROP-{year}-{number}',
    proposal_valid_days: '30',
    proposal_terms: '',
    proposal_footer: '',
    proposal_logo: '',
    proposal_signature: '',
    proposal_email_template: '',
    proposal_notification_settings: {
      new_proposal: true,
      proposal_accepted: true,
      proposal_rejected: true,
      proposal_expired: true
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/proposals');
      if (response.data.success) {
        setFormData(response.data.data || {});
      } else {
        toast.error(response.data.message || 'Failed to load proposal settings');
      }
    } catch (error) {
      console.error('Error fetching proposal settings:', error);
      toast.error('Failed to load proposal settings');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: checked
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/proposals', formData);
      
      if (response.data.success) {
        toast.success('Proposal settings saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving proposal settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
          Proposal Settings
        </h2>

        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Basic Settings
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Proposal Prefix
              </label>
              <input
                type="text"
                name="proposal_prefix"
                value={formData.proposal_prefix}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Proposal Number Format
              </label>
              <input
                type="text"
                name="proposal_number_format"
                value={formData.proposal_number_format}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="PROP-{year}-{number}"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Available variables: {'{year}'}, {'{number}'}, {'{month}'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Proposal Valid Days
              </label>
              <input
                type="number"
                name="proposal_valid_days"
                value={formData.proposal_valid_days}
                onChange={handleInputChange}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Terms and Conditions
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Default Terms
              </label>
              <textarea
                name="proposal_terms"
                value={formData.proposal_terms}
                onChange={handleInputChange}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Footer Text
              </label>
              <textarea
                name="proposal_footer"
                value={formData.proposal_footer}
                onChange={handleInputChange}
                rows="2"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Email Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Email Settings
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Template
              </label>
              <select
                name="proposal_email_template"
                value={formData.proposal_email_template}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Select Template</option>
                <option value="default">Default Template</option>
                <option value="modern">Modern Template</option>
                <option value="classic">Classic Template</option>
              </select>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Notification Settings
            </h3>

            <div className="space-y-3">
              {Object.entries(formData.proposal_notification_settings).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`proposal_notification_settings.${key}`}
                    name={`proposal_notification_settings.${key}`}
                    checked={value}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`proposal_notification_settings.${key}`}
                    className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
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
    </div>
  );
};

export default ProposalsSettings; 