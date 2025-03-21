import React, { useState } from 'react';

const ModulesSettings = () => {
  const [modules, setModules] = useState([
    { id: 'projects', name: 'Projects', enabled: true },
    { id: 'tasks', name: 'Tasks', enabled: true },
    { id: 'team', name: 'Team Management', enabled: true },
    { id: 'clients', name: 'Client Portal', enabled: true },
    { id: 'invoices', name: 'Invoices', enabled: true },
    { id: 'expenses', name: 'Expenses', enabled: false },
    { id: 'reports', name: 'Reports', enabled: true },
    { id: 'calendar', name: 'Calendar', enabled: true },
    { id: 'messages', name: 'Messages', enabled: true },
    { id: 'documents', name: 'Documents', enabled: false }
  ]);

  const handleModuleToggle = (moduleId) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, enabled: !module.enabled }
        : module
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Modules Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map(module => (
            <div 
              key={module.id}
              className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {module.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {module.enabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleModuleToggle(module.id)}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${module.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                      transition duration-200 ease-in-out
                      ${module.enabled ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
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

export default ModulesSettings; 