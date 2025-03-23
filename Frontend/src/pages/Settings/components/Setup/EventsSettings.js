import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../Services/api';

const EventsSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    calendar: {
      default_view: 'month', // day, week, month, agenda
      first_day_of_week: 'monday', // sunday, monday
      show_weekends: true,
      show_holidays: true,
      show_birthdays: true,
      show_anniversaries: true,
      default_duration: 60, // minutes
      time_slot_duration: 30, // minutes
      working_hours_start: '09:00',
      working_hours_end: '17:00',
      working_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    event_types: [
      {
        name: 'Meeting',
        color: '#3B82F6',
        icon: 'calendar',
        default_duration: 60,
        allow_recurring: true,
        allow_reminders: true,
        allow_attachments: true,
        enabled: true
      },
      {
        name: 'Appointment',
        color: '#10B981',
        icon: 'clock',
        default_duration: 30,
        allow_recurring: true,
        allow_reminders: true,
        allow_attachments: true,
        enabled: true
      }
    ],
    notifications: {
      event_created: true,
      event_updated: true,
      event_deleted: true,
      event_reminder: true,
      event_invitation: true,
      event_response: true,
      event_cancelled: true,
      notify_organizer: true,
      notify_attendees: true
    },
    reminders: {
      default_reminder: 15, // minutes before
      reminder_options: [5, 15, 30, 60, 1440], // minutes
      reminder_method: 'both', // email, push, both
      allow_custom_reminder: true,
      max_reminders: 3
    },
    permissions: {
      allow_public_events: true,
      allow_private_events: true,
      allow_recurring_events: true,
      allow_all_day_events: true,
      allow_overlapping_events: false,
      allow_guest_access: true,
      require_approval: false,
      allow_editing: true
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/events');
      if (response.data.success) {
        setFormData(response.data.data || {});
      } else {
        toast.error(response.data.message || 'Failed to load event settings');
      }
    } catch (error) {
      console.error('Error fetching event settings:', error);
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

  const handleEventTypeChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      event_types: prev.event_types.map((type, i) => 
        i === index ? { ...type, [field]: value } : type
      )
    }));
  };

  const handleAddEventType = () => {
    setFormData(prev => ({
      ...prev,
      event_types: [
        ...prev.event_types,
        {
          name: '',
          color: '#6B7280',
          icon: 'calendar',
          default_duration: 60,
          allow_recurring: true,
          allow_reminders: true,
          allow_attachments: true,
          enabled: true
        }
      ]
    }));
  };

  const handleRemoveEventType = (index) => {
    setFormData(prev => ({
      ...prev,
      event_types: prev.event_types.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/events', formData);
      
      if (response.data.success) {
        toast.success('Event settings saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving event settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
          Event Settings
        </h2>

        <div className="space-y-6">
          {/* Calendar Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Calendar Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.calendar).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type={typeof value === 'boolean' ? 'checkbox' : 'text'}
                    id={`calendar.${key}`}
                    name={`calendar.${key}`}
                    checked={typeof value === 'boolean' ? value : undefined}
                    value={typeof value === 'boolean' ? undefined : value}
                    onChange={handleInputChange}
                    className={typeof value === 'boolean' ? 
                      "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" :
                      "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    }
                  />
                  <label
                    htmlFor={`calendar.${key}`}
                    className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Event Types */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Event Types
              </h3>
              <button
                onClick={handleAddEventType}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Add Event Type
              </button>
            </div>

            <div className="space-y-4">
              {formData.event_types.map((type, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <input
                    type="text"
                    value={type.name}
                    onChange={(e) => handleEventTypeChange(index, 'name', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Event Type Name"
                  />
                  <input
                    type="color"
                    value={type.color}
                    onChange={(e) => handleEventTypeChange(index, 'color', e.target.value)}
                    className="h-10 w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <input
                    type="number"
                    value={type.default_duration}
                    onChange={(e) => handleEventTypeChange(index, 'default_duration', parseInt(e.target.value))}
                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Duration"
                  />
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={type.allow_recurring}
                        onChange={(e) => handleEventTypeChange(index, 'allow_recurring', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Recurring</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={type.allow_reminders}
                        onChange={(e) => handleEventTypeChange(index, 'allow_reminders', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Reminders</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={type.enabled}
                        onChange={(e) => handleEventTypeChange(index, 'enabled', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enabled</label>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveEventType(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
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

          {/* Reminder Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Reminder Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.reminders).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type={typeof value === 'boolean' ? 'checkbox' : 'text'}
                    id={`reminders.${key}`}
                    name={`reminders.${key}`}
                    checked={typeof value === 'boolean' ? value : undefined}
                    value={typeof value === 'boolean' ? undefined : value}
                    onChange={handleInputChange}
                    className={typeof value === 'boolean' ? 
                      "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" :
                      "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    }
                  />
                  <label
                    htmlFor={`reminders.${key}`}
                    className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Permission Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Permission Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.permissions).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`permissions.${key}`}
                    name={`permissions.${key}`}
                    checked={value}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`permissions.${key}`}
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

export default EventsSettings; 