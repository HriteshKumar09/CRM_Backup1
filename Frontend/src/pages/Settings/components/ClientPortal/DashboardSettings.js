import React, { useState } from 'react';

const DashboardSettings = () => {
  const [dashboardSettings, setDashboardSettings] = useState({
    widgets: [
      {
        id: 'projects',
        name: 'Active Projects',
        enabled: true,
        position: 1
      },
      {
        id: 'tasks',
        name: 'My Tasks',
        enabled: true,
        position: 2
      },
      {
        id: 'invoices',
        name: 'Recent Invoices',
        enabled: true,
        position: 3
      },
      {
        id: 'documents',
        name: 'Recent Documents',
        enabled: true,
        position: 4
      },
      {
        id: 'support',
        name: 'Support Tickets',
        enabled: true,
        position: 5
      },
      {
        id: 'announcements',
        name: 'Announcements',
        enabled: false,
        position: 6
      }
    ],
    layout: 'grid',
    refreshInterval: 5,
    showCharts: true,
    showNotifications: true
  });

  const handleWidgetToggle = (widgetId) => {
    setDashboardSettings(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget =>
        widget.id === widgetId
          ? { ...widget, enabled: !widget.enabled }
          : widget
      )
    }));
  };

  const handleLayoutChange = (layout) => {
    setDashboardSettings(prev => ({
      ...prev,
      layout
    }));
  };

  const handleRefreshIntervalChange = (interval) => {
    setDashboardSettings(prev => ({
      ...prev,
      refreshInterval: parseInt(interval)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Client Portal Dashboard Settings</h2>

        {/* Layout Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Layout Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dashboard Layout
              </label>
              <select
                value={dashboardSettings.layout}
                onChange={(e) => handleLayoutChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
              >
                <option value="grid">Grid Layout</option>
                <option value="list">List Layout</option>
                <option value="compact">Compact Layout</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Auto-refresh Interval (minutes)
              </label>
              <select
                value={dashboardSettings.refreshInterval}
                onChange={(e) => handleRefreshIntervalChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
              >
                <option value="1">1 minute</option>
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={dashboardSettings.showCharts}
                  onChange={(e) => setDashboardSettings(prev => ({
                    ...prev,
                    showCharts: e.target.checked
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Show charts and graphs
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={dashboardSettings.showNotifications}
                  onChange={(e) => setDashboardSettings(prev => ({
                    ...prev,
                    showNotifications: e.target.checked
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Show notifications
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Widget Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Widget Settings</h3>
          <div className="space-y-4">
            {dashboardSettings.widgets.map(widget => (
              <div key={widget.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {widget.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Position: {widget.position}
                  </p>
                </div>
                <button
                  onClick={() => handleWidgetToggle(widget.id)}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${widget.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                      transition duration-200 ease-in-out
                      ${widget.enabled ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            ))}
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

export default DashboardSettings; 