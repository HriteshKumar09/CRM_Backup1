import express from "express";
import {
    getUserProfile,
    getUserDetailsController,
    getAllUsersController,
    updateUserController,
    deleteUserController,
    updateUserRoleController,
    getTeamMembersController
} from "../controller/userAuth.controller.js";

import { authenticate } from "../middleware/authenticate.js"; // Authentication Middleware
import { authorizeRoles } from "../middleware/authorizeRoles.js"; // Role-Based Middleware

const router = express.Router();

// ✅ Get team members with roles (this needs to be before /:userId route)
router.get("/team-members", authenticate, getTeamMembersController);

// ✅ Get logged-in user profile (Anyone logged in)
router.get("/profile", authenticate, getUserProfile);

// ✅ Get all users (Only Admins)
router.get("/", authenticate, authorizeRoles("admin","staff"), getAllUsersController);

// Route to update the user role
router.put("/update-role",authenticate, updateUserRoleController); // PUT method for updating role based on userId

// ✅ Get user details by ID (Admins → any user, Staff → only their profile)
router.get("/:userId", authenticate, authorizeRoles("admin", "staff"), getUserDetailsController);

// ✅ Update user details (Admins → any user, Staff → only their profile)
router.put("/:userId", authenticate, authorizeRoles("admin", "staff"), updateUserController);

// ✅ Soft delete user (Only Admins)
router.delete("/:userId", authenticate, authorizeRoles("admin"), deleteUserController);

export default router;
