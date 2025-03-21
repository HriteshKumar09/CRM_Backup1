import React, { useState } from 'react';

const ClientBillingSettings = () => {
  const [billingSettings, setBillingSettings] = useState({
    paymentMethods: {
      creditCard: true,
      bankTransfer: true,
      paypal: false,
      stripe: true
    },
    invoiceSettings: {
      autoGenerate: true,
      frequency: 'monthly',
      dueDays: 30,
      lateFee: 5,
      currency: 'USD',
      taxRate: 0,
      includeTax: false
    },
    emailNotifications: {
      invoiceGenerated: true,
      paymentReceived: true,
      paymentFailed: true,
      upcomingDue: true,
      overdue: true
    },
    paymentTerms: {
      default: 'net30',
      earlyPaymentDiscount: {
        enabled: false,
        percentage: 2,
        days: 10
      }
    }
  });

  const handlePaymentMethodToggle = (method) => {
    setBillingSettings(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: !prev.paymentMethods[method]
      }
    }));
  };

  const handleInvoiceSettingChange = (field, value) => {
    setBillingSettings(prev => ({
      ...prev,
      invoiceSettings: {
        ...prev.invoiceSettings,
        [field]: value
      }
    }));
  };

  const handleEmailNotificationToggle = (notification) => {
    setBillingSettings(prev => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [notification]: !prev.emailNotifications[notification]
      }
    }));
  };

  const handlePaymentTermsChange = (field, value) => {
    setBillingSettings(prev => ({
      ...prev,
      paymentTerms: {
        ...prev.paymentTerms,
        [field]: value
      }
    }));
  };

  const handleEarlyPaymentDiscountToggle = () => {
    setBillingSettings(prev => ({
      ...prev,
      paymentTerms: {
        ...prev.paymentTerms,
        earlyPaymentDiscount: {
          ...prev.paymentTerms.earlyPaymentDiscount,
          enabled: !prev.paymentTerms.earlyPaymentDiscount.enabled
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Client Portal Billing Settings</h2>

        {/* Payment Methods */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Methods</h3>
          <div className="space-y-4">
            {Object.entries(billingSettings.paymentMethods).map(([method, enabled]) => (
              <div key={method} className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {method.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Allow clients to pay using {method.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </p>
                </div>
                <button
                  onClick={() => handlePaymentMethodToggle(method)}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                      transition duration-200 ease-in-out
                      ${enabled ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Invoice Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Auto-generate Invoices
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Automatically generate invoices based on billing cycle
                </p>
              </div>
              <button
                onClick={() => handleInvoiceSettingChange('autoGenerate', !billingSettings.invoiceSettings.autoGenerate)}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${billingSettings.invoiceSettings.autoGenerate ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${billingSettings.invoiceSettings.autoGenerate ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>

            {billingSettings.invoiceSettings.autoGenerate && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Billing Frequency
                  </label>
                  <select
                    value={billingSettings.invoiceSettings.frequency}
                    onChange={(e) => handleInvoiceSettingChange('frequency', e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Due (days)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={billingSettings.invoiceSettings.dueDays}
                    onChange={(e) => handleInvoiceSettingChange('dueDays', parseInt(e.target.value))}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Late Fee (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={billingSettings.invoiceSettings.lateFee}
                    onChange={(e) => handleInvoiceSettingChange('lateFee', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Currency
                  </label>
                  <select
                    value={billingSettings.invoiceSettings.currency}
                    onChange={(e) => handleInvoiceSettingChange('currency', e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Email Notifications */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Email Notifications</h3>
          <div className="space-y-4">
            {Object.entries(billingSettings.emailNotifications).map(([notification, enabled]) => (
              <div key={notification} className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {notification.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Send email notification when {notification.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </p>
                </div>
                <button
                  onClick={() => handleEmailNotificationToggle(notification)}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                      transition duration-200 ease-in-out
                      ${enabled ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Terms */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Terms</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Payment Terms
              </label>
              <select
                value={billingSettings.paymentTerms.default}
                onChange={(e) => handlePaymentTermsChange('default', e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
              >
                <option value="net15">Net 15</option>
                <option value="net30">Net 30</option>
                <option value="net45">Net 45</option>
                <option value="net60">Net 60</option>
                <option value="net90">Net 90</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Early Payment Discount
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Offer discount for early payment
                </p>
              </div>
              <button
                onClick={handleEarlyPaymentDiscountToggle}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${billingSettings.paymentTerms.earlyPaymentDiscount.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${billingSettings.paymentTerms.earlyPaymentDiscount.enabled ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>

            {billingSettings.paymentTerms.earlyPaymentDiscount.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Discount Percentage
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={billingSettings.paymentTerms.earlyPaymentDiscount.percentage}
                    onChange={(e) => handlePaymentTermsChange('earlyPaymentDiscount', {
                      ...billingSettings.paymentTerms.earlyPaymentDiscount,
                      percentage: parseFloat(e.target.value)
                    })}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Days for Early Payment
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={billingSettings.paymentTerms.earlyPaymentDiscount.days}
                    onChange={(e) => handlePaymentTermsChange('earlyPaymentDiscount', {
                      ...billingSettings.paymentTerms.earlyPaymentDiscount,
                      days: parseInt(e.target.value)
                    })}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
                  />
                </div>
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

export default ClientBillingSettings; 