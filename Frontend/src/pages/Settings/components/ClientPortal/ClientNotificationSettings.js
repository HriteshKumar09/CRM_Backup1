import React, { useState } from 'react';

const ClientNotificationSettings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      projectUpdates: true,
      taskAssignments: true,
      documentShares: true,
      invoiceIssued: true,
      supportTickets: true,
      comments: true
    },
    pushNotifications: {
      projectUpdates: true,
      taskAssignments: true,
      documentShares: false,
      invoiceIssued: true,
      supportTickets: true,
      comments: false
    },
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '07:00',
      timezone: 'UTC'
    }
  });

  const handleEmailToggle = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [setting]: !prev.emailNotifications[setting]
      }
    }));
  };

  const handlePushToggle = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      pushNotifications: {
        ...prev.pushNotifications,
        [setting]: !prev.pushNotifications[setting]
      }
    }));
  };

  const handleQuietHoursToggle = () => {
    setNotificationSettings(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        enabled: !prev.quietHours.enabled
      }
    }));
  };

  const handleQuietHoursChange = (field, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value
      }
    }));
  };

  const notificationTypes = [
    { id: 'projectUpdates', label: 'Project Updates' },
    { id: 'taskAssignments', label: 'Task Assignments' },
    { id: 'documentShares', label: 'Document Shares' },
    { id: 'invoiceIssued', label: 'Invoice Issued' },
    { id: 'supportTickets', label: 'Support Tickets' },
    { id: 'comments', label: 'Comments' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Client Portal Notification Settings</h2>

        {/* Email Notifications */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Email Notifications</h3>
          <div className="space-y-4">
            {notificationTypes.map(type => (
              <div key={type.id} className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {type.label}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive email notifications for {type.label.toLowerCase()}
                  </p>
                </div>
                <button
                  onClick={() => handleEmailToggle(type.id)}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${notificationSettings.emailNotifications[type.id] ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                      transition duration-200 ease-in-out
                      ${notificationSettings.emailNotifications[type.id] ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Push Notifications</h3>
          <div className="space-y-4">
            {notificationTypes.map(type => (
              <div key={type.id} className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {type.label}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive push notifications for {type.label.toLowerCase()}
                  </p>
                </div>
                <button
                  onClick={() => handlePushToggle(type.id)}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${notificationSettings.pushNotifications[type.id] ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                      transition duration-200 ease-in-out
                      ${notificationSettings.pushNotifications[type.id] ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quiet Hours */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quiet Hours</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Enable Quiet Hours
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Mute notifications during specified hours
                </p>
              </div>
              <button
                onClick={handleQuietHoursToggle}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${notificationSettings.quietHours.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${notificationSettings.quietHours.enabled ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>

            {notificationSettings.quietHours.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={notificationSettings.quietHours.startTime}
                    onChange={(e) => handleQuietHoursChange('startTime', e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={notificationSettings.quietHours.endTime}
                    onChange={(e) => handleQuietHoursChange('endTime', e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timezone
                  </label>
                  <select
                    value={notificationSettings.quietHours.timezone}
                    onChange={(e) => handleQuietHoursChange('timezone', e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="CST">Central Time</option>
                    <option value="MST">Mountain Time</option>
                    <option value="PST">Pacific Time</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientNotificationSettings; 