import { deleteUser, getAllUsers, getUserDetailsById, updateUser, updateUserRole, getTeamMembersWithRoles } from "../model/userAuth.model.js";
import bcrypt from "bcrypt";
/* Profile Section */

// Get user profile by ID
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user?.id; // ✅ Extract user ID from decoded token

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID missing from token" });
        }

        const user = await getUserDetailsById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error(`Error fetching user profile for ID ${userId}:`, error);
        res.status(500).json({ success: false, message: "Failed to fetch user profile" });
    }
};

// Get user details by user ID
export const getUserDetailsController = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        if (isNaN(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        const user = await getUserDetailsById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        res.json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to fetch user details" });
    }
};

// Get all users
export const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json({ success: true, users });
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to fetch users" });
    }
};

// Update user details
// ✅ **Update user details securely (with password hashing)**
export const updateUserController = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        if (isNaN(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        // ✅ Check if user exists
        const existingUser = await getUserDetailsById(userId);
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        let userData = req.body;

        // ✅ **Hash password if it's provided**
        if (userData.password) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            userData.password = hashedPassword; // Replace plain password with hashed version
        }

        // ✅ Update user in the database
        const result = await updateUser(userId, userData);

        if (result.success) {
            res.json({ success: true, message: result.message });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to update user" });
    }
};

// Soft delete a user
export const deleteUserController = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        if (isNaN(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        const existingUser = await getUserDetailsById(userId);
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const result = await deleteUser(userId);
        if (result.affectedRows > 0) {
            res.json({ success: true, message: "User deleted successfully" });
        } else {
            res.status(400).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to delete user" });
    }
};

////////////////
// Update user role
///////////////

// Controller function to handle updating user role
export const updateUserRoleController = async (req, res) => {
    const { userId, roleId } = req.body;  // Extract userId and roleId from the request body

    console.log("Updating role for user ID:", userId);
    console.log("New Role ID:", roleId);
    // Validate the input data
    if (!userId || !roleId) {
        return res.status(400).json({ success: false, message: "User ID and Role ID are required" });
    }

    try {
        // Call the model function to update the user's role
        const result = await updateUserRole(userId, roleId);

        // Send a success response
        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        // Send an error response if something goes wrong
        console.error("Error in updating role:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get team members with roles
export const getTeamMembersController = async (req, res) => {
    try {
        const teamMembers = await getTeamMembersWithRoles();
        res.json({ 
            success: true, 
            users: teamMembers 
        });
    } catch (error) {
        console.error("Error fetching team members:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to fetch team members" 
        });
    }
};