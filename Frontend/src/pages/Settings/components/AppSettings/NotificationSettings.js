import React, { useState } from 'react';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: {
      taskAssigned: true,
      taskCompleted: true,
      projectUpdates: true,
      teamMessages: true,
      clientMessages: true,
      systemUpdates: false
    },
    pushNotifications: {
      taskAssigned: true,
      taskCompleted: true,
      projectUpdates: false,
      teamMessages: true,
      clientMessages: true,
      systemUpdates: true
    },
    notificationPreferences: {
      sound: true,
      desktop: true,
      emailDigest: 'daily',
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '06:00'
      }
    }
  });

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handlePreferenceChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [name]: value
      }
    }));
  };

  const handleQuietHoursToggle = () => {
    setSettings(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        quietHours: {
          ...prev.notificationPreferences.quietHours,
          enabled: !prev.notificationPreferences.quietHours.enabled
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Notification Settings</h2>

        {/* Email Notifications */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Email Notifications</h3>
          <div className="space-y-4">
            {Object.entries(settings.emailNotifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <button
                  onClick={() => handleToggle('emailNotifications', key)}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                      transition duration-200 ease-in-out
                      ${value ? 'translate-x-5' : 'translate-x-0'}
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
            {Object.entries(settings.pushNotifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <button
                  onClick={() => handleToggle('pushNotifications', key)}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                      transition duration-200 ease-in-out
                      ${value ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Preferences */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preferences</h3>
          <div className="space-y-4">
            {/* Sound and Desktop Notifications */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Sound Notifications</span>
              <button
                onClick={() => handlePreferenceChange('sound', !settings.notificationPreferences.sound)}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${settings.notificationPreferences.sound ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${settings.notificationPreferences.sound ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>

            {/* Email Digest */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Email Digest</span>
              <select
                value={settings.notificationPreferences.emailDigest}
                onChange={(e) => handlePreferenceChange('emailDigest', e.target.value)}
                className="mt-1 block w-40 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="never">Never</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Quiet Hours */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Quiet Hours</span>
                <button
                  onClick={handleQuietHoursToggle}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${settings.notificationPreferences.quietHours.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                      transition duration-200 ease-in-out
                      ${settings.notificationPreferences.quietHours.enabled ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
              {settings.notificationPreferences.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Time</label>
                    <input
                      type="time"
                      value={settings.notificationPreferences.quietHours.start}
                      onChange={(e) => handlePreferenceChange('quietHours', { ...settings.notificationPreferences.quietHours, start: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Time</label>
                    <input
                      type="time"
                      value={settings.notificationPreferences.quietHours.end}
                      onChange={(e) => handlePreferenceChange('quietHours', { ...settings.notificationPreferences.quietHours, end: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>
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

export default NotificationSettings; 