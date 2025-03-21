import React, { useState } from 'react';

const ClientPermissionSettings = () => {
  const [permissions, setPermissions] = useState([
    {
      id: 1,
      name: 'View Projects',
      description: 'Allow clients to view their projects',
      enabled: true,
      category: 'Projects'
    },
    {
      id: 2,
      name: 'View Tasks',
      description: 'Allow clients to view tasks assigned to them',
      enabled: true,
      category: 'Tasks'
    },
    {
      id: 3,
      name: 'Create Support Tickets',
      description: 'Allow clients to create support tickets',
      enabled: true,
      category: 'Support'
    },
    {
      id: 4,
      name: 'View Invoices',
      description: 'Allow clients to view their invoices',
      enabled: true,
      category: 'Billing'
    },
    {
      id: 5,
      name: 'View Documents',
      description: 'Allow clients to view shared documents',
      enabled: false,
      category: 'Documents'
    }
  ]);

  const categories = ['Projects', 'Tasks', 'Support', 'Billing', 'Documents'];

  const handleTogglePermission = (permissionId) => {
    setPermissions(permissions.map(permission =>
      permission.id === permissionId
        ? { ...permission, enabled: !permission.enabled }
        : permission
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Client Permission Settings</h2>

        {/* Permissions by Category */}
        {categories.map(category => (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{category}</h3>
            <div className="space-y-4">
              {permissions
                .filter(permission => permission.category === category)
                .map(permission => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {permission.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {permission.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleTogglePermission(permission.id)}
                      className={`
                        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        ${permission.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                      `}
                    >
                      <span
                        className={`
                          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                          transition duration-200 ease-in-out
                          ${permission.enabled ? 'translate-x-5' : 'translate-x-0'}
                        `}
                      />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}

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

export default ClientPermissionSettings; 