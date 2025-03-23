import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../Services/api';

const TimesheetsSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    time_tracking: {
      enabled: true,
      allow_manual_entry: true,
      require_project: true,
      require_task: true,
      require_description: true,
      allow_future_dates: false,
      allow_negative_hours: false,
      minimum_time: 15, // minutes
      maximum_time: 24, // hours
      rounding_method: 'nearest_15', // nearest_15, nearest_30, exact
      default_view: 'week', // day, week, month
      show_break_time: true,
      break_time_minutes: 30
    },
    approval_workflow: {
      require_approval: true,
      auto_approve: false,
      approver_role: 'manager',
      allow_self_approval: false,
      require_comment: true,
      allow_edit_after_approval: false,
      approval_deadline: 7, // days
      reminder_frequency: 'daily' // daily, weekly, monthly
    },
    notifications: {
      timesheet_submitted: true,
      timesheet_approved: true,
      timesheet_rejected: true,
      timesheet_reminder: true,
      approval_reminder: true,
      deadline_reminder: true,
      notify_admin: true,
      notify_manager: true
    },
    reporting: {
      default_report_period: 'month', // week, month, quarter, year
      show_project_summary: true,
      show_task_summary: true,
      show_billable_hours: true,
      show_non_billable_hours: true,
      show_overtime: true,
      show_break_time: true,
      export_format: 'pdf' // pdf, excel, csv
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/timesheets');
      if (response.data.success) {
        setFormData(response.data.data || {});
      } else {
        toast.error(response.data.message || 'Failed to load timesheet settings');
      }
    } catch (error) {
      console.error('Error fetching timesheet settings:', error);
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

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/timesheets', formData);
      
      if (response.data.success) {
        toast.success('Timesheet settings saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving timesheet settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
          Timesheet Settings
        </h2>

        <div className="space-y-6">
          {/* Time Tracking Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Time Tracking Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.time_tracking).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type={typeof value === 'boolean' ? 'checkbox' : 'text'}
                    id={`time_tracking.${key}`}
                    name={`time_tracking.${key}`}
                    checked={typeof value === 'boolean' ? value : undefined}
                    value={typeof value === 'boolean' ? undefined : value}
                    onChange={handleInputChange}
                    className={typeof value === 'boolean' ? 
                      "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" :
                      "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    }
                  />
                  <label
                    htmlFor={`time_tracking.${key}`}
                    className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Approval Workflow Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Approval Workflow Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.approval_workflow).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type={typeof value === 'boolean' ? 'checkbox' : 'text'}
                    id={`approval_workflow.${key}`}
                    name={`approval_workflow.${key}`}
                    checked={typeof value === 'boolean' ? value : undefined}
                    value={typeof value === 'boolean' ? undefined : value}
                    onChange={handleInputChange}
                    className={typeof value === 'boolean' ? 
                      "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" :
                      "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    }
                  />
                  <label
                    htmlFor={`approval_workflow.${key}`}
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
              {Object.entries(formData.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`notifications.${key}`}
                    name={`notifications.${key}`}
                    checked={value}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`notifications.${key}`}
                    className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Reporting Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Reporting Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.reporting).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type={typeof value === 'boolean' ? 'checkbox' : 'text'}
                    id={`reporting.${key}`}
                    name={`reporting.${key}`}
                    checked={typeof value === 'boolean' ? value : undefined}
                    value={typeof value === 'boolean' ? undefined : value}
                    onChange={handleInputChange}
                    className={typeof value === 'boolean' ? 
                      "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" :
                      "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    }
                  />
                  <label
                    htmlFor={`reporting.${key}`}
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

export default TimesheetsSettings; 