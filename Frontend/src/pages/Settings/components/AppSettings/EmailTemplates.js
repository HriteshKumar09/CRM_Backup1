import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

const EmailTemplates = () => {
  const [selectedCategory, setSelectedCategory] = useState('Account');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const categories = [
    {
      name: 'Account',
      templates: [
        { id: 1, name: 'Account Created' },
        { id: 2, name: 'Password Reset' },
        { id: 3, name: 'Email Verification' }
      ]
    },
    {
      name: 'Announcement',
      templates: [
        { id: 4, name: 'New Announcement' },
        { id: 5, name: 'Announcement Update' }
      ]
    },
    {
      name: 'Common',
      templates: [
        { id: 6, name: 'Welcome Email' },
        { id: 7, name: 'Notification Email' }
      ]
    },
    {
      name: 'Contract',
      templates: [
        { id: 8, name: 'Contract Created' },
        { id: 9, name: 'Contract Updated' }
      ]
    },
    {
      name: 'Estimate',
      templates: [
        { id: 10, name: 'New Estimate' },
        { id: 11, name: 'Estimate Accepted' }
      ]
    },
    {
      name: 'Invoice',
      templates: [
        { id: 12, name: 'Invoice Generated' },
        { id: 13, name: 'Payment Received' }
      ]
    },
    {
      name: 'Message',
      templates: [
        { id: 14, name: 'New Message' },
        { id: 15, name: 'Message Reply' }
      ]
    },
    {
      name: 'Order',
      templates: [
        { id: 16, name: 'Order Confirmation' },
        { id: 17, name: 'Order Status Update' }
      ]
    },
    {
      name: 'Project',
      templates: [
        { id: 18, name: 'Project Created' },
        { id: 19, name: 'Project Update' }
      ]
    },
    {
      name: 'Proposal',
      templates: [
        { id: 20, name: 'New Proposal' },
        { id: 21, name: 'Proposal Accepted' }
      ]
    },
    {
      name: 'Purchase',
      templates: [
        { id: 22, name: 'Purchase Order' },
        { id: 23, name: 'Purchase Confirmation' }
      ]
    },
    {
      name: 'Subscription',
      templates: [
        { id: 24, name: 'Subscription Created' },
        { id: 25, name: 'Subscription Renewed' }
      ]
    },
    {
      name: 'Task',
      templates: [
        { id: 26, name: 'Task Assigned' },
        { id: 27, name: 'Task Completed' }
      ]
    },
    {
      name: 'Ticket',
      templates: [
        { id: 28, name: 'Ticket Created' },
        { id: 29, name: 'Ticket Response' }
      ]
    },
    {
      name: 'Zoom meeting',
      templates: [
        { id: 30, name: 'Meeting Scheduled' },
        { id: 31, name: 'Meeting Reminder' }
      ]
    }
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedTemplate(null);
  };

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="flex h-full bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Left Sidebar - Categories */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Email templates</h2>
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
                  selectedCategory === category.name
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <span>{category.name}</span>
                <IoIosArrowDown className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Section - Templates List */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Select a template to edit
          </h3>
          <div className="space-y-1">
            {categories
              .find((c) => c.name === selectedCategory)
              ?.templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    selectedTemplate?.id === template.id
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {template.name}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Right Section - Template Editor */}
      <div className="flex-1 p-6">
        {selectedTemplate ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Email subject"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content
              </label>
              <textarea
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Email content"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
              >
                Reset to Default
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Select a template to edit
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailTemplates; 