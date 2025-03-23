import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../Services/api';

const ClientGroupsSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client_groups: [
      {
        name: 'Default Group',
        description: 'Default client group',
        color: '#4F46E5',
        permissions: {
          view_projects: true,
          view_tasks: true,
          create_support_tickets: true,
          view_invoices: true,
          view_documents: true,
          send_messages: true,
          upload_files: true,
          comment_on_tasks: true,
          view_team: true,
          view_budget: true,
          view_timeline: true
        },
        notification_settings: {
          project_created: true,
          project_updated: true,
          task_assigned: true,
          task_completed: true,
          document_shared: true,
          message_received: true,
          invoice_created: true,
          invoice_paid: true
        },
        email_settings: {
          project_updates: true,
          task_updates: true,
          document_updates: true,
          message_notifications: true,
          invoice_notifications: true,
          support_ticket_updates: true
        }
      }
    ]
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/client-groups');
      if (response.data.success) {
        setFormData(response.data.data || {});
      } else {
        toast.error(response.data.message || 'Failed to load client group settings');
      }
    } catch (error) {
      console.error('Error fetching client group settings:', error);
      toast.error('Failed to load client group settings');
    }
  };

  const handleInputChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      client_groups: prev.client_groups.map((group, i) => 
        i === index ? { ...group, [field]: value } : group
      )
    }));
  };

  const handlePermissionChange = (index, permission, checked) => {
    setFormData(prev => ({
      ...prev,
      client_groups: prev.client_groups.map((group, i) => 
        i === index ? {
          ...group,
          permissions: {
            ...group.permissions,
            [permission]: checked
          }
        } : group
      )
    }));
  };

  const handleNotificationChange = (index, notification, checked) => {
    setFormData(prev => ({
      ...prev,
      client_groups: prev.client_groups.map((group, i) => 
        i === index ? {
          ...group,
          notification_settings: {
            ...group.notification_settings,
            [notification]: checked
          }
        } : group
      )
    }));
  };

  const handleEmailChange = (index, setting, checked) => {
    setFormData(prev => ({
      ...prev,
      client_groups: prev.client_groups.map((group, i) => 
        i === index ? {
          ...group,
          email_settings: {
            ...group.email_settings,
            [setting]: checked
          }
        } : group
      )
    }));
  };

  const handleAddGroup = () => {
    setFormData(prev => ({
      ...prev,
      client_groups: [
        ...prev.client_groups,
        {
          name: '',
          description: '',
          color: '#4F46E5',
          permissions: {
            view_projects: true,
            view_tasks: true,
            create_support_tickets: true,
            view_invoices: true,
            view_documents: true,
            send_messages: true,
            upload_files: true,
            comment_on_tasks: true,
            view_team: true,
            view_budget: true,
            view_timeline: true
          },
          notification_settings: {
            project_created: true,
            project_updated: true,
            task_assigned: true,
            task_completed: true,
            document_shared: true,
            message_received: true,
            invoice_created: true,
            invoice_paid: true
          },
          email_settings: {
            project_updates: true,
            task_updates: true,
            document_updates: true,
            message_notifications: true,
            invoice_notifications: true,
            support_ticket_updates: true
          }
        }
      ]
    }));
  };

  const handleRemoveGroup = (index) => {
    setFormData(prev => ({
      ...prev,
      client_groups: prev.client_groups.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/client-groups', formData);
      
      if (response.data.success) {
        toast.success('Client group settings saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving client group settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Client Group Settings
          </h2>
          <button
            onClick={handleAddGroup}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Add Client Group
          </button>
        </div>

        <div className="space-y-6">
          {formData.client_groups.map((group, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Client Group {index + 1}
                </h3>
                <button
                  onClick={() => handleRemoveGroup(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={group.name}
                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={group.description}
                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                    rows="2"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Color
                  </label>
                  <input
                    type="color"
                    value={group.color}
                    onChange={(e) => handleInputChange(index, 'color', e.target.value)}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white">
                  Permissions
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(group.permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`permission-${index}-${key}`}
                        checked={value}
                        onChange={(e) => handlePermissionChange(index, key, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`permission-${index}-${key}`}
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
                <h4 className="text-md font-medium text-gray-900 dark:text-white">
                  Notification Settings
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(group.notification_settings).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`notification-${index}-${key}`}
                        checked={value}
                        onChange={(e) => handleNotificationChange(index, key, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`notification-${index}-${key}`}
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
                <h4 className="text-md font-medium text-gray-900 dark:text-white">
                  Email Settings
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(group.email_settings).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`email-${index}-${key}`}
                        checked={value}
                        onChange={(e) => handleEmailChange(index, key, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`email-${index}-${key}`}
                        className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
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

export default ClientGroupsSettings; 