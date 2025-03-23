import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../Services/api';

const PaymentMethodsSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    payment_methods: [
      {
        name: 'Cash',
        code: 'cash',
        enabled: true,
        description: 'Cash payment',
        minimum_amount: 0,
        maximum_amount: 1000000,
        processing_fee: 0,
        processing_fee_type: 'percentage',
        payment_instructions: '',
        supported_currencies: ['USD', 'EUR', 'GBP'],
        payment_terms: 'immediate',
        requires_reference: false,
        reference_label: '',
        requires_authorization: false,
        authorization_type: '',
        webhook_url: '',
        webhook_secret: '',
        test_mode: false,
        test_credentials: {},
        live_credentials: {}
      }
    ]
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/payment-methods');
      if (response.data.success) {
        setFormData(response.data.data || {});
      } else {
        toast.error(response.data.message || 'Failed to load payment method settings');
      }
    } catch (error) {
      console.error('Error fetching payment method settings:', error);
      toast.error('Failed to load payment method settings');
    }
  };

  const handleInputChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      payment_methods: prev.payment_methods.map((method, i) => 
        i === index ? { ...method, [field]: value } : method
      )
    }));
  };

  const handleAddMethod = () => {
    setFormData(prev => ({
      ...prev,
      payment_methods: [
        ...prev.payment_methods,
        {
          name: '',
          code: '',
          enabled: true,
          description: '',
          minimum_amount: 0,
          maximum_amount: 1000000,
          processing_fee: 0,
          processing_fee_type: 'percentage',
          payment_instructions: '',
          supported_currencies: ['USD'],
          payment_terms: 'immediate',
          requires_reference: false,
          reference_label: '',
          requires_authorization: false,
          authorization_type: '',
          webhook_url: '',
          webhook_secret: '',
          test_mode: false,
          test_credentials: {},
          live_credentials: {}
        }
      ]
    }));
  };

  const handleRemoveMethod = (index) => {
    setFormData(prev => ({
      ...prev,
      payment_methods: prev.payment_methods.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.post('/settings/payment-methods', formData);
      
      if (response.data.success) {
        toast.success('Payment method settings saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving payment method settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Payment Method Settings
          </h2>
          <button
            onClick={handleAddMethod}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Add Payment Method
          </button>
        </div>

        <div className="space-y-6">
          {formData.payment_methods.map((method, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Payment Method {index + 1}
                </h3>
                <button
                  onClick={() => handleRemoveMethod(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={method.name}
                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Code
                  </label>
                  <input
                    type="text"
                    value={method.code}
                    onChange={(e) => handleInputChange(index, 'code', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={method.description}
                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                    rows="2"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment Instructions
                  </label>
                  <textarea
                    value={method.payment_instructions}
                    onChange={(e) => handleInputChange(index, 'payment_instructions', e.target.value)}
                    rows="2"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Minimum Amount
                  </label>
                  <input
                    type="number"
                    value={method.minimum_amount}
                    onChange={(e) => handleInputChange(index, 'minimum_amount', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maximum Amount
                  </label>
                  <input
                    type="number"
                    value={method.maximum_amount}
                    onChange={(e) => handleInputChange(index, 'maximum_amount', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Processing Fee
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={method.processing_fee}
                      onChange={(e) => handleInputChange(index, 'processing_fee', parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <select
                      value={method.processing_fee_type}
                      onChange={(e) => handleInputChange(index, 'processing_fee_type', e.target.value)}
                      className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="percentage">%</option>
                      <option value="fixed">Fixed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment Terms
                  </label>
                  <select
                    value={method.payment_terms}
                    onChange={(e) => handleInputChange(index, 'payment_terms', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="immediate">Immediate</option>
                    <option value="net_15">Net 15</option>
                    <option value="net_30">Net 30</option>
                    <option value="net_60">Net 60</option>
                    <option value="net_90">Net 90</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`enabled-${index}`}
                        checked={method.enabled}
                        onChange={(e) => handleInputChange(index, 'enabled', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`enabled-${index}`}
                        className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Enabled
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`requires_reference-${index}`}
                        checked={method.requires_reference}
                        onChange={(e) => handleInputChange(index, 'requires_reference', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`requires_reference-${index}`}
                        className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Requires Reference
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`requires_authorization-${index}`}
                        checked={method.requires_authorization}
                        onChange={(e) => handleInputChange(index, 'requires_authorization', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`requires_authorization-${index}`}
                        className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Requires Authorization
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`test_mode-${index}`}
                        checked={method.test_mode}
                        onChange={(e) => handleInputChange(index, 'test_mode', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`test_mode-${index}`}
                        className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Test Mode
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
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

export default PaymentMethodsSettings; 