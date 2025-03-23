import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../Services/api';
import { FiCheck, FiX } from 'react-icons/fi';

const GoogleDriveSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    enabled: false,
    client_id: '',
    client_secret: '',
    redirect_uri: '',
    access_token: '',
    refresh_token: '',
    connected: false,
    auto_sync: true,
    sync_interval: '30',
    default_folder: '',
    file_types: {
      documents: true,
      images: true,
      spreadsheets: true,
      presentations: true
    },
    max_file_size: '10'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/plugins/google-drive');
      if (response.data.success) {
        setFormData(response.data.data || {});
      } else {
        toast.error(response.data.message || 'Failed to load Google Drive settings');
      }
    } catch (error) {
      console.error('Error fetching Google Drive settings:', error);
      toast.error('Failed to load Google Drive settings');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: checked
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/plugins/google-drive/connect', {
        client_id: formData.client_id,
        client_secret: formData.client_secret,
        redirect_uri: formData.redirect_uri
      });
      
      if (response.data.success) {
        window.location.href = response.data.auth_url;
      } else {
        toast.error(response.data.message || 'Failed to connect to Google Drive');
      }
    } catch (error) {
      console.error('Error connecting to Google Drive:', error);
      toast.error('Failed to connect to Google Drive');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/plugins/google-drive/disconnect');
      
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          connected: false,
          access_token: '',
          refresh_token: ''
        }));
        toast.success('Disconnected from Google Drive successfully');
      } else {
        toast.error(response.data.message || 'Failed to disconnect from Google Drive');
      }
    } catch (error) {
      console.error('Error disconnecting from Google Drive:', error);
      toast.error('Failed to disconnect from Google Drive');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/plugins/google-drive', formData);
      
      if (response.data.success) {
        toast.success('Google Drive settings saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving Google Drive settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
          Google Drive Integration Settings
        </h2>

        <div className="space-y-6">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className={`flex h-3 w-3 rounded-full ${formData.connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {formData.connected ? 'Connected to Google Drive' : 'Not Connected'}
              </span>
            </div>
            <button
              onClick={formData.connected ? handleDisconnect : handleConnect}
              disabled={loading}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                formData.connected
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
            >
              {loading ? 'Processing...' : formData.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>

          {/* API Configuration */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Client ID
              </label>
              <input
                type="text"
                name="client_id"
                value={formData.client_id}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter your Google Drive Client ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Client Secret
              </label>
              <input
                type="password"
                name="client_secret"
                value={formData.client_secret}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter your Google Drive Client Secret"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Redirect URI
              </label>
              <input
                type="text"
                name="redirect_uri"
                value={formData.redirect_uri}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter your redirect URI"
              />
            </div>
          </div>

          {/* Sync Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Sync Settings
            </h3>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="auto_sync"
                name="auto_sync"
                checked={formData.auto_sync}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="auto_sync"
                className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Enable Auto Sync
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sync Interval (minutes)
              </label>
              <select
                name="sync_interval"
                value={formData.sync_interval}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="360">6 hours</option>
                <option value="720">12 hours</option>
                <option value="1440">24 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Default Folder
              </label>
              <input
                type="text"
                name="default_folder"
                value={formData.default_folder}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter default folder path"
              />
            </div>
          </div>

          {/* File Type Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              File Types to Sync
            </h3>
            <div className="space-y-3">
              {Object.entries(formData.file_types).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`file_types.${key}`}
                    name={`file_types.${key}`}
                    checked={value}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`file_types.${key}`}
                    className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Maximum File Size (MB)
            </label>
            <input
              type="number"
              name="max_file_size"
              value={formData.max_file_size}
              onChange={handleInputChange}
              min="1"
              max="100"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleDriveSettings; 