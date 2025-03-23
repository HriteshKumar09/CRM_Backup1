import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../Services/api';

const SubscriptionsSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subscription_prefix: 'SUB',
    subscription_number_format: 'SUB-{year}-{number}',
    subscription_valid_days: '30',
    subscription_terms: '',
    subscription_footer: '',
    subscription_logo: '',
    subscription_signature: '',
    subscription_email_template: '',
    subscription_notification_settings: {
      new_subscription: true,
      subscription_renewed: true,
      subscription_cancelled: true,
      subscription_expired: true,
      subscription_payment_failed: true,
      subscription_payment_success: true
    },
    subscription_billing_settings: {
      auto_renew: true,
      prorate_on_upgrade: true,
      prorate_on_downgrade: true,
      allow_cancellation: true,
      cancellation_period: '30',
      grace_period: '7',
      retry_failed_payments: true,
      max_retry_attempts: '3',
      retry_interval: '3'
    },
    subscription_invoice_settings: {
      generate_invoice: true,
      invoice_prefix: 'INV',
      invoice_number_format: 'INV-{year}-{number}',
      invoice_due_days: '30',
      invoice_terms: '',
      invoice_footer: '',
      invoice_logo: '',
      invoice_signature: '',
      invoice_email_template: ''
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/subscriptions');
      if (response.data.success) {
        setFormData(response.data.data || {});
      } else {
        toast.error(response.data.message || 'Failed to load subscription settings');
      }
    } catch (error) {
      console.error('Error fetching subscription settings:', error);
      toast.error('Failed to load subscription settings');
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

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/subscriptions', formData);
      
      if (response.data.success) {
        toast.success('Subscription settings saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving subscription settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
          Subscription Settings
        </h2>

        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Basic Settings
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subscription Prefix
              </label>
              <input
                type="text"
                name="subscription_prefix"
                value={formData.subscription_prefix}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subscription Number Format
              </label>
              <input
                type="text"
                name="subscription_number_format"
                value={formData.subscription_number_format}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="SUB-{year}-{number}"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Available variables: {'{year}'}, {'{number}'}, {'{month}'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subscription Valid Days
              </label>
              <input
                type="number"
                name="subscription_valid_days"
                value={formData.subscription_valid_days}
                onChange={handleInputChange}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Billing Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Billing Settings
            </h3>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="subscription_billing_settings.auto_renew"
                  name="subscription_billing_settings.auto_renew"
                  checked={formData.subscription_billing_settings.auto_renew}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="subscription_billing_settings.auto_renew"
                  className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Auto Renew
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="subscription_billing_settings.prorate_on_upgrade"
                  name="subscription_billing_settings.prorate_on_upgrade"
                  checked={formData.subscription_billing_settings.prorate_on_upgrade}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="subscription_billing_settings.prorate_on_upgrade"
                  className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Prorate on Upgrade
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="subscription_billing_settings.prorate_on_downgrade"
                  name="subscription_billing_settings.prorate_on_downgrade"
                  checked={formData.subscription_billing_settings.prorate_on_downgrade}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="subscription_billing_settings.prorate_on_downgrade"
                  className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Prorate on Downgrade
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="subscription_billing_settings.allow_cancellation"
                  name="subscription_billing_settings.allow_cancellation"
                  checked={formData.subscription_billing_settings.allow_cancellation}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="subscription_billing_settings.allow_cancellation"
                  className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Allow Cancellation
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cancellation Period (days)
                </label>
                <input
                  type="number"
                  name="subscription_billing_settings.cancellation_period"
                  value={formData.subscription_billing_settings.cancellation_period}
                  onChange={handleInputChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Grace Period (days)
                </label>
                <input
                  type="number"
                  name="subscription_billing_settings.grace_period"
                  value={formData.subscription_billing_settings.grace_period}
                  onChange={handleInputChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="subscription_billing_settings.retry_failed_payments"
                  name="subscription_billing_settings.retry_failed_payments"
                  checked={formData.subscription_billing_settings.retry_failed_payments}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="subscription_billing_settings.retry_failed_payments"
                  className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Retry Failed Payments
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Max Retry Attempts
                </label>
                <input
                  type="number"
                  name="subscription_billing_settings.max_retry_attempts"
                  value={formData.subscription_billing_settings.max_retry_attempts}
                  onChange={handleInputChange}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Retry Interval (days)
                </label>
                <input
                  type="number"
                  name="subscription_billing_settings.retry_interval"
                  value={formData.subscription_billing_settings.retry_interval}
                  onChange={handleInputChange}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Notification Settings
            </h3>

            <div className="space-y-3">
              {Object.entries(formData.subscription_notification_settings).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`subscription_notification_settings.${key}`}
                    name={`subscription_notification_settings.${key}`}
                    checked={value}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`subscription_notification_settings.${key}`}
                    className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Invoice Settings
            </h3>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="subscription_invoice_settings.generate_invoice"
                name="subscription_invoice_settings.generate_invoice"
                checked={formData.subscription_invoice_settings.generate_invoice}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="subscription_invoice_settings.generate_invoice"
                className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Generate Invoice
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Invoice Prefix
              </label>
              <input
                type="text"
                name="subscription_invoice_settings.invoice_prefix"
                value={formData.subscription_invoice_settings.invoice_prefix}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Invoice Number Format
              </label>
              <input
                type="text"
                name="subscription_invoice_settings.invoice_number_format"
                value={formData.subscription_invoice_settings.invoice_number_format}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="INV-{year}-{number}"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Invoice Due Days
              </label>
              <input
                type="number"
                name="subscription_invoice_settings.invoice_due_days"
                value={formData.subscription_invoice_settings.invoice_due_days}
                onChange={handleInputChange}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Invoice Terms
              </label>
              <textarea
                name="subscription_invoice_settings.invoice_terms"
                value={formData.subscription_invoice_settings.invoice_terms}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Invoice Footer
              </label>
              <textarea
                name="subscription_invoice_settings.invoice_footer"
                value={formData.subscription_invoice_settings.invoice_footer}
                onChange={handleInputChange}
                rows="2"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
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

export default SubscriptionsSettings; 