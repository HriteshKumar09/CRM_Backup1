import React, { useState } from 'react';

const EmailSettings = () => {
  const [formData, setFormData] = useState({
    smtpServer: '',
    smtpPort: '',
    smtpUsername: '',
    smtpPassword: '',
    senderEmail: '',
    senderName: '',
    encryption: 'tls',
    authentication: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Email Settings</h2>
        
        <div className="grid grid-cols-1 gap-6">
          {/* SMTP Server */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SMTP Server
            </label>
            <input
              type="text"
              name="smtpServer"
              value={formData.smtpServer}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* SMTP Port */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SMTP Port
            </label>
            <input
              type="number"
              name="smtpPort"
              value={formData.smtpPort}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Authentication */}
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="authentication"
                checked={formData.authentication}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Require Authentication
              </span>
            </label>
          </div>

          {formData.authentication && (
            <>
              {/* SMTP Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SMTP Username
                </label>
                <input
                  type="text"
                  name="smtpUsername"
                  value={formData.smtpUsername}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* SMTP Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SMTP Password
                </label>
                <input
                  type="password"
                  name="smtpPassword"
                  value={formData.smtpPassword}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </>
          )}

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
    </div>
  );
};

export default EmailSettings; 