import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../Services/api';

const ContractsSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contract_prefix: 'CNT',
    contract_number_format: 'CNT-{year}-{number}',
    contract_statuses: [
      { name: 'Draft', color: '#6B7280', order: 1 },
      { name: 'Pending', color: '#F59E0B', order: 2 },
      { name: 'Active', color: '#10B981', order: 3 },
      { name: 'Expired', color: '#EF4444', order: 4 },
      { name: 'Terminated', color: '#6B7280', order: 5 }
    ],
    contract_settings: {
      allow_client_access: true,
      allow_client_comments: true,
      allow_client_attachments: true,
      allow_client_signature: true,
      allow_client_download: true,
      require_approval: true,
      require_signature: true,
      require_attachments: true,
      require_terms: true,
      require_conditions: true,
      require_duration: true,
      require_value: true,
      require_payment_terms: true,
      require_delivery_terms: true,
      require_warranty: true,
      require_liability: true,
      require_confidentiality: true,
      require_termination: true,
      require_renewal: true,
      require_notice: true
    },
    contract_notification_settings: {
      contract_created: true,
      contract_updated: true,
      contract_deleted: true,
      contract_signed: true,
      contract_expired: true,
      contract_terminated: true,
      contract_renewed: true,
      contract_approved: true,
      contract_rejected: true,
      contract_commented: true,
      contract_attached: true,
      notify_admin: true,
      notify_manager: true,
      notify_owner: true
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/contracts');
      if (response.data.success) {
        setFormData(response.data.data || {});
      } else {
        toast.error(response.data.message || 'Failed to load contract settings');
      }
    } catch (error) {
      console.error('Error fetching contract settings:', error);
      toast.error('Failed to load settings');
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
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    }
  };

  const handleStatusChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      contract_statuses: prev.contract_statuses.map((status, i) => 
        i === index ? { ...status, [field]: value } : status
      )
    }));
  };

  const handleAddStatus = () => {
    setFormData(prev => ({
      ...prev,
      contract_statuses: [
        ...prev.contract_statuses,
        {
          name: '',
          color: '#6B7280',
          order: prev.contract_statuses.length + 1
        }
      ]
    }));
  };

  const handleRemoveStatus = (index) => {
    setFormData(prev => ({
      ...prev,
      contract_statuses: prev.contract_statuses.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/contracts', formData);
      
      if (response.data.success) {
        toast.success('Contract settings saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving contract settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
          Contract Settings
        </h2>

        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Basic Settings
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contract Prefix
              </label>
              <input
                type="text"
                name="contract_prefix"
                value={formData.contract_prefix}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contract Number Format
              </label>
              <input
                type="text"
                name="contract_number_format"
                value={formData.contract_number_format}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="CNT-{year}-{number}"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Available variables: {'{year}'}, {'{number}'}, {'{month}'}
              </p>
            </div>
          </div>

          {/* Contract Statuses */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Contract Statuses
              </h3>
              <button
                onClick={handleAddStatus}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Add Status
              </button>
            </div>

            <div className="space-y-4">
              {formData.contract_statuses.map((status, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <input
                    type="text"
                    value={status.name}
                    onChange={(e) => handleStatusChange(index, 'name', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Status Name"
                  />
                  <input
                    type="color"
                    value={status.color}
                    onChange={(e) => handleStatusChange(index, 'color', e.target.value)}
                    className="w-20 h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <input
                    type="number"
                    value={status.order}
                    onChange={(e) => handleStatusChange(index, 'order', parseInt(e.target.value))}
                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Order"
                  />
                  <button
                    onClick={() => handleRemoveStatus(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Contract Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Contract Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.contract_settings).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`contract_settings.${key}`}
                    name={`contract_settings.${key}`}
                    checked={value}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`contract_settings.${key}`}
                    className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Notification Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.contract_notification_settings).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`contract_notification_settings.${key}`}
                    name={`contract_notification_settings.${key}`}
                    checked={value}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`contract_notification_settings.${key}`}
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

export default ContractsSettings; 