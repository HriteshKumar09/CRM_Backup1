import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../Services/api';

const ExpenseCategoriesSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    categories: [
      {
        name: 'Travel',
        description: 'Travel-related expenses',
        color: '#3B82F6',
        icon: 'plane',
        requires_receipt: true,
        requires_approval: true,
        requires_notes: true,
        enabled: true
      },
      {
        name: 'Meals',
        description: 'Food and beverage expenses',
        color: '#10B981',
        icon: 'utensils',
        requires_receipt: true,
        requires_approval: true,
        requires_notes: true,
        enabled: true
      }
    ],
    settings: {
      allow_custom_categories: true,
      require_receipt: true,
      require_approval: true,
      require_notes: true,
      require_date: true,
      require_amount: true,
      require_currency: true,
      allow_attachments: true,
      max_attachments: 5,
      max_attachment_size: 10, // MB
      allow_duplicate_names: false,
      allow_archiving: true,
      allow_deletion: false,
      default_currency: 'USD',
      default_tax_rate: 0,
      require_project: true,
      require_client: true
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/expense-categories');
      if (response.data.success) {
        setFormData(response.data.data || {});
      } else {
        toast.error(response.data.message || 'Failed to load expense category settings');
      }
    } catch (error) {
      console.error('Error fetching expense category settings:', error);
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

  const handleCategoryChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.map((category, i) => 
        i === index ? { ...category, [field]: value } : category
      )
    }));
  };

  const handleAddCategory = () => {
    setFormData(prev => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          name: '',
          description: '',
          color: '#6B7280',
          icon: 'receipt',
          requires_receipt: true,
          requires_approval: true,
          requires_notes: true,
          enabled: true
        }
      ]
    }));
  };

  const handleRemoveCategory = (index) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/expense-categories', formData);
      
      if (response.data.success) {
        toast.success('Expense category settings saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving expense category settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
          Expense Category Settings
        </h2>

        <div className="space-y-6">
          {/* Categories */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Categories
              </h3>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Add Category
              </button>
            </div>

            <div className="space-y-4">
              {formData.categories.map((category, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Category Name"
                  />
                  <input
                    type="text"
                    value={category.description}
                    onChange={(e) => handleCategoryChange(index, 'description', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Description"
                  />
                  <input
                    type="color"
                    value={category.color}
                    onChange={(e) => handleCategoryChange(index, 'color', e.target.value)}
                    className="h-10 w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={category.requires_receipt}
                        onChange={(e) => handleCategoryChange(index, 'requires_receipt', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Receipt</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={category.requires_approval}
                        onChange={(e) => handleCategoryChange(index, 'requires_approval', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Approval</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={category.requires_notes}
                        onChange={(e) => handleCategoryChange(index, 'requires_notes', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Notes</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={category.enabled}
                        onChange={(e) => handleCategoryChange(index, 'enabled', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enabled</label>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveCategory(index)}
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

export default ExpenseCategoriesSettings; 