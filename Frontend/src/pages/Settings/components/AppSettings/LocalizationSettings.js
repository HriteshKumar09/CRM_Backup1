import React, { useState, useEffect } from 'react';
import api from '../../../../Services/api';
import { toast } from 'react-toastify';

const LocalizationSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    language: 'english',
    timezone: 'Asia/Kolkata',
    date_format: 'Y-m-d',
    time_format: 'small',
    first_day_of_week: '0',
    weekends: '',
    default_currency: 'INR',
    currency_symbol: '₹',
    currency_position: 'left',
    decimal_separator: '.',
    no_of_decimals: '2',
    conversion_rate: {}
  });

  const [conversionRates, setConversionRates] = useState([
    { currency: 'INR', rate: '' }
  ]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/localization');
      if (response.data.success) {
        const settings = response.data.data;
        setFormData(prev => ({
          ...prev,
          ...settings
        }));

        // Parse conversion rates if they exist
        if (settings.conversion_rate) {
          const rates = typeof settings.conversion_rate === 'string' 
            ? JSON.parse(settings.conversion_rate)
            : settings.conversion_rate;
          
          setConversionRates(
            Object.entries(rates).map(([currency, rate]) => ({
              currency,
              rate: rate.toString()
            }))
          );
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConversionRateChange = (index, field, value) => {
    const newRates = [...conversionRates];
    newRates[index] = {
      ...newRates[index],
      [field]: value
    };
    setConversionRates(newRates);
  };

  const handleAddMore = () => {
    setConversionRates([...conversionRates, { currency: '', rate: '' }]);
  };

  const handleRemoveRate = (index) => {
    setConversionRates(conversionRates.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Convert conversion rates array to object
      const ratesObject = conversionRates.reduce((acc, { currency, rate }) => {
        if (currency && rate) {
          acc[currency] = parseFloat(rate);  // Convert rate to number
        }
        return acc;
      }, {});

      // Prepare data to match backend expectations
      const dataToSubmit = {
        language: formData.language,
        timezone: formData.timezone,
        date_format: formData.date_format,
        time_format: formData.time_format,
        first_day_of_week: formData.first_day_of_week,
        weekends: formData.weekends,
        default_currency: formData.default_currency,
        currency_symbol: formData.currency_symbol,
        currency_position: formData.currency_position.toLowerCase(),
        decimal_separator: formData.decimal_separator,
        no_of_decimals: formData.no_of_decimals,
        conversion_rate: JSON.stringify(ratesObject)  // Convert to JSON string
      };

      const response = await api.post('/settings/localization', dataToSubmit);
      
      if (response.data.success) {
        toast.success('Settings saved successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Refresh settings after successful update
        await fetchSettings();
      } else {
        throw new Error(response.data.message || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error(error.response?.data?.message || 'Failed to update settings. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-6">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Localization Settings</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timezone
            </label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
            </select>
          </div>

          {/* Date Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Format
            </label>
            <select
              name="date_format"
              value={formData.date_format}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Y-m-d">Y-m-d</option>
              <option value="d-m-Y">d-m-Y</option>
              <option value="m-d-Y">m-d-Y</option>
            </select>
          </div>

          {/* Time Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Format
            </label>
            <select
              name="time_format"
              value={formData.time_format}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="small">12 Hour</option>
              <option value="large">24 Hour</option>
            </select>
          </div>

          {/* First Day of Week */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              First Day of Week
            </label>
            <select
              name="first_day_of_week"
              value={formData.first_day_of_week}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
            </select>
          </div>

          {/* Weekends */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Weekends
            </label>
            <select
              name="weekends"
              value={formData.weekends}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Weekends</option>
              <option value="saturday,sunday">Saturday, Sunday</option>
              <option value="friday,saturday">Friday, Saturday</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>
            <select
              name="default_currency"
              value={formData.default_currency}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          {/* Currency Symbol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency Symbol
            </label>
            <input
              type="text"
              name="currency_symbol"
              value={formData.currency_symbol}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Currency Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency Position
            </label>
            <select
              name="currency_position"
              value={formData.currency_position}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>

          {/* Decimal Separator */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Decimal Separator
            </label>
            <select
              name="decimal_separator"
              value={formData.decimal_separator}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value=".">Dot (.)</option>
              <option value=",">Comma (,)</option>
            </select>
          </div>

          {/* Number of Decimals */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Decimals
            </label>
            <select
              name="no_of_decimals"
              value={formData.no_of_decimals}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

          {/* Conversion Rates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Conversion Rates
            </label>
            {conversionRates.map((rate, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <select
                  value={rate.currency}
                  onChange={(e) => handleConversionRateChange(index, 'currency', e.target.value)}
                  className="mt-1 block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Currency</option>
                  <option value="AED">AED</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                <input
                  type="text"
                  value={rate.rate}
                  onChange={(e) => handleConversionRateChange(index, 'rate', e.target.value)}
                  placeholder="Conversion rate"
                  className="mt-1 block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRate(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddMore}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Add more
            </button>
          </div>

          {/* Save Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocalizationSettings; 