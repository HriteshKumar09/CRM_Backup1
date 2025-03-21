import React, { useState, useEffect } from "react";
import api from "../../Services/api.js"; // Import the centralized API instance
import { ToastContainer, toast } from "react-toastify"; // Import toast notifications
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const AccountSettings = () => {
  const [email, setEmail] = useState(""); // Default to empty string
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [showRetypePassword, setShowRetypePassword] = useState(false); // Toggle retype password visibility
  const [passwordError, setPasswordError] = useState(""); // Temporary error message for password mismatch

  // Fetch user data (like email) from the server
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await api.get("/auth/profile");

      console.log("API Response:", response.data); // Debugging

      if (response.data.success) {
        setEmail(response.data.data.email); // Set email from response
      } else {
        toast.error("Failed to fetch user data.");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      toast.error("Error fetching user data.");
    }
  };

  const handleSave = async () => {
    if (password !== retypePassword) {
      setPasswordError("Passwords do not match.");
      setTimeout(() => setPasswordError(""), 3000); // Clear error message after 3 seconds
      return; // Stop execution here if passwords do not match
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await api.put("/users/update-profile", {
        email,
        password,
      });

      if (response.data.success) {
        toast.success("Account settings updated successfully!");
        setIsEditing(false);
        setPassword(""); // Clear the password field after update
        setRetypePassword(""); // Clear the retype password field
      } else {
        toast.error("Failed to update account settings.");
      }
    } catch (err) {
      console.error("Error updating account settings:", err);
      toast.error("Error updating account settings.");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "retypePassword") {
      setRetypePassword(value);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Account Settings</h2>

      <div className="space-y-6">
        {/* Email Field */}
        <div className="flex justify-between items-center py-4 px-6 bg-gray-50 border rounded-lg hover:bg-gray-100 transition-colors">
          <span className="text-lg font-semibold text-gray-700">Email:</span>
          {isEditing ? (
            <input
              type="email"
              value={email}
              onChange={handleInputChange}
              name="email"
              className="text-blue-600 border-b-2 border-gray-300 focus:outline-none"
              placeholder="Enter your email"
            />
          ) : (
            <span className="text-gray-600">{email}</span>
          )}
        </div>

        {/* Password Field */}
        <div className="flex justify-between items-center py-4 px-6 bg-gray-50 border rounded-lg hover:bg-gray-100 transition-colors">
          <span className="text-lg font-semibold text-gray-700">Password:</span>
          {isEditing ? (
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handleInputChange}
                name="password"
                className="text-blue-600 border-b-2 border-gray-300 focus:outline-none"
                placeholder="Enter your password"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          ) : (
            <span className="text-gray-600">******</span>
          )}
        </div>

        {/* Retype Password Field */}
        <div className="flex justify-between items-center py-4 px-6 bg-gray-50 border rounded-lg hover:bg-gray-100 transition-colors">
          <span className="text-lg font-semibold text-gray-700">Retype Password:</span>
          {isEditing ? (
            <div className="flex items-center">
              <input
                type={showRetypePassword ? "text" : "password"}
                value={retypePassword}
                onChange={handleInputChange}
                name="retypePassword"
                className="text-blue-600 border-b-2 border-gray-300 focus:outline-none"
                placeholder="Retype your password"
              />
              <button
                onClick={() => setShowRetypePassword(!showRetypePassword)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                {showRetypePassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          ) : (
            <span className="text-gray-600">******</span>
          )}
        </div>
      </div>

      {/* Password Mismatch Error */}
      {passwordError && (
        <div className="mt-4 text-red-600 font-semibold text-center">
          {passwordError}
        </div>
      )}

      {/* Save or Edit Button */}
      <div className="mt-6 text-center">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-600 text-white py-2 px-6 rounded-lg hover:bg-yellow-700 transition duration-200"
          >
            Edit
          </button>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AccountSettings;