import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../Services/api';

const ProjectsSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    project_prefix: 'PRJ',
    project_number_format: 'PRJ-{year}-{number}',
    project_statuses: [
      { name: 'Planning', color: '#6B7280', order: 1 },
      { name: 'In Progress', color: '#3B82F6', order: 2 },
      { name: 'On Hold', color: '#F59E0B', order: 3 },
      { name: 'Completed', color: '#10B981', order: 4 },
      { name: 'Cancelled', color: '#EF4444', order: 5 }
    ],
    project_priorities: [
      { name: 'Low', color: '#6B7280', order: 1 },
      { name: 'Medium', color: '#F59E0B', order: 2 },
      { name: 'High', color: '#EF4444', order: 3 }
    ],
    project_settings: {
      allow_client_access: true,
      allow_client_comments: true,
      allow_client_attachments: true,
      allow_client_tasks: true,
      allow_client_timesheets: true,
      allow_client_invoices: true,
      allow_client_documents: true,
      allow_client_team: true,
      allow_client_budget: true,
      allow_client_timeline: true,
      require_approval: false,
      require_timesheet: true,
      require_documents: true,
      require_budget: true,
      require_timeline: true,
      require_team: true,
      require_client: true,
      require_start_date: true,
      require_end_date: true,
      require_description: true,
      require_priority: true,
      require_status: true,
      require_category: true,
      require_tags: true,
      require_custom_fields: true
    },
    project_notification_settings: {
      project_created: true,
      project_updated: true,
      project_deleted: true,
      project_completed: true,
      project_cancelled: true,
      project_on_hold: true,
      project_resumed: true,
      project_overdue: true,
      project_budget_exceeded: true,
      project_timeline_changed: true,
      project_team_changed: true,
      project_client_changed: true,
      project_status_changed: true,
      project_priority_changed: true,
      project_category_changed: true,
      project_tags_changed: true,
      project_custom_fields_changed: true
    },
    project_email_settings: {
      project_updates: true,
      project_completion: true,
      project_cancellation: true,
      project_on_hold: true,
      project_resumption: true,
      project_overdue: true,
      project_budget_exceeded: true,
      project_timeline_changes: true,
      project_team_changes: true,
      project_client_changes: true,
      project_status_changes: true,
      project_priority_changes: true,
      project_category_changes: true,
      project_tags_changes: true,
      project_custom_fields_changes: true
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/projects');
      if (response.data.success) {
        setFormData(response.data.data || {});
      } else {
        toast.error(response.data.message || 'Failed to load project settings');
      }
    } catch (error) {
      console.error('Error fetching project settings:', error);
      toast.error('Failed to load project settings');
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

  const handleStatusChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      project_statuses: prev.project_statuses.map((status, i) => 
        i === index ? { ...status, [field]: value } : status
      )
    }));
  };

  const handlePriorityChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      project_priorities: prev.project_priorities.map((priority, i) => 
        i === index ? { ...priority, [field]: value } : priority
      )
    }));
  };

  const handleAddStatus = () => {
    setFormData(prev => ({
      ...prev,
      project_statuses: [
        ...prev.project_statuses,
        {
          name: '',
          color: '#6B7280',
          order: prev.project_statuses.length + 1
        }
      ]
    }));
  };

  const handleAddPriority = () => {
    setFormData(prev => ({
      ...prev,
      project_priorities: [
        ...prev.project_priorities,
        {
          name: '',
          color: '#6B7280',
          order: prev.project_priorities.length + 1
        }
      ]
    }));
  };

  const handleRemoveStatus = (index) => {
    setFormData(prev => ({
      ...prev,
      project_statuses: prev.project_statuses.filter((_, i) => i !== index)
    }));
  };

  const handleRemovePriority = (index) => {
    setFormData(prev => ({
      ...prev,
      project_priorities: prev.project_priorities.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/projects', formData);
      
      if (response.data.success) {
        toast.success('Project settings saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving project settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
          Project Settings
        </h2>

        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Basic Settings
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Project Prefix
              </label>
              <input
                type="text"
                name="project_prefix"
                value={formData.project_prefix}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Project Number Format
              </label>
              <input
                type="text"
                name="project_number_format"
                value={formData.project_number_format}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="PRJ-{year}-{number}"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Available variables: {'{year}'}, {'{number}'}, {'{month}'}
              </p>
            </div>
          </div>

          {/* Project Statuses */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Project Statuses
              </h3>
              <button
                onClick={handleAddStatus}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Add Status
              </button>
            </div>

            <div className="space-y-4">
              {formData.project_statuses.map((status, index) => (
                <div key={index} className="flex items-center space-x-4">
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
                    className="h-10 w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
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

          {/* Project Priorities */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Project Priorities
              </h3>
              <button
                onClick={handleAddPriority}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Add Priority
              </button>
            </div>

            <div className="space-y-4">
              {formData.project_priorities.map((priority, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={priority.name}
                    onChange={(e) => handlePriorityChange(index, 'name', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Priority Name"
                  />
                  <input
                    type="color"
                    value={priority.color}
                    onChange={(e) => handlePriorityChange(index, 'color', e.target.value)}
                    className="h-10 w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <input
                    type="number"
                    value={priority.order}
                    onChange={(e) => handlePriorityChange(index, 'order', parseInt(e.target.value))}
                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Order"
                  />
                  <button
                    onClick={() => handleRemovePriority(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Project Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Project Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.project_settings).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`project_settings.${key}`}
                    name={`project_settings.${key}`}
                    checked={value}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`project_settings.${key}`}
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
              {Object.entries(formData.project_notification_settings).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`project_notification_settings.${key}`}
                    name={`project_notification_settings.${key}`}
                    checked={value}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`project_notification_settings.${key}`}
                    className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Email Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Email Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.project_email_settings).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`project_email_settings.${key}`}
                    name={`project_email_settings.${key}`}
                    checked={value}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`project_email_settings.${key}`}
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

export default ProjectsSettings;

 