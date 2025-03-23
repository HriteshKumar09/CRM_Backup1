import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../Services/api';

const TaskSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    default_task_status: 'todo',
    default_task_priority: 'medium',
    enable_task_dependencies: 'Yes',
    enable_task_time_tracking: 'Yes',
    enable_task_comments: 'Yes',
    enable_task_attachments: 'Yes',
    enable_task_checklist: 'Yes',
    enable_task_reminders: 'Yes',
    task_reminder_before: '1',
    task_reminder_unit: 'days',
    task_statuses: [
      { id: 'todo', name: 'To Do', color: '#E5E7EB', order: 1 },
      { id: 'in_progress', name: 'In Progress', color: '#FCD34D', order: 2 },
      { id: 'review', name: 'Review', color: '#60A5FA', order: 3 },
      { id: 'done', name: 'Done', color: '#34D399', order: 4 }
    ],
    task_priorities: [
      { id: 'low', name: 'Low', color: '#9CA3AF' },
      { id: 'medium', name: 'Medium', color: '#F59E0B' },
      { id: 'high', name: 'High', color: '#EF4444' }
    ]
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/tasks');
      if (response.data.success) {
        setFormData(response.data.data || {});
      } else {
        toast.error(response.data.message || 'Failed to load task settings');
      }
    } catch (error) {
      console.error('Error fetching task settings:', error);
      toast.error('Failed to load task settings');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (statusId, changes) => {
    setFormData(prev => ({
      ...prev,
      task_statuses: prev.task_statuses.map(status =>
        status.id === statusId ? { ...status, ...changes } : status
      )
    }));
  };

  const handlePriorityChange = (priorityId, changes) => {
    setFormData(prev => ({
      ...prev,
      task_priorities: prev.task_priorities.map(priority =>
        priority.id === priorityId ? { ...priority, ...changes } : priority
      )
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/tasks', formData);
      
      if (response.data.success) {
        toast.success('Task settings saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save task settings');
      }
    } catch (error) {
      console.error('Error saving task settings:', error);
      toast.error('Failed to save task settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Task Settings</h2>
        
        {/* Default Settings */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Status
            </label>
            <select
              name="default_task_status"
              value={formData.default_task_status}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {formData.task_statuses.map(status => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Priority
            </label>
            <select
              name="default_task_priority"
              value={formData.default_task_priority}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {formData.task_priorities.map(priority => (
                <option key={priority.id} value={priority.id}>{priority.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enable Dependencies
            </label>
            <select
              name="enable_task_dependencies"
              value={formData.enable_task_dependencies}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enable Time Tracking
            </label>
            <select
              name="enable_task_time_tracking"
              value={formData.enable_task_time_tracking}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        {/* Reminder Settings */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enable Reminders
            </label>
            <select
              name="enable_task_reminders"
              value={formData.enable_task_reminders}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reminder Before
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="task_reminder_before"
                value={formData.task_reminder_before}
                onChange={handleInputChange}
                className="mt-1 block w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <select
                name="task_reminder_unit"
                value={formData.task_reminder_unit}
                onChange={handleInputChange}
                className="mt-1 block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
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

export default TaskSettings; 