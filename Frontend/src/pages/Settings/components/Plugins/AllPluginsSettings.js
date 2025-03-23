import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../Services/api';
import { FiToggleLeft, FiToggleRight, FiSettings } from 'react-icons/fi';

const AllPluginsSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    plugins: [
      {
        id: 'recaptcha',
        name: 'Google reCAPTCHA',
        description: 'Protect your forms from spam and abuse',
        enabled: false,
        configured: false,
        version: '3.0',
        author: 'Google',
        requires_setup: true
      },
      {
        id: 'google_drive',
        name: 'Google Drive Integration',
        description: 'Connect and manage files directly from Google Drive',
        enabled: false,
        configured: false,
        version: '2.1',
        author: 'Google',
        requires_setup: true
      },
      {
        id: 'stripe',
        name: 'Stripe Payment Gateway',
        description: 'Accept payments online securely',
        enabled: false,
        configured: false,
        version: '1.5',
        author: 'Stripe',
        requires_setup: true
      },
      {
        id: 'mailchimp',
        name: 'Mailchimp Integration',
        description: 'Sync contacts with your Mailchimp lists',
        enabled: false,
        configured: false,
        version: '2.0',
        author: 'Mailchimp',
        requires_setup: true
      }
    ]
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/plugins');
      if (response.data.success) {
        setFormData(response.data.data || {});
      } else {
        toast.error(response.data.message || 'Failed to load plugins');
      }
    } catch (error) {
      console.error('Error fetching plugins:', error);
      toast.error('Failed to load plugins');
    }
  };

  const handleTogglePlugin = async (pluginId) => {
    try {
      setLoading(true);
      const plugin = formData.plugins.find(p => p.id === pluginId);
      const newState = !plugin.enabled;

      const response = await api.post(`/settings/plugins/${pluginId}/toggle`, {
        enabled: newState
      });
      
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          plugins: prev.plugins.map(p =>
            p.id === pluginId ? { ...p, enabled: newState } : p
          )
        }));
        toast.success(`Plugin ${newState ? 'enabled' : 'disabled'} successfully`);
      } else {
        toast.error(response.data.message || 'Failed to toggle plugin');
      }
    } catch (error) {
      console.error('Error toggling plugin:', error);
      toast.error('Failed to toggle plugin');
    } finally {
      setLoading(false);
    }
  };

  const navigateToSettings = (pluginId) => {
    // Navigate to the plugin's settings page
    window.location.href = `/dashboard/settings/${pluginId}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">All Plugins</h2>
        
        {/* Plugins List */}
        <div className="space-y-4">
          {formData.plugins.map(plugin => (
            <div
              key={plugin.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {plugin.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {plugin.description}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Version: {plugin.version}</span>
                    <span>Author: {plugin.author}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {plugin.requires_setup && plugin.enabled && (
                    <button
                      onClick={() => navigateToSettings(plugin.id)}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <FiSettings className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleTogglePlugin(plugin.id)}
                    disabled={loading}
                    className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {plugin.enabled ? (
                      <FiToggleRight className="w-8 h-8 text-blue-600" />
                    ) : (
                      <FiToggleLeft className="w-8 h-8" />
                    )}
                  </button>
                </div>
              </div>
              {plugin.enabled && !plugin.configured && plugin.requires_setup && (
                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 text-sm rounded">
                  This plugin requires additional setup. Click the settings icon to configure.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllPluginsSettings; 