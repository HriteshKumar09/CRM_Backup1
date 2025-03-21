import React, { useState } from 'react';

const UpdateSettings = () => {
  const [settings, setSettings] = useState({
    autoUpdate: true,
    checkFrequency: 'daily',
    notifyOnUpdate: true,
    betaUpdates: false,
    currentVersion: '1.2.3',
    lastCheck: '2024-03-10 12:00:00',
    updateChannel: 'stable'
  });

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Update Settings</h2>

        <div className="space-y-6">
          {/* Current Version Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Version
                </label>
                <div className="mt-1 text-sm text-gray-900 dark:text-white">
                  v{settings.currentVersion}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Check
                </label>
                <div className="mt-1 text-sm text-gray-900 dark:text-white">
                  {settings.lastCheck}
                </div>
              </div>
            </div>
          </div>

          {/* Auto Update Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Automatic Updates
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Allow the system to automatically install updates
              </p>
            </div>
            <button
              onClick={() => handleSettingChange('autoUpdate', !settings.autoUpdate)}
              className={`
                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${settings.autoUpdate ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
              `}
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                  transition duration-200 ease-in-out
                  ${settings.autoUpdate ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {/* Check Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Check Frequency
            </label>
            <select
              value={settings.checkFrequency}
              onChange={(e) => handleSettingChange('checkFrequency', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="hourly">Every Hour</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Update Channel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Update Channel
            </label>
            <select
              value={settings.updateChannel}
              onChange={(e) => handleSettingChange('updateChannel', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="stable">Stable</option>
              <option value="beta">Beta</option>
              <option value="dev">Development</option>
            </select>
          </div>

          {/* Additional Settings */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifyOnUpdate}
                onChange={(e) => handleSettingChange('notifyOnUpdate', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                Notify when updates are available
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.betaUpdates}
                onChange={(e) => handleSettingChange('betaUpdates', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <label className="ml-2 block text-sm text-gray-900 dark:text-white">
                Include beta updates
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300"
            >
              Check for Updates
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateSettings; 