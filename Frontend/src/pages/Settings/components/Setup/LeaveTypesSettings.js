import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../Services/api';

const LeaveTypesSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    leave_types: [
      {
        name: 'Annual Leave',
        description: 'Paid annual leave',
        color: '#3B82F6',
        icon: 'calendar',
        paid: true,
        accrual_rate: 20, // days per year
        max_days: 30,
        min_days_notice: 14,
        requires_approval: true,
        requires_reason: true,
        requires_attachment: false,
        enabled: true
      },
      {
        name: 'Sick Leave',
        description: 'Paid sick leave',
        color: '#EF4444',
        icon: 'heart',
        paid: true,
        accrual_rate: 10, // days per year
        max_days: 15,
        min_days_notice: 1,
        requires_approval: true,
        requires_reason: true,
        requires_attachment: true,
        enabled: true
      }
    ],
    settings: {
      allow_custom_types: true,
      require_approval: true,
      require_reason: true,
      require_attachment: false,
      allow_negative_balance: false,
      allow_forward_leave: true,
      allow_leave_transfer: true,
      allow_leave_cashout: false,
      max_leave_balance: 40, // days
      min_days_notice: 14,
      max_consecutive_days: 30,
      allow_half_day: true,
      allow_quarter_day: false,
      default_approver_role: 'manager',
      notify_hr: true,
      notify_manager: true,
      notify_employee: true
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/leave-types');
      if (response.data.success) {
        setFormData(response.data.data || {});
      } else {
        toast.error(response.data.message || 'Failed to load leave type settings');
      }
    } catch (error) {
      console.error('Error fetching leave type settings:', error);
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

  const handleLeaveTypeChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      leave_types: prev.leave_types.map((type, i) => 
        i === index ? { ...type, [field]: value } : type
      )
    }));
  };

  const handleAddLeaveType = () => {
    setFormData(prev => ({
      ...prev,
      leave_types: [
        ...prev.leave_types,
        {
          name: '',
          description: '',
          color: '#6B7280',
          icon: 'calendar',
          paid: true,
          accrual_rate: 20,
          max_days: 30,
          min_days_notice: 14,
          requires_approval: true,
          requires_reason: true,
          requires_attachment: false,
          enabled: true
        }
      ]
    }));
  };

  const handleRemoveLeaveType = (index) => {
    setFormData(prev => ({
      ...prev,
      leave_types: prev.leave_types.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/leave-types', formData);
      
      if (response.data.success) {
        toast.success('Leave type settings saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving leave type settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
          Leave Type Settings
        </h2>

        <div className="space-y-6">
          {/* Leave Types */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Leave Types
              </h3>
              <button
                onClick={handleAddLeaveType}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Add Leave Type
              </button>
            </div>

            <div className="space-y-4">
              {formData.leave_types.map((type, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <input
                    type="text"
                    value={type.name}
                    onChange={(e) => handleLeaveTypeChange(index, 'name', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Leave Type Name"
                  />
                  <input
                    type="text"
                    value={type.description}
                    onChange={(e) => handleLeaveTypeChange(index, 'description', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Description"
                  />
                  <input
                    type="color"
                    value={type.color}
                    onChange={(e) => handleLeaveTypeChange(index, 'color', e.target.value)}
                    className="h-10 w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <input
                    type="number"
                    value={type.accrual_rate}
                    onChange={(e) => handleLeaveTypeChange(index, 'accrual_rate', parseInt(e.target.value))}
                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Accrual Rate"
                  />
                  <input
                    type="number"
                    value={type.max_days}
                    onChange={(e) => handleLeaveTypeChange(index, 'max_days', parseInt(e.target.value))}
                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Max Days"
                  />
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={type.paid}
                        onChange={(e) => handleLeaveTypeChange(index, 'paid', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Paid</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={type.requires_approval}
                        onChange={(e) => handleLeaveTypeChange(index, 'requires_approval', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Approval</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={type.requires_reason}
                        onChange={(e) => handleLeaveTypeChange(index, 'requires_reason', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Reason</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={type.enabled}
                        onChange={(e) => handleLeaveTypeChange(index, 'enabled', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enabled</label>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveLeaveType(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.settings).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type={typeof value === 'boolean' ? 'checkbox' : 'text'}
                    id={`settings.${key}`}
                    name={`settings.${key}`}
                    checked={typeof value === 'boolean' ? value : undefined}
                    value={typeof value === 'boolean' ? undefined : value}
                    onChange={handleInputChange}
                    className={typeof value === 'boolean' ? 
                      "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" :
                      "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    }
                  />
                  <label
                    htmlFor={`settings.${key}`}
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

export default LeaveTypesSettings; 