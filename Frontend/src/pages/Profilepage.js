import React, { useEffect, useState } from "react";
import api from "../Services/api.js";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Camera, Upload } from 'lucide-react';
import { useTheme } from "../contexts/ThemeContext.js";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook to navigate
  const location = useLocation(); // Get the current route

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");  // Get token from localStorage
      console.log("Token from Local Storage:", token);  // Log token for debugging

      if (!token) {
        setError("Unauthorized: Please log in.");
        setLoading(false);
        return;
      }

      try {
        // API call to get user profile data
        const response = await api.get("/auth/profile");
        console.log("API Response:", response);  // Log API response for debugging

        // Check if user data exists and update state
        if (response.data?.data) {  // Use response.data.data instead of response.data.user
          setUserData(response.data.data);  // Set user data correctly
        } else {
          setError("User data not found.");
        }
      } catch (err) {
        console.log("Error fetching data:", err);
        setError(err.response?.data?.message || "An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Redirect to General Info page if user is at /dashboard/profile
  useEffect(() => {
    if (location.pathname === "/dashboard/profile") {
      navigate("/dashboard/profile/general-info");
    }
  }, [location.pathname, navigate]);

  // Display loading spinner if data is loading
  if (loading) {
    return <div className="text-center text-gray-500 mt-10">Loading...</div>;
  }

  // Display error message if there's any error
  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  // Ensure user data exists before rendering
  if (!userData) {
    return <div className="text-center text-red-500 mt-10">No user data found.</div>;
  }

  // Display the user profile once data is loaded
  return (
    <div >
      <motion.div
        className="profile-card w-full max-w-full mx-auto bg-gradient-to-r from-blue-500 to-indigo-300 group hover:to-indigo-500 hover:from-blue-200 backdrop-blur-lg border border-white/80 rounded-xl p-8 flex flex-col items-center space-y-4 transition-all duration-300"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative group">
          <div className="relative h-28 w-28 rounded-full overflow-hidden bg-secondary">
            <img
              src={userData?.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full mb-6 border-4 border-white shadow-lg"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button className="text-white transform group-hover:scale-110 transition-transform duration-300">
                <Camera className="h-4 w-4" />
              </button>
            </div>
          </div>

          <motion.div
            className="absolute -bottom-2 -right-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              className="rounded-full h-8 w-8 bg-primary hover:bg-primary/90 transition-colors duration-200"
            >
              <Upload className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
        {/* Profile Name */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-semibold mb-2 text-white">{`${userData?.first_name} ${userData?.last_name}`}</h1>
          <span className="bg-purple-500 text-white hover:bg-purple-300 mt-2 rounded-md p-1">
            {userData?.job_title || "Job Title"}
          </span>
          {/* Profile Details */}
          <div className="mt-6 text-sm space-y-2 text-center">
            <p>
              <span className="font-semibold text-white">Email: </span>
              {userData?.email || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-white">Phone: </span>
              {userData?.phone || "N/A"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* status section*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-2">
        {/* Open Projects Card */}
        <motion.div
          className="stat-card bg-blue-500/30 hover:bg-blue-500/50 transition-colors duration-300 rounded-lg p-4 flex items-center justify-center flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.p
            className="text-4xl font-light text-center text-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {userData?.open_projects || 0}
          </motion.p>
          <p className="text-sm uppercase tracking-wider text-center text-muted-foreground mt-1">
            Open Projects
          </p>
        </motion.div>

        {/* Projects Completed Card */}
        <motion.div
          className="stat-card bg-green-500/30 hover:bg-green-500/50 transition-colors duration-300 rounded-lg p-4 flex items-center justify-center flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.p
            className="text-4xl font-light text-center text-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {userData?.projects_completed || 0}
          </motion.p>
          <p className="text-sm uppercase tracking-wider text-center text-muted-foreground mt-1">
            Projects Completed
          </p>
        </motion.div>

        {/* Total Hours Worked Card */}
        <motion.div
          className="stat-card bg-yellow-500/30 hover:bg-yellow-500/50 transition-colors duration-300 rounded-lg p-4 flex items-center justify-center flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.p
            className="text-4xl font-light text-center text-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {userData?.total_hours_worked || "0.00"}
          </motion.p>
          <p className="text-sm uppercase tracking-wider text-center text-muted-foreground mt-1">
            Total Hours Worked
          </p>
        </motion.div>

        {/* Total Project Hours Card */}
        <motion.div
          className="stat-card bg-red-500/30 hover:bg-red-500/50 transition-colors duration-300 rounded-lg p-4 flex items-center justify-center flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.p
            className="text-4xl font-light text-center text-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {userData?.total_project_hours || 0}
          </motion.p>
          <p className="text-sm uppercase tracking-wider text-center text-muted-foreground mt-1">
            Total Project Hours
          </p>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <div className="  to-indigo-100  shadow-lg mt-6 rounded-lg mx-4 p-4 dark:bg-gray-700 dark:text-white ">
        <nav className="flex justify-center space-x-2 text-sm font-medium ">
          {[
            { name: "Timeline", path: "timeline" },
            { name: "General Info", path: "general-info" },
            { name: "Social Links", path: "social-links" },
            { name: "Job Info", path: "job-info" },
            { name: "Account Settings", path: "account-settings" },
            { name: "My Preferences", path: "my-preferences" },
            { name: "Files", path: "files" },
            { name: "Time Cards", path: "time-cards" },
            { name: "Leave", path: "profileleave" },
          ].map((tab, index) => (
            <NavLink
              key={index}
              to={tab.path}
              className={({ isActive }) =>
                `px-6 py-2 font-medium transition rounded-md ${isActive
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : " border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600"
                }`
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <motion.div
        variants={itemVariants}
        className="profile-card"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <Outlet /> {/* Nested route content */}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProfilePage;