import React, { useState } from "react";

const MyPreferences = () => {
  const [preferences, setPreferences] = useState({
    notificationVolume: "Medium",
    webNotification: true,
    emailNotification: true,
    language: "English",
    hideMenusTopbar: false,
    disabledShortcuts: false,
    recentlyMeaning: "24 hours",
    snoozeLength: "10 minutes",
  });

  // Handle change for dropdowns and switches
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences({
      ...preferences,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission (Save button)
  const handleSave = () => {
    console.log("Preferences saved:", preferences);
    // Implement save logic (e.g., send data to an API or store it in the local storage)
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Preferences</h2>

        {/* Notification Sound Volume */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Notification Sound Volume</label>
          <select
            name="notificationVolume"
            value={preferences.notificationVolume}
            onChange={handleChange}
            className="mt-2 p-2 w-full bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Web Notification */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Enable Web Notification</label>
          <div className="mt-2">
            <input
              type="checkbox"
              name="webNotification"
              checked={preferences.webNotification}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Email Notification */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Enable Email Notification</label>
          <div className="mt-2">
            <input
              type="checkbox"
              name="emailNotification"
              checked={preferences.emailNotification}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Language</label>
          <select
            name="language"
            value={preferences.language}
            onChange={handleChange}
            className="mt-2 p-2 w-full bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
        </div>

        {/* Hide Menus from Topbar */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Hide Menus from Topbar</label>
          <div className="mt-2">
            <input
              type="checkbox"
              name="hideMenusTopbar"
              checked={preferences.hideMenusTopbar}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Disable Keyboard Shortcuts */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Disable Keyboard Shortcuts</label>
          <div className="mt-2">
            <input
              type="checkbox"
              name="disabledShortcuts"
              checked={preferences.disabledShortcuts}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Recently Meaning */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Recently Meaning</label>
          <select
            name="recentlyMeaning"
            value={preferences.recentlyMeaning}
            onChange={handleChange}
            className="mt-2 p-2 w-full bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="24 hours">Last 24 Hours</option>
            <option value="7 days">Last 7 Days</option>
            <option value="30 days">Last 30 Days</option>
          </select>
        </div>

        {/* Snooze Length */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Snooze Length</label>
          <select
            name="snoozeLength"
            value={preferences.snoozeLength}
            onChange={handleChange}
            className="mt-2 p-2 w-full bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="10 minutes">10 minutes</option>
            <option value="15 minutes">15 minutes</option>
            <option value="30 minutes">30 minutes</option>
          </select>
        </div>

        {/* Save Button */}
        <div className="mt-6 text-right">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPreferences;
