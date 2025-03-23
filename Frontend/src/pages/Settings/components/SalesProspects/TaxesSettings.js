import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../Services/api';

const TaxesSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tax_name: '',
    tax_rate: '',
    tax_type: 'percentage',
    tax_status: 'active',
    tax_description: '',
    tax_registration_number: '',
    tax_authority: '',
    tax_filing_frequency: 'monthly',
    tax_due_days: '30',
    tax_rounding: 'round',
    tax_inclusive: false,
    tax_compound: false,
    tax_recoverable: true,
    tax_visible: true,
    tax_default: false
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/taxes');
      if (response.data.success) {
        setFormData(response.data.data || {});
      } else {
        toast.error(response.data.message || 'Failed to load tax settings');
      }
    } catch (error) {
      console.error('Error fetching tax settings:', error);
      toast.error('Failed to load tax settings');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
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
      const response = await api.post('/settings/taxes', formData);
      
      if (response.data.success) {
        toast.success('Tax settings saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving tax settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
          Tax Settings
        </h2>

        <div className="space-y-6">
          {/* Basic Tax Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tax Name
              </label>
              <input
                type="text"
                name="tax_name"
                value={formData.tax_name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tax Rate
              </label>
              <input
                type="number"
                name="tax_rate"
                value={formData.tax_rate}
                onChange={handleInputChange}
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tax Type
              </label>
              <select
                name="tax_type"
                value={formData.tax_type}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tax Status
              </label>
              <select
                name="tax_status"
                value={formData.tax_status}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Tax Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Tax Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                name="tax_description"
                value={formData.tax_description}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Registration Number
              </label>
              <input
                type="text"
                name="tax_registration_number"
                value={formData.tax_registration_number}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tax Authority
              </label>
              <input
                type="text"
                name="tax_authority"
                value={formData.tax_authority}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Tax Filing Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Filing Settings
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Filing Frequency
              </label>
              <select
                name="tax_filing_frequency"
                value={formData.tax_filing_frequency}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Due Days
              </label>
              <input
                type="number"
                name="tax_due_days"
                value={formData.tax_due_days}
                onChange={handleInputChange}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rounding Method
              </label>
              <select
                name="tax_rounding"
                value={formData.tax_rounding}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="round">Round</option>
                <option value="floor">Floor</option>
                <option value="ceil">Ceil</option>
              </select>
            </div>
          </div>

          {/* Tax Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Tax Options
            </h3>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="tax_inclusive"
                  name="tax_inclusive"
                  checked={formData.tax_inclusive}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="tax_inclusive"
                  className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Tax Inclusive
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="tax_compound"
                  name="tax_compound"
                  checked={formData.tax_compound}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="tax_compound"
                  className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Compound Tax
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="tax_recoverable"
                  name="tax_recoverable"
                  checked={formData.tax_recoverable}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="tax_recoverable"
                  className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Recoverable Tax
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="tax_visible"
                  name="tax_visible"
                  checked={formData.tax_visible}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="tax_visible"
                  className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Visible on Documents
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="tax_default"
                  name="tax_default"
                  checked={formData.tax_default}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="tax_default"
                  className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Default Tax
                </label>
              </div>
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

export default TaxesSettings; 