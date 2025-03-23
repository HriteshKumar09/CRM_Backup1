import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../Services/api';

const PagesSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    page_types: [
      {
        name: 'About',
        description: 'About page template',
        template: 'about',
        requires_title: true,
        requires_content: true,
        requires_meta: true,
        enabled: true
      },
      {
        name: 'Contact',
        description: 'Contact page template',
        template: 'contact',
        requires_title: true,
        requires_content: true,
        requires_form: true,
        enabled: true
      }
    ],
    templates: [
      {
        name: 'Default',
        description: 'Default page template',
        layout: 'default',
        sections: ['header', 'content', 'footer'],
        custom_css: '',
        custom_js: '',
        enabled: true
      },
      {
        name: 'Full Width',
        description: 'Full width page template',
        layout: 'full-width',
        sections: ['header', 'content', 'footer'],
        custom_css: '',
        custom_js: '',
        enabled: true
      }
    ],
    settings: {
      allow_custom_types: true,
      require_title: true,
      require_content: true,
      require_meta: true,
      allow_custom_templates: true,
      allow_custom_css: true,
      allow_custom_js: true,
      allow_page_redirects: true,
      allow_page_versions: true,
      allow_page_comments: true,
      allow_page_ratings: true,
      allow_page_sharing: true,
      allow_page_printing: true,
      allow_page_translation: true,
      default_template: 'default',
      default_layout: 'default',
      show_breadcrumbs: true,
      show_last_modified: true,
      show_author: true,
      show_comments: true,
      show_ratings: true,
      show_sharing: true,
      show_print: true,
      show_translation: true
    },
    seo: {
      enable_seo: true,
      require_meta_title: true,
      require_meta_description: true,
      require_meta_keywords: true,
      allow_custom_url: true,
      allow_canonical_url: true,
      allow_robots: true,
      allow_sitemap: true,
      default_robots: 'index,follow',
      default_sitemap: true,
      enable_og_tags: true,
      enable_twitter_cards: true,
      enable_schema_markup: true,
      enable_amp: false,
      enable_pwa: false
    },
    performance: {
      enable_caching: true,
      enable_compression: true,
      enable_lazy_loading: true,
      enable_cdn: false,
      enable_minification: true,
      enable_browser_caching: true,
      enable_gzip: true,
      enable_brotli: true,
      enable_http2: true,
      enable_https: true,
      enable_ssl: true,
      enable_redirects: true,
      enable_404_page: true,
      enable_maintenance_mode: false,
      enable_debug_mode: false
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/pages');
      if (response.data.success) {
        setFormData(response.data.data || {});
      } else {
        toast.error(response.data.message || 'Failed to load page settings');
      }
    } catch (error) {
      console.error('Error fetching page settings:', error);
      toast.error('Failed to load settings');
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
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    }
  };

  const handlePageTypeChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      page_types: prev.page_types.map((type, i) => 
        i === index ? { ...type, [field]: value } : type
      )
    }));
  };

  const handleTemplateChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      templates: prev.templates.map((template, i) => 
        i === index ? { ...template, [field]: value } : template
      )
    }));
  };

  const handleAddPageType = () => {
    setFormData(prev => ({
      ...prev,
      page_types: [
        ...prev.page_types,
        {
          name: '',
          description: '',
          template: 'default',
          requires_title: true,
          requires_content: true,
          requires_meta: true,
          enabled: true
        }
      ]
    }));
  };

  const handleAddTemplate = () => {
    setFormData(prev => ({
      ...prev,
      templates: [
        ...prev.templates,
        {
          name: '',
          description: '',
          layout: 'default',
          sections: ['header', 'content', 'footer'],
          custom_css: '',
          custom_js: '',
          enabled: true
        }
      ]
    }));
  };

  const handleRemovePageType = (index) => {
    setFormData(prev => ({
      ...prev,
      page_types: prev.page_types.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveTemplate = (index) => {
    setFormData(prev => ({
      ...prev,
      templates: prev.templates.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/pages', formData);
      
      if (response.data.success) {
        toast.success('Page settings saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving page settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
          Page Settings
        </h2>

        <div className="space-y-6">
          {/* Page Types */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Page Types
              </h3>
              <button
                onClick={handleAddPageType}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Add Page Type
              </button>
            </div>

            <div className="space-y-4">
              {formData.page_types.map((type, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <input
                    type="text"
                    value={type.name}
                    onChange={(e) => handlePageTypeChange(index, 'name', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Page Type Name"
                  />
                  <input
                    type="text"
                    value={type.description}
                    onChange={(e) => handlePageTypeChange(index, 'description', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Description"
                  />
                  <input
                    type="text"
                    value={type.template}
                    onChange={(e) => handlePageTypeChange(index, 'template', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Template"
                  />
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={type.requires_title}
                        onChange={(e) => handlePageTypeChange(index, 'requires_title', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Title</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={type.requires_content}
                        onChange={(e) => handlePageTypeChange(index, 'requires_content', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Content</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={type.requires_meta}
                        onChange={(e) => handlePageTypeChange(index, 'requires_meta', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Meta</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={type.enabled}
                        onChange={(e) => handlePageTypeChange(index, 'enabled', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enabled</label>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemovePageType(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Templates
              </h3>
              <button
                onClick={handleAddTemplate}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Add Template
              </button>
            </div>

            <div className="space-y-4">
              {formData.templates.map((template, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <input
                    type="text"
                    value={template.name}
                    onChange={(e) => handleTemplateChange(index, 'name', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Template Name"
                  />
                  <input
                    type="text"
                    value={template.description}
                    onChange={(e) => handleTemplateChange(index, 'description', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Description"
                  />
                  <input
                    type="text"
                    value={template.layout}
                    onChange={(e) => handleTemplateChange(index, 'layout', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Layout"
                  />
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={template.enabled}
                        onChange={(e) => handleTemplateChange(index, 'enabled', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enabled</label>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveTemplate(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.settings).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type={typeof value === 'boolean' ? 'checkbox' : 'text'}
                    id={`settings.${key}`}
                    name={`settings.${key}`}
                    checked={typeof value === 'boolean' ? value : undefined}
                    value={typeof value === 'boolean' ? undefined : value}
                    onChange={handleInputChange}
                    className={typeof value === 'boolean' ? 
                      "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" :
                      "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    }
                  />
                  <label
                    htmlFor={`settings.${key}`}
                    className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              SEO Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.seo).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type={typeof value === 'boolean' ? 'checkbox' : 'text'}
                    id={`seo.${key}`}
                    name={`seo.${key}`}
                    checked={typeof value === 'boolean' ? value : undefined}
                    value={typeof value === 'boolean' ? undefined : value}
                    onChange={handleInputChange}
                    className={typeof value === 'boolean' ? 
                      "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" :
                      "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    }
                  />
                  <label
                    htmlFor={`seo.${key}`}
                    className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Performance Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.performance).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type={typeof value === 'boolean' ? 'checkbox' : 'text'}
                    id={`performance.${key}`}
                    name={`performance.${key}`}
                    checked={typeof value === 'boolean' ? value : undefined}
                    value={typeof value === 'boolean' ? undefined : value}
                    onChange={handleInputChange}
                    className={typeof value === 'boolean' ? 
                      "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" :
                      "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    }
                  />
                  <label
                    htmlFor={`performance.${key}`}
                    className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                </div>
              ))}
            </div>
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

export default PagesSettings; 