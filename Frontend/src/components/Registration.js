import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import robotImage from "../assets/robot.png";
import api from "../Services/api.js";
import { Link } from "react-router-dom";
import crmLogo from "../assets/img_file66f3f0d354e75_site_logo.png.png";

const Registration = () => {
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "organization",
    company_name: "",
  });

  const [error, setError] = useState(null); // Error state to handle error messages
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false); // Success pop-up visibility state

  // Clear form data on page refresh or new tab
  useEffect(() => {
    sessionStorage.clear(); // Clears sessionStorage when the page loads
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      type: "organization",
      company_name: "",
    }); // Reset the form
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    sessionStorage.setItem(e.target.name, e.target.value); // Store input temporarily
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/users/register", formData);
      setLoading(false);

      if (response.status === 201) {
        setSuccessMessage("");
        setShowPopup(true); // Show success pop-up

        setTimeout(() => {
          setShowPopup(false); // Hide the pop-up
          navigate("/"); // Redirect to the sign-in page
        }, 4000); // Show for 4 seconds before redirecting
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-indigo-800 rounded-full opacity-50 -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-800 rounded-full opacity-50 translate-x-1/2 translate-y-1/2"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />

      {/* Form Container */}
      <motion.div
        className="bg-indigo-900/80 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-4xl mx-4 flex overflow-hidden border border-indigo-800"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Left Column - Animated Robot Image */}
        <div className="w-1/2 flex items-center justify-center p-8  md:flex">
          <motion.img
            src={robotImage}
            alt="AI Assistant Robot"
            className="max-w-full max-h-full"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
        </div>

        {/* Right Column - Registration Form */}
        <div className="w-full md:w-1/2 bg-indigo-800/30 backdrop-blur-md p-8 flex flex-col justify-between">
          <div>
            {/* Header */}
            <motion.div
              className="flex justify-end mb-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img src={crmLogo} alt="CRM Logo" className="w-28 h-10 transition-opacity duration-300 " />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-center mb-2 text-white">Sign up</h2>
              <p className="text-center text-white mb-4">Create an account as a new client.</p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <input type="text" name="first_name" placeholder="First Name" className="w-full p-3 border border-gray-300 rounded-md" value={formData.first_name} onChange={handleChange} required />
                </motion.div>
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <input type="text" name="last_name" placeholder="Last Name" className="w-full p-3 border border-gray-300 rounded-md" value={formData.last_name} onChange={handleChange} required />
                </motion.div>
              </div>

              {/* Type Selection */}
              <motion.div
                className="flex gap-4 items-center"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label className="flex items-center text-white">
                  <input type="radio" name="type" value="organization" checked={formData.type === "organization"} onChange={handleChange} className="mr-2 " />
                  Organization
                </label>
                <label className="flex items-center text-white">
                  <input type="radio" name="type" value="individual" checked={formData.type === "individual"} onChange={handleChange} className="mr-2 " />
                  Individual
                </label>
              </motion.div>

              {/* Company Name (Only for Organization) */}
              {formData.type === "organization" && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <input type="text" name="company_name" placeholder="Company Name" className="w-full p-3 border border-gray-300 rounded-md" value={formData.company_name} onChange={handleChange} required />
                </motion.div>
              )}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <input type="email" name="email" placeholder="Email" className="w-full p-3 border border-gray-300 rounded-md" value={formData.email} onChange={handleChange} required />
              </motion.div>
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <input type="password" name="password" placeholder="Password" className="w-full p-3 border border-gray-300 rounded-md" value={formData.password} onChange={handleChange} required />
              </motion.div>
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <input type="password" name="confirmPassword" placeholder="Retype Password" className="w-full p-3 border border-gray-300 rounded-md" value={formData.confirmPassword} onChange={handleChange} required />
              </motion.div>

              {/* Submit Button */}
              <motion.button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-300" disabled={loading}>
                {loading ? "Registering..." : "Sign up"}
              </motion.button>
            </form>
          </div>

          {/* Sign Up Section */}
          <div className="mt-8 text-center text-white text-sm">
            <p className="text-center text-sm  mt-4">
              Already have an account? <Link to="/" className="text-blue-400 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Success Pop-up */}
      {showPopup && (
        <motion.div
          className="fixed top-5 right-5 transform translate-x-0 flex items-center justify-center bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h3 className="text-md font-semibold">{successMessage}</h3>
            <p>Your account has been created successfully. You will be redirected to the sign-in page.</p>
          </div>
        </motion.div>
      )}

      {/* Error Pop-up */}
      {error && (
        <motion.div
          className="fixed top-5 right-5 transform translate-x-0 flex items-center justify-center bg-red-500 text-white py-3 px-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h3 className="text-md font-semibold">{error}</h3>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Registration;