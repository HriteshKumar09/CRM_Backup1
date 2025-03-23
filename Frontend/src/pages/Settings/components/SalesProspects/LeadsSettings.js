import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../Services/api';

const LeadsSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    lead_sources: [
      {
        name: 'Website',
        description: 'Leads from website',
        color: '#3B82F6',
        icon: 'globe',
        requires_contact: true,
        requires_company: true,
        requires_budget: true,
        enabled: true
      },
      {
        name: 'Referral',
        description: 'Leads from referrals',
        color: '#10B981',
        icon: 'users',
        requires_contact: true,
        requires_company: true,
        requires_budget: false,
        enabled: true
      }
    ],
    stages: [
      {
        name: 'New',
        color: '#EF4444',
        is_default: true,
        allows_edit: true,
        allows_delete: true,
        requires_notes: false,
        enabled: true
      },
      {
        name: 'Contacted',
        color: '#F59E0B',
        is_default: false,
        allows_edit: true,
        allows_delete: true,
        requires_notes: true,
        enabled: true
      },
      {
        name: 'Qualified',
        color: '#10B981',
        is_default: false,
        allows_edit: true,
        allows_delete: true,
        requires_notes: true,
        enabled: true
      }
    ],
    settings: {
      allow_custom_sources: true,
      require_contact: true,
      require_company: true,
      require_budget: false,
      require_notes: true,
      require_assignee: true,
      allow_duplicate_leads: false,
      allow_lead_transfer: true,
      allow_lead_merge: true,
      allow_lead_split: true,
      max_attachments: 5,
      max_attachment_size: 10, // MB
      default_assignee: 'none',
      auto_assign: false,
      auto_convert: false,
      auto_convert_days: 30,
      require_feedback: true,
      allow_rating: true,
      allow_comment: true
    },
    notifications: {
      lead_created: true,
      lead_updated: true,
      lead_assigned: true,
      lead_reassigned: true,
      lead_converted: true,
      lead_lost: true,
      lead_commented: true,
      lead_rated: true,
      lead_merged: true,
      lead_split: true,
      notify_admin: true,
      notify_manager: true,
      notify_owner: true
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/leads');
      if (response.data.success) {
        setFormData(response.data.data || {});
      } else {
        toast.error(response.data.message || 'Failed to load lead settings');
      }
    } catch (error) {
      console.error('Error fetching lead settings:', error);
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

  const handleLeadSourceChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      lead_sources: prev.lead_sources.map((source, i) => 
        i === index ? { ...source, [field]: value } : source
      )
    }));
  };

  const handleStageChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      stages: prev.stages.map((stage, i) => 
        i === index ? { ...stage, [field]: value } : stage
      )
    }));
  };

  const handleAddLeadSource = () => {
    setFormData(prev => ({
      ...prev,
      lead_sources: [
        ...prev.lead_sources,
        {
          name: '',
          description: '',
          color: '#6B7280',
          icon: 'user',
          requires_contact: true,
          requires_company: true,
          requires_budget: false,
          enabled: true
        }
      ]
    }));
  };

  const handleAddStage = () => {
    setFormData(prev => ({
      ...prev,
      stages: [
        ...prev.stages,
        {
          name: '',
          color: '#6B7280',
          is_default: false,
          allows_edit: true,
          allows_delete: true,
          requires_notes: false,
          enabled: true
        }
      ]
    }));
  };

  const handleRemoveLeadSource = (index) => {
    setFormData(prev => ({
      ...prev,
      lead_sources: prev.lead_sources.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveStage = (index) => {
    setFormData(prev => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/leads', formData);
      
      if (response.data.success) {
        toast.success('Lead settings saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving lead settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
          Lead Settings
        </h2>

        <div className="space-y-6">
          {/* Lead Sources */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Lead Sources
              </h3>
              <button
                onClick={handleAddLeadSource}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Add Lead Source
              </button>
            </div>

            <div className="space-y-4">
              {formData.lead_sources.map((source, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <input
                    type="text"
                    value={source.name}
                    onChange={(e) => handleLeadSourceChange(index, 'name', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Lead Source Name"
                  />
                  <input
                    type="text"
                    value={source.description}
                    onChange={(e) => handleLeadSourceChange(index, 'description', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Description"
                  />
                  <input
                    type="color"
                    value={source.color}
                    onChange={(e) => handleLeadSourceChange(index, 'color', e.target.value)}
                    className="h-10 w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={source.requires_contact}
                        onChange={(e) => handleLeadSourceChange(index, 'requires_contact', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Contact</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={source.requires_company}
                        onChange={(e) => handleLeadSourceChange(index, 'requires_company', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Company</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={source.requires_budget}
                        onChange={(e) => handleLeadSourceChange(index, 'requires_budget', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Budget</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={source.enabled}
                        onChange={(e) => handleLeadSourceChange(index, 'enabled', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enabled</label>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveLeadSource(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Stages */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Stages
              </h3>
              <button
                onClick={handleAddStage}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Add Stage
              </button>
            </div>

            <div className="space-y-4">
              {formData.stages.map((stage, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <input
                    type="text"
                    value={stage.name}
                    onChange={(e) => handleStageChange(index, 'name', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Stage Name"
                  />
                  <input
                    type="color"
                    value={stage.color}
                    onChange={(e) => handleStageChange(index, 'color', e.target.value)}
                    className="h-10 w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={stage.is_default}
                        onChange={(e) => handleStageChange(index, 'is_default', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Default</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={stage.allows_edit}
                        onChange={(e) => handleStageChange(index, 'allows_edit', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Allows Edit</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={stage.allows_delete}
                        onChange={(e) => handleStageChange(index, 'allows_delete', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Allows Delete</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={stage.requires_notes}
                        onChange={(e) => handleStageChange(index, 'requires_notes', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Requires Notes</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={stage.enabled}
                        onChange={(e) => handleStageChange(index, 'enabled', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enabled</label>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveStage(index)}
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

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Notification Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`notifications.${key}`}
                    name={`notifications.${key}`}
                    checked={value}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`notifications.${key}`}
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

export default LeadsSettings; 