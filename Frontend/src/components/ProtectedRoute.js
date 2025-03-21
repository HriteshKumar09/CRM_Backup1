// components/ProtectedRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode directly

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token"); // Get the token from storage

  // Decode the token to get the user's role_id
  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const user = decodeToken(token);
  const roleId = user?.role_id; // Extract role_id from the token

  // Check if the user has the required role
  if (!allowedRoles.includes(roleId)) {
    return <Navigate to="/dashboard" />; // Redirect to dashboard or a 403 page
  }

  return <Outlet />; // Render the child routes if the user has access
};

export default ProtectedRoute;