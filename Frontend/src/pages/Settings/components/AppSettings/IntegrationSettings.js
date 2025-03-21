import React, { useState } from 'react';

const IntegrationSettings = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 'google',
      name: 'Google Workspace',
      description: 'Connect your Google Calendar and Drive',
      connected: true,
      icon: '🔄'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get notifications and updates in Slack',
      connected: false,
      icon: '💬'
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Sync with GitHub repositories',
      connected: true,
      icon: '📦'
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Access and share files from Dropbox',
      connected: false,
      icon: '📁'
    },
    {
      id: 'zoom',
      name: 'Zoom',
      description: 'Schedule and join meetings directly',
      connected: true,
      icon: '🎥'
    }
  ]);

  const handleToggleConnection = (integrationId) => {
    setIntegrations(integrations.map(integration =>
      integration.id === integrationId
        ? { ...integration, connected: !integration.connected }
        : integration
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Integration Settings</h2>
        
        <div className="space-y-6">
          {integrations.map(integration => (
            <div
              key={integration.id}
              className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{integration.icon}</div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {integration.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-sm ${integration.connected ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  {integration.connected ? 'Connected' : 'Not Connected'}
                </span>
                <button
                  onClick={() => handleToggleConnection(integration.id)}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium
                    ${integration.connected
                      ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400'
                    }
                  `}
                >
                  {integration.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
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

export default IntegrationSettings; 