import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import robotImage from "../assets/robot.png";
import api from "../Services/api.js";
import crmLogo from "../assets/img_file66f3f0d354e75_site_logo.png.png"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/users/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200 && response.data.accessToken) {
        setIsLoggingIn(true);
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
          window.location.reload();
        }, 500);
      } else {
        setError(response.data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  // Auto-hide error popup after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleNavigateToRegister = () => {
    navigate("/register"); // Navigate to the register page
  };
  const handleNavigateToRestPassword = () => {
    navigate("/ResetPasswordForm"); // Navigate to the register page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-900 relative overflow-hidden">
      {/* Error Popup */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="fixed top-5 right-5 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Login Card */}
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
            className="max-w-full max-h-96"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
        </div>

        {/* Right Column - Login Form */}
        <div className="w-full md:w-1/2 bg-indigo-800/30 backdrop-blur-md p-8 flex flex-col justify-between">
          <div>
            {/* Header */}
            <motion.div
              className="flex justify-end mb-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img src={crmLogo} alt="CRM Logo" className="w-28 h-16 transition-opacity duration-300 " />
            </motion.div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label htmlFor="Email" className="text-white">Email</label>
                <input
                  id="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or Username"
                  className="w-full p-3 rounded-md bg-white border border-transparent focus:ring focus:ring-blue-500"
                />
              </motion.div>

              {/* Password Field */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-white">Password</label>
                  <button
        type="button"
        className="text-blue-400 text-sm hover:underline bg-transparent border-none"
        onClick={handleNavigateToRestPassword}
        >
        Forgot Password?
        </button>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  className="w-full p-3 rounded-md bg-white border border-transparent focus:ring focus:ring-blue-500"
                />
              </motion.div>

              {/* Remember Me Checkbox */}
              <motion.div
                className="flex items-center space-x-2 mt-2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 border-white text-blue-500 focus:ring focus:ring-blue-500"
                />
                <label htmlFor="remember" className="text-white text-sm cursor-pointer">Remember Me</label>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full h-12 font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </motion.button>
            </form>
          </div>

          {/* Sign Up Section */}
          <div className="mt-8 text-center text-white text-sm">
          <p>New on our Platform? 
          
          {/*Create Account Button*/}
          <button
            type="button"
            className="text-blue-400 hover:underline bg-transparent border-none"
            onClick={handleNavigateToRegister}
          >
            Create an Account
          </button>
          </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;