import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../Services/api';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const CustomFieldsSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    modules: [
      { id: 'clients', name: 'Clients', enabled: true },
      { id: 'projects', name: 'Projects', enabled: true },
      { id: 'tasks', name: 'Tasks', enabled: true },
      { id: 'invoices', name: 'Invoices', enabled: true },
      { id: 'tickets', name: 'Tickets', enabled: true }
    ],
    fields: []
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/custom-fields');
      if (response.data.success) {
        setFormData(response.data.data || {});
      } else {
        toast.error(response.data.message || 'Failed to load custom fields settings');
      }
    } catch (error) {
      console.error('Error fetching custom fields settings:', error);
      toast.error('Failed to load custom fields settings');
    }
  };

  const handleModuleToggle = (moduleId) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map(module => 
        module.id === moduleId ? { ...module, enabled: !module.enabled } : module
      )
    }));
  };

  const handleAddField = (moduleId) => {
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, {
        id: Date.now(),
        moduleId,
        name: '',
        type: 'text',
        required: false,
        options: []
      }]
    }));
  };

  const handleFieldChange = (fieldId, changes) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...changes } : field
      )
    }));
  };

  const handleDeleteField = (fieldId) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/custom-fields', formData);
      
      if (response.data.success) {
        toast.success('Custom fields settings saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save custom fields settings');
      }
    } catch (error) {
      console.error('Error saving custom fields settings:', error);
      toast.error('Failed to save custom fields settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Custom Fields Settings</h2>
        
        {/* Modules List */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Modules</h3>
          <div className="space-y-4">
            {formData.modules.map(module => (
              <div key={module.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={module.enabled}
                      onChange={() => handleModuleToggle(module.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{module.name}</span>
                  </div>
                  <button
                    onClick={() => handleAddField(module.id)}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <FiPlus className="w-4 h-4 mr-1" />
                    Add Field
                  </button>
                </div>

                {/* Fields List */}
                <div className="space-y-4">
                  {formData.fields
                    .filter(field => field.moduleId === module.id)
                    .map(field => (
                      <div key={field.id} className="flex items-center space-x-4 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) => handleFieldChange(field.id, { name: e.target.value })}
                          placeholder="Field Name"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <select
                          value={field.type}
                          onChange={(e) => handleFieldChange(field.id, { type: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="date">Date</option>
                          <option value="select">Select</option>
                          <option value="checkbox">Checkbox</option>
                        </select>
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => handleFieldChange(field.id, { required: e.target.checked })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <button
                          onClick={() => handleDeleteField(field.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
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
  );
};

export default CustomFieldsSettings; 