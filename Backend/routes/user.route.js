import express from "express"; // Import Express to create a router
import { 
    register, 
    login, 
    logout, 
    updateProfile, 
    refreshAccessToken
} from "../controller/user.controller.js"; // Import the controller functions

import { authenticate } from "../middleware/authenticate.js"; // Import authentication middleware

const router = express.Router(); // Create an Express router instance

// ✅ Public Routes (No authentication required)
router.post("/register", register); // Register a new user
router.post("/login", login); // Login and get access token
router.post("/logout", logout); // Logout user

// ✅ Protected Routes (Requires authentication)
router.put("/update-profile", authenticate, updateProfile); // Update user profile

// import express from "express";
// import { refreshAccessToken } from "../controllers/user.controller.js"; // Adjust if the controller path is different



// Refresh Token Route
router.post("/auth/refresh", refreshAccessToken);



// 🚀 Future Role-Based Access Control (RBAC) [For Admins Only]
// Uncomment & Modify when RBAC is implemented
// router.get("/:userId", authenticate, getUserDetailsController); // Get user details
// router.get("/", authenticate, getAllUsersController); // Get all users (Admin Access)
// router.put("/:userId", authenticate, updateUserController); // Update user details
// router.delete("/:userId", authenticate, deleteUserController); // Soft delete user

export default router; // Export the router
