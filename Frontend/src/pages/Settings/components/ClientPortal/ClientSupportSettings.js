import React, { useState } from 'react';

const ClientSupportSettings = () => {
  const [supportSettings, setSupportSettings] = useState({
    ticketSystem: {
      enabled: true,
      autoAssign: true,
      defaultPriority: 'medium',
      sla: {
        critical: 2,
        high: 4,
        medium: 8,
        low: 24
      },
      categories: [
        { id: 'technical', name: 'Technical Support', enabled: true },
        { id: 'billing', name: 'Billing Issues', enabled: true },
        { id: 'general', name: 'General Inquiry', enabled: true },
        { id: 'feature', name: 'Feature Request', enabled: true }
      ]
    },
    knowledgeBase: {
      enabled: true,
      categories: [
        { id: 'getting-started', name: 'Getting Started', enabled: true },
        { id: 'faq', name: 'FAQ', enabled: true },
        { id: 'tutorials', name: 'Tutorials', enabled: true },
        { id: 'api', name: 'API Documentation', enabled: true }
      ],
      searchEnabled: true,
      relatedArticles: true
    },
    liveChat: {
      enabled: false,
      hours: {
        start: '09:00',
        end: '17:00',
        timezone: 'UTC'
      },
      offlineMessage: 'Our support team is currently offline. Please leave a message and we will get back to you soon.',
      autoGreeting: 'Hello! How can we help you today?'
    },
    emailSupport: {
      enabled: true,
      address: 'support@example.com',
      responseTime: 24,
      autoReply: true,
      autoReplyMessage: 'Thank you for contacting our support team. We will get back to you within 24 hours.'
    }
  });

  const handleTicketSystemToggle = () => {
    setSupportSettings(prev => ({
      ...prev,
      ticketSystem: {
        ...prev.ticketSystem,
        enabled: !prev.ticketSystem.enabled
      }
    }));
  };

  const handleTicketCategoryToggle = (categoryId) => {
    setSupportSettings(prev => ({
      ...prev,
      ticketSystem: {
        ...prev.ticketSystem,
        categories: prev.ticketSystem.categories.map(category =>
          category.id === categoryId
            ? { ...category, enabled: !category.enabled }
            : category
        )
      }
    }));
  };

  const handleKnowledgeBaseToggle = () => {
    setSupportSettings(prev => ({
      ...prev,
      knowledgeBase: {
        ...prev.knowledgeBase,
        enabled: !prev.knowledgeBase.enabled
      }
    }));
  };

  const handleKnowledgeBaseCategoryToggle = (categoryId) => {
    setSupportSettings(prev => ({
      ...prev,
      knowledgeBase: {
        ...prev.knowledgeBase,
        categories: prev.knowledgeBase.categories.map(category =>
          category.id === categoryId
            ? { ...category, enabled: !category.enabled }
            : category
        )
      }
    }));
  };

  const handleLiveChatToggle = () => {
    setSupportSettings(prev => ({
      ...prev,
      liveChat: {
        ...prev.liveChat,
        enabled: !prev.liveChat.enabled
      }
    }));
  };

  const handleLiveChatHoursChange = (field, value) => {
    setSupportSettings(prev => ({
      ...prev,
      liveChat: {
        ...prev.liveChat,
        hours: {
          ...prev.liveChat.hours,
          [field]: value
        }
      }
    }));
  };

  const handleEmailSupportToggle = () => {
    setSupportSettings(prev => ({
      ...prev,
      emailSupport: {
        ...prev.emailSupport,
        enabled: !prev.emailSupport.enabled
      }
    }));
  };

  const handleEmailSupportChange = (field, value) => {
    setSupportSettings(prev => ({
      ...prev,
      emailSupport: {
        ...prev.emailSupport,
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Client Portal Support Settings</h2>

        {/* Ticket System */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Ticket System</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Enable Ticket System
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Allow clients to submit and track support tickets
                </p>
              </div>
              <button
                onClick={handleTicketSystemToggle}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${supportSettings.ticketSystem.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${supportSettings.ticketSystem.enabled ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>

            {supportSettings.ticketSystem.enabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Priority
                  </label>
                  <select
                    value={supportSettings.ticketSystem.defaultPriority}
                    onChange={(e) => setSupportSettings(prev => ({
                      ...prev,
                      ticketSystem: {
                        ...prev.ticketSystem,
                        defaultPriority: e.target.value
                      }
                    }))}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Response Time SLA (hours)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {Object.entries(supportSettings.ticketSystem.sla).map(([priority, hours]) => (
                      <div key={priority}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                          {priority}
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="72"
                          value={hours}
                          onChange={(e) => setSupportSettings(prev => ({
                            ...prev,
                            ticketSystem: {
                              ...prev.ticketSystem,
                              sla: {
                                ...prev.ticketSystem.sla,
                                [priority]: parseInt(e.target.value)
                              }
                            }
                          }))}
                          className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Ticket Categories
                  </h4>
                  <div className="space-y-2">
                    {supportSettings.ticketSystem.categories.map(category => (
                      <div key={category.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {category.name}
                        </span>
                        <button
                          onClick={() => handleTicketCategoryToggle(category.id)}
                          className={`
                            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                            ${category.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                          `}
                        >
                          <span
                            className={`
                              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                              transition duration-200 ease-in-out
                              ${category.enabled ? 'translate-x-5' : 'translate-x-0'}
                            `}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Knowledge Base */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Knowledge Base</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Enable Knowledge Base
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Provide self-service support documentation
                </p>
              </div>
              <button
                onClick={handleKnowledgeBaseToggle}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${supportSettings.knowledgeBase.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${supportSettings.knowledgeBase.enabled ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>

            {supportSettings.knowledgeBase.enabled && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={supportSettings.knowledgeBase.searchEnabled}
                      onChange={(e) => setSupportSettings(prev => ({
                        ...prev,
                        knowledgeBase: {
                          ...prev.knowledgeBase,
                          searchEnabled: e.target.checked
                        }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Enable search functionality
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={supportSettings.knowledgeBase.relatedArticles}
                      onChange={(e) => setSupportSettings(prev => ({
                        ...prev,
                        knowledgeBase: {
                          ...prev.knowledgeBase,
                          relatedArticles: e.target.checked
                        }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Show related articles
                    </span>
                  </label>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Knowledge Base Categories
                  </h4>
                  <div className="space-y-2">
                    {supportSettings.knowledgeBase.categories.map(category => (
                      <div key={category.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {category.name}
                        </span>
                        <button
                          onClick={() => handleKnowledgeBaseCategoryToggle(category.id)}
                          className={`
                            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                            ${category.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                          `}
                        >
                          <span
                            className={`
                              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                              transition duration-200 ease-in-out
                              ${category.enabled ? 'translate-x-5' : 'translate-x-0'}
                            `}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Chat */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Live Chat</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Enable Live Chat
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Provide real-time support through chat
                </p>
              </div>
              <button
                onClick={handleLiveChatToggle}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${supportSettings.liveChat.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${supportSettings.liveChat.enabled ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>

            {supportSettings.liveChat.enabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={supportSettings.liveChat.hours.start}
                      onChange={(e) => handleLiveChatHoursChange('start', e.target.value)}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={supportSettings.liveChat.hours.end}
                      onChange={(e) => handleLiveChatHoursChange('end', e.target.value)}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timezone
                  </label>
                  <select
                    value={supportSettings.liveChat.hours.timezone}
                    onChange={(e) => handleLiveChatHoursChange('timezone', e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="CST">Central Time</option>
                    <option value="MST">Mountain Time</option>
                    <option value="PST">Pacific Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Offline Message
                  </label>
                  <textarea
                    value={supportSettings.liveChat.offlineMessage}
                    onChange={(e) => setSupportSettings(prev => ({
                      ...prev,
                      liveChat: {
                        ...prev.liveChat,
                        offlineMessage: e.target.value
                      }
                    }))}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Auto Greeting
                  </label>
                  <input
                    type="text"
                    value={supportSettings.liveChat.autoGreeting}
                    onChange={(e) => setSupportSettings(prev => ({
                      ...prev,
                      liveChat: {
                        ...prev.liveChat,
                        autoGreeting: e.target.value
                      }
                    }))}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Email Support */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Email Support</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Enable Email Support
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Allow clients to contact support via email
                </p>
              </div>
              <button
                onClick={handleEmailSupportToggle}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${supportSettings.emailSupport.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${supportSettings.emailSupport.enabled ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>

            {supportSettings.emailSupport.enabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Support Email Address
                  </label>
                  <input
                    type="email"
                    value={supportSettings.emailSupport.address}
                    onChange={(e) => handleEmailSupportChange('address', e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Response Time (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="72"
                    value={supportSettings.emailSupport.responseTime}
                    onChange={(e) => handleEmailSupportChange('responseTime', parseInt(e.target.value))}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={supportSettings.emailSupport.autoReply}
                      onChange={(e) => handleEmailSupportChange('autoReply', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Enable auto-reply
                    </span>
                  </label>
                </div>

                {supportSettings.emailSupport.autoReply && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Auto-reply Message
                    </label>
                    <textarea
                      value={supportSettings.emailSupport.autoReplyMessage}
                      onChange={(e) => handleEmailSupportChange('autoReplyMessage', e.target.value)}
                      rows={3}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                    />
                  </div>
                )}
              </div>
            )}
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

export default ClientSupportSettings; 