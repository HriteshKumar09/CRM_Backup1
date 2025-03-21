import React, { useState, useEffect } from 'react';
import { FiUpload } from 'react-icons/fi';
import api from '../../../../Services/api';
import { toast } from 'react-toastify';

const GeneralSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    site_logo: '',
    favicon: '',
    show_logo_in_signin: 'Yes',
    show_background_in_signin: 'Yes',
    signin_page_background: '',
    app_title: '',
    accepted_file_formats: '',
    rows_per_page: '10',
    scrollbar: 'jQuery',
    enable_rich_text: 'No',
    item_purchase_code: '',
    show_theme_color_changer: 'Yes',
    default_theme_color: '#00B5B8'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/general');
      if (response.data.success) {
        setFormData(response.data.data || {});
      } else {
        toast.error(response.data.message || 'Failed to load settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (field, file) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('field', field);

      const response = await api.post('/settings/upload', formData);
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          [field]: response.data.url
        }));
        toast.success(`${field.replace(/_/g, ' ')} updated successfully`);
      } else {
        toast.error(response.data.message || `Failed to upload ${field.replace(/_/g, ' ')}`);
      }
    } catch (error) {
      console.error(`Error uploading ${field}:`, error);
      toast.error(`Failed to upload ${field.replace(/_/g, ' ')}`);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/general', formData);
      
      if (response.data.success) {
        toast.success('Settings saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">General Settings</h2>
        
        {/* Site Logo Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Site Logo
          </label>
          <div className="flex items-center space-x-4">
            {formData.site_logo && (
              <img
                src={formData.site_logo}
                alt="Site Logo"
                className="h-10 w-auto"
              />
            )}
            <button 
              onClick={() => document.getElementById('logoUpload').click()}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
            >
              <FiUpload className="mr-2" />
              Upload Logo
            </button>
            <input
              id="logoUpload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileUpload('site_logo', e.target.files[0])}
            />
          </div>
        </div>

        {/* Favicon Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Favicon
          </label>
          <div className="flex items-center space-x-4">
            {formData.favicon && (
              <img
                src={formData.favicon}
                alt="Favicon"
                className="h-8 w-8"
              />
            )}
            <button 
              onClick={() => document.getElementById('faviconUpload').click()}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
            >
              <FiUpload className="mr-2" />
              Upload Favicon
            </button>
            <input
              id="faviconUpload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileUpload('favicon', e.target.files[0])}
            />
          </div>
        </div>

        {/* Show Logo in Signin Page */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Show logo in signin page
          </label>
          <select
            name="show_logo_in_signin"
            value={formData.show_logo_in_signin}
            onChange={handleInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Show Background Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Show background image in signin page
          </label>
          <select
            name="show_background_in_signin"
            value={formData.show_background_in_signin}
            onChange={handleInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Signin Background Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Signin page background
          </label>
          <div className="flex items-center space-x-4">
            {formData.signin_page_background && (
              <img
                src={formData.signin_page_background}
                alt="Background"
                className="h-24 w-40 object-cover rounded"
              />
            )}
            <button 
              onClick={() => document.getElementById('backgroundUpload').click()}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
            >
              <FiUpload className="mr-2" />
              Change Background
            </button>
            <input
              id="backgroundUpload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileUpload('signin_page_background', e.target.files[0])}
            />
          </div>
        </div>

        {/* App Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            App Title
          </label>
          <input
            type="text"
            name="app_title"
            value={formData.app_title}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Accepted File Format */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Accepted file formats
          </label>
          <input
            type="text"
            name="accepted_file_formats"
            value={formData.accepted_file_formats}
            onChange={handleInputChange}
            placeholder="jpg,jpeg,png,doc,xlsx,txt,pdf,zip"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Rows per page */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rows per page
          </label>
          <select
            name="rows_per_page"
            value={formData.rows_per_page}
            onChange={handleInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        {/* Scrollbar */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Scrollbar
          </label>
          <select
            name="scrollbar"
            value={formData.scrollbar}
            onChange={handleInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="jQuery">jQuery</option>
            <option value="native">Native</option>
          </select>
        </div>

        {/* Enable rich text editor */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enable rich text editor in comments/description
          </label>
          <select
            name="enable_rich_text"
            value={formData.enable_rich_text}
            onChange={handleInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        {/* Item Purchase Code */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Item Purchase Code
          </label>
          <input
            type="text"
            name="item_purchase_code"
            value={formData.item_purchase_code}
            onChange={handleInputChange}
            placeholder="Enter your purchase code"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Show theme color changer */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Show theme color changer
          </label>
          <select
            name="show_theme_color_changer"
            value={formData.show_theme_color_changer}
            onChange={handleInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Default theme color */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Default theme color
          </label>
          <div className="flex flex-wrap gap-2">
            {['#00B5B8', '#404E67', '#2196F3', '#3F51B5', '#673AB7', '#E91E63', '#FF9149', '#FF4961', '#28D094', '#1E9FF2'].map(color => (
              <button
                key={color}
                onClick={() => handleInputChange({ target: { name: 'default_theme_color', value: color } })}
                className={`w-6 h-6 rounded-full ${formData.default_theme_color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings; 