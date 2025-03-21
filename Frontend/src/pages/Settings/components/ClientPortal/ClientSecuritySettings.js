import React, { useState } from 'react';

const ClientSecuritySettings = () => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: {
      enabled: false,
      method: 'authenticator',
      backupCodes: []
    },
    sessionManagement: {
      maxSessions: 3,
      sessionTimeout: 30,
      requireReauth: false
    },
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 90
    },
    loginAttempts: {
      maxAttempts: 5,
      lockoutDuration: 30,
      requireCaptcha: true
    },
    ipRestrictions: {
      enabled: false,
      allowedIPs: [],
      blockedIPs: []
    }
  });

  const handleTwoFactorToggle = () => {
    setSecuritySettings(prev => ({
      ...prev,
      twoFactorAuth: {
        ...prev.twoFactorAuth,
        enabled: !prev.twoFactorAuth.enabled
      }
    }));
  };

  const handleTwoFactorMethodChange = (method) => {
    setSecuritySettings(prev => ({
      ...prev,
      twoFactorAuth: {
        ...prev.twoFactorAuth,
        method
      }
    }));
  };

  const handleSessionChange = (field, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      sessionManagement: {
        ...prev.sessionManagement,
        [field]: value
      }
    }));
  };

  const handlePasswordPolicyChange = (field, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      passwordPolicy: {
        ...prev.passwordPolicy,
        [field]: value
      }
    }));
  };

  const handleLoginAttemptsChange = (field, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      loginAttempts: {
        ...prev.loginAttempts,
        [field]: value
      }
    }));
  };

  const handleIPRestrictionsToggle = () => {
    setSecuritySettings(prev => ({
      ...prev,
      ipRestrictions: {
        ...prev.ipRestrictions,
        enabled: !prev.ipRestrictions.enabled
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Client Portal Security Settings</h2>

        {/* Two-Factor Authentication */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Two-Factor Authentication</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Enable Two-Factor Authentication
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add an extra layer of security to client accounts
                </p>
              </div>
              <button
                onClick={handleTwoFactorToggle}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${securitySettings.twoFactorAuth.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${securitySettings.twoFactorAuth.enabled ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>

            {securitySettings.twoFactorAuth.enabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Authentication Method
                </label>
                <select
                  value={securitySettings.twoFactorAuth.method}
                  onChange={(e) => handleTwoFactorMethodChange(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                >
                  <option value="authenticator">Authenticator App</option>
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Session Management */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Session Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Concurrent Sessions
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={securitySettings.sessionManagement.maxSessions}
                onChange={(e) => handleSessionChange('maxSessions', parseInt(e.target.value))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={securitySettings.sessionManagement.sessionTimeout}
                onChange={(e) => handleSessionChange('sessionTimeout', parseInt(e.target.value))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.sessionManagement.requireReauth}
                onChange={(e) => handleSessionChange('requireReauth', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Require re-authentication for sensitive actions
              </span>
            </label>
          </div>
        </div>

        {/* Password Policy */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Password Policy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Password Length
              </label>
              <input
                type="number"
                min="8"
                max="32"
                value={securitySettings.passwordPolicy.minLength}
                onChange={(e) => handlePasswordPolicyChange('minLength', parseInt(e.target.value))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password Maximum Age (days)
              </label>
              <input
                type="number"
                min="30"
                max="365"
                value={securitySettings.passwordPolicy.maxAge}
                onChange={(e) => handlePasswordPolicyChange('maxAge', parseInt(e.target.value))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.passwordPolicy.requireUppercase}
                onChange={(e) => handlePasswordPolicyChange('requireUppercase', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Require uppercase letters
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.passwordPolicy.requireLowercase}
                onChange={(e) => handlePasswordPolicyChange('requireLowercase', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Require lowercase letters
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.passwordPolicy.requireNumbers}
                onChange={(e) => handlePasswordPolicyChange('requireNumbers', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Require numbers
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.passwordPolicy.requireSpecialChars}
                onChange={(e) => handlePasswordPolicyChange('requireSpecialChars', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Require special characters
              </span>
            </label>
          </div>
        </div>

        {/* Login Attempts */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Login Attempts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Failed Attempts
              </label>
              <input
                type="number"
                min="3"
                max="10"
                value={securitySettings.loginAttempts.maxAttempts}
                onChange={(e) => handleLoginAttemptsChange('maxAttempts', parseInt(e.target.value))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lockout Duration (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="1440"
                value={securitySettings.loginAttempts.lockoutDuration}
                onChange={(e) => handleLoginAttemptsChange('lockoutDuration', parseInt(e.target.value))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.loginAttempts.requireCaptcha}
                onChange={(e) => handleLoginAttemptsChange('requireCaptcha', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Require CAPTCHA after failed attempts
              </span>
            </label>
          </div>
        </div>

        {/* IP Restrictions */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">IP Restrictions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Enable IP Restrictions
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Restrict access to specific IP addresses
                </p>
              </div>
              <button
                onClick={handleIPRestrictionsToggle}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${securitySettings.ipRestrictions.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${securitySettings.ipRestrictions.enabled ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
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

export default ClientSecuritySettings; 