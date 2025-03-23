import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4008';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
});

const EmailSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email_protocol: 'outlook',
    email_sent_from_name: '',
    email_sent_from_address: '',
    email_smtp_host: 'smtp.office365.com',
    email_smtp_port: '587',
    email_smtp_user: '',
    email_smtp_pass: '',
    email_smtp_security_type: 'tls',
    test_email: ''
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    fetchEmailSettings();
  }, []);

  const fetchEmailSettings = async () => {
    try {
      const response = await api.get('/api/settings/email', {
        headers: getAuthHeader()
      });
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          ...response.data.data
        }));
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        toast.error('Unable to connect to the server. Please check if the server is running.');
      } else {
        toast.error('Failed to load email settings: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email_sent_from_address)) {
      toast.error('Please enter a valid sender email address');
      return;
    }

    if (!formData.email_sent_from_name) {
      toast.error('Please enter a sender name');
      return;
    }

    setSaving(true);
    try {
      const response = await api.put('/api/settings/email', formData, {
        headers: getAuthHeader()
      });
      if (response.data.success) {
        toast.success('Email settings saved successfully');
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        toast.error('Unable to connect to the server. Please check if the server is running.');
      } else {
        toast.error('Failed to save settings: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    if (!formData.test_email) {
      toast.error('Please enter a test email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.test_email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSendingTest(true);
    try {
      const response = await api.post('/api/settings/email/test', 
        { test_email: formData.test_email },
        { headers: getAuthHeader() }
      );
      
      if (response.data.success) {
        toast.success('Test email sent successfully. Please check your inbox.');
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        toast.error('Unable to connect to the server. Please check if the server is running.');
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to send test email';
        toast.error(errorMessage);

        // If there's an authentication error, show additional help
        if (errorMessage.includes('authentication failed')) {
          toast.info('If you have 2FA enabled, you need to use an App Password. Check the instructions below.', {
            autoClose: 10000
          });
        }
      }
    } finally {
      setSendingTest(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Email Settings</h2>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Email Protocol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Protocol
            </label>
            <select
              name="email_protocol"
              value={formData.email_protocol}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="outlook">Microsoft Outlook/Office 365</option>
              <option value="smtp">Custom SMTP</option>
            </select>
          </div>

          {/* Sender Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sender Name *
            </label>
            <input
              type="text"
              name="email_sent_from_name"
              value={formData.email_sent_from_name}
              onChange={handleInputChange}
              placeholder="e.g., CRM Admin"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Sender Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sender Email Address *
            </label>
            <input
              type="email"
              name="email_sent_from_address"
              value={formData.email_sent_from_address}
              onChange={handleInputChange}
              placeholder="your@drighna.com"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {formData.email_protocol === 'smtp' ? (
            <>
              {/* Custom SMTP Settings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SMTP Host *
                </label>
                <input
                  type="text"
                  name="email_smtp_host"
                  value={formData.email_smtp_host}
                  onChange={handleInputChange}
                  placeholder="e.g., smtp.yourserver.com"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SMTP Port *
                </label>
                <input
                  type="number"
                  name="email_smtp_port"
                  value={formData.email_smtp_port}
                  onChange={handleInputChange}
                  placeholder="e.g., 587"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Security Type
                </label>
                <select
                  name="email_smtp_security_type"
                  value={formData.email_smtp_security_type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                  <option value="none">None</option>
                </select>
              </div>
            </>
          ) : (
            // Outlook specific help text
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Using Outlook/Office 365 configuration:
                <ul className="list-disc ml-5 mt-2">
                  <li>SMTP Host: smtp.office365.com (pre-configured)</li>
                  <li>SMTP Port: 587 (pre-configured)</li>
                  <li>Security: TLS (pre-configured)</li>
                </ul>
              </p>
            </div>
          )}

          {/* Password field - shown for both SMTP and Outlook */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="email_smtp_pass"
                value={formData.email_smtp_pass}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {formData.email_protocol === 'outlook' && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                If you have 2FA enabled, you'll need to use an App Password. 
                <a 
                  href="https://account.microsoft.com/security" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 ml-1"
                >
                  Generate one here
                </a>
              </p>
            )}
          </div>

          {/* Test Email */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Test Email Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Send a test email to
                </label>
                <div className="flex space-x-4">
                  <input
                    type="email"
                    name="test_email"
                    value={formData.test_email}
                    onChange={handleInputChange}
                    placeholder="recipient@example.com"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleTestEmail}
                    disabled={sendingTest || !formData.test_email}
                    className="mt-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {sendingTest ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      'Send Test'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t pt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings; 