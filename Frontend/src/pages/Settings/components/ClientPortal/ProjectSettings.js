import React, { useState } from 'react';

const ProjectSettings = () => {
  const [projectSettings, setProjectSettings] = useState({
    display: {
      showProgress: true,
      showTimeline: true,
      showBudget: true,
      showTeam: true,
      showFiles: true,
      showComments: true
    },
    notifications: {
      projectCreated: true,
      projectUpdated: true,
      milestoneReached: true,
      taskAssigned: true,
      commentAdded: true,
      fileUploaded: true
    },
    permissions: {
      canCreateProjects: false,
      canEditProjects: false,
      canDeleteProjects: false,
      canInviteTeam: false,
      canUploadFiles: true,
      canComment: true
    },
    defaultView: 'list',
    itemsPerPage: 10,
    sortBy: 'updated',
    sortOrder: 'desc'
  });

  const handleDisplayToggle = (setting) => {
    setProjectSettings(prev => ({
      ...prev,
      display: {
        ...prev.display,
        [setting]: !prev.display[setting]
      }
    }));
  };

  const handleNotificationToggle = (setting) => {
    setProjectSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: !prev.notifications[setting]
      }
    }));
  };

  const handlePermissionToggle = (setting) => {
    setProjectSettings(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [setting]: !prev.permissions[setting]
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Client Portal Project Settings</h2>

        {/* Display Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Display Settings</h3>
          <div className="space-y-4">
            {Object.entries(projectSettings.display).map(([setting, enabled]) => (
              <div key={setting} className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {setting.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Show {setting.replace(/([A-Z])/g, ' $1').toLowerCase()} in project view
                  </p>
                </div>
                <button
                  onClick={() => handleDisplayToggle(setting)}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                      transition duration-200 ease-in-out
                      ${enabled ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notification Settings</h3>
          <div className="space-y-4">
            {Object.entries(projectSettings.notifications).map(([setting, enabled]) => (
              <div key={setting} className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {setting.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive notifications when {setting.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationToggle(setting)}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                      transition duration-200 ease-in-out
                      ${enabled ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Permission Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Permission Settings</h3>
          <div className="space-y-4">
            {Object.entries(projectSettings.permissions).map(([setting, enabled]) => (
              <div key={setting} className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {setting.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Allow clients to {setting.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </p>
                </div>
                <button
                  onClick={() => handlePermissionToggle(setting)}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                      transition duration-200 ease-in-out
                      ${enabled ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* View Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">View Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default View
              </label>
              <select
                value={projectSettings.defaultView}
                onChange={(e) => setProjectSettings(prev => ({
                  ...prev,
                  defaultView: e.target.value
                }))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
              >
                <option value="list">List View</option>
                <option value="grid">Grid View</option>
                <option value="kanban">Kanban View</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Items Per Page
              </label>
              <select
                value={projectSettings.itemsPerPage}
                onChange={(e) => setProjectSettings(prev => ({
                  ...prev,
                  itemsPerPage: parseInt(e.target.value)
                }))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
              >
                <option value="5">5 items</option>
                <option value="10">10 items</option>
                <option value="20">20 items</option>
                <option value="50">50 items</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={projectSettings.sortBy}
                onChange={(e) => setProjectSettings(prev => ({
                  ...prev,
                  sortBy: e.target.value
                }))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
              >
                <option value="name">Name</option>
                <option value="created">Created Date</option>
                <option value="updated">Updated Date</option>
                <option value="status">Status</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort Order
              </label>
              <select
                value={projectSettings.sortOrder}
                onChange={(e) => setProjectSettings(prev => ({
                  ...prev,
                  sortOrder: e.target.value
                }))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
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

export default ProjectSettings; 