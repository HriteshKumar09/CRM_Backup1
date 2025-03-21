import React, { useState } from 'react';

const ClientThemeSettings = () => {
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#3B82F6',
    secondaryColor: '#6B7280',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    fontFamily: 'Inter',
    borderRadius: '0.375rem',
    darkMode: false,
    customCSS: ''
  });

  const fontFamilies = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Poppins',
    'Montserrat',
    'Source Sans Pro'
  ];

  const handleColorChange = (field, value) => {
    setThemeSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFontChange = (value) => {
    setThemeSettings(prev => ({
      ...prev,
      fontFamily: value
    }));
  };

  const handleBorderRadiusChange = (value) => {
    setThemeSettings(prev => ({
      ...prev,
      borderRadius: value
    }));
  };

  const handleDarkModeToggle = () => {
    setThemeSettings(prev => ({
      ...prev,
      darkMode: !prev.darkMode
    }));
  };

  const handleCustomCSSChange = (value) => {
    setThemeSettings(prev => ({
      ...prev,
      customCSS: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Client Portal Theme Settings</h2>

        {/* Color Settings */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={themeSettings.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    value={themeSettings.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={themeSettings.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    value={themeSettings.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typography Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Typography</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Family
                </label>
                <select
                  value={themeSettings.fontFamily}
                  onChange={(e) => handleFontChange(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                >
                  {fontFamilies.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Border Radius
                </label>
                <select
                  value={themeSettings.borderRadius}
                  onChange={(e) => handleBorderRadiusChange(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                >
                  <option value="0">None</option>
                  <option value="0.25rem">Small</option>
                  <option value="0.375rem">Medium</option>
                  <option value="0.5rem">Large</option>
                  <option value="1rem">Extra Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Dark Mode</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enable dark mode for the client portal
                </p>
              </div>
              <button
                onClick={handleDarkModeToggle}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${themeSettings.darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${themeSettings.darkMode ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </div>

          {/* Custom CSS */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Custom CSS</h3>
            <textarea
              value={themeSettings.customCSS}
              onChange={(e) => handleCustomCSSChange(e.target.value)}
              placeholder="Enter custom CSS here..."
              rows={4}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-mono"
            />
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

export default ClientThemeSettings; 