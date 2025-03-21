import db from "../config/db.js"; // Import the centralized MySQL connection


// Function to fetch user details by user ID
export const getUserDetailsById = (id) => {
    // console.log("🔍 Searching for user with ID:", userId, "Type:", typeof userId);
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM _users WHERE id = ?';
        //const query = `SELECT id, first_name, last_name, email, job_title, phone FROM _users WHERE id = ?`;
        
        db.query(query, [id], (err, result) => {
            if (err) {
                console.error("Error fetching user details:", err.message);
                reject(err); // Reject the promise if there's an error
            } else if (result.length === 0) {
                reject(new Error("User not found")); // Reject if user does not exist
            } else {
                resolve(result[0]); // Resolve with the user details
            }
        });
    });
  };

 
// Function to fetch all users
  export const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const query = "SELECT id, first_name, last_name, email, user_type, job_title, status FROM _users WHERE deleted = 0";
        
        db.query(query, (err, result) => {
            if (err) {
                console.error("Error fetching users:", err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
  };
  

export const updateUser = (userId, userData) => {
    return new Promise((resolve, reject) => {
        // First, fetch the existing user data
        const selectQuery = "SELECT * FROM _users WHERE id = ?";
        db.query(selectQuery, [userId], (err, existingUser) => {
            if (err) {
                console.error("❌ Error fetching existing user data:", err);
                return reject(err);
            }

            if (existingUser.length === 0) {
                return reject({ message: "User not found" });
            }

            const user = existingUser[0]; // Extract user data

            // Prepare update values - Use provided data or retain old values
            const updates = [];
            const values = [];

            // Define all fields that can be updated
            const fields = [
                "first_name",
                "last_name",
                "user_type",
                "email",
                "password",
                "status",
                "language",
                "image",
                "message_checked_at",
                "client_id",
                "notification_checked_at",
                "is_primary_contact",
                "job_title",
                "disable_login",
                "note",
                "address",
                "alternative_address",
                "phone",
                "alternative_phone",
                "dob",
                "ssn",
                "gender",
                "sticky_note",
                "skype",
                "enable_web_notification",
                "enable_email_notification",
                "created_at",
                "last_online",
                "requested_account_removal",
                "deleted",
                "vendor_id",
                "expiry_date",
                "device_details",
                "is_logged_in",
                "last_ip",
            ];

            // Loop through all fields and prepare updates
            fields.forEach((field) => {
                if (userData[field] !== undefined) {
                    // If the field is provided in userData, use it
                    let value = userData[field];

                    // Format the date of birth (dob) to YYYY-MM-DD
                    if (field === "dob" && value) {
                        value = new Date(value).toISOString().split("T")[0]; // Convert to YYYY-MM-DD
                    }

                    // Format DATETIME fields (created_at, last_online) to YYYY-MM-DD HH:MM:SS
                    if ((field === "created_at" || field === "last_online") && value) {
                        value = new Date(value).toISOString().slice(0, 19).replace("T", " "); // Convert to YYYY-MM-DD HH:MM:SS
                    }

                    updates.push(`${field} = ?`);
                    values.push(value);
                } else {
                    // If the field is not provided, retain the old value
                    updates.push(`${field} = ?`);
                    values.push(user[field]);
                }
            });

            // If no updates, return error
            if (updates.length === 0) {
                return reject({ message: "No valid fields to update." });
            }

            // Construct dynamic update query
            const updateQuery = `UPDATE _users SET ${updates.join(", ")} WHERE id = ?`;
            values.push(userId); // Add user ID at the end

            // Execute the update query
            db.query(updateQuery, values, (err, result) => {
                if (err) {
                    console.error("❌ Error updating user:", err);
                    return reject(err);
                }

                resolve({
                    success: true,
                    affectedRows: result.affectedRows,
                    message: result.affectedRows > 0 ? "User updated successfully." : "No changes made."
                });
            });
        });
    });
};



  
// Function to delete a user (soft delete)
  export const deleteUser = (userId) => {
    return new Promise((resolve, reject) => {
        const query = "UPDATE _users SET deleted = 1 WHERE id = ?";
        
        db.query(query, [userId], (err, result) => {
            if (err) {
                console.error("Error deleting user:", err);
                reject(err);
            } else {
                resolve({
                    success: true,
                    affectedRows: result.affectedRows
                });
            }
        });
    });
  };
       

// Function to update only the user's role
export const updateUserRole = (userId, roleId) => {
    return new Promise((resolve, reject) => {
        // Prepare the query to update only the role_id field
        const query = "UPDATE _users SET role_id = ? WHERE id = ?";

        db.query(query, [roleId, userId], (err, result) => {
            if (err) {
                console.error("Error updating user role:", err);
                return reject(err); // Reject the promise if there's an error
            }

            // If no rows are affected, user may not exist
            if (result.affectedRows === 0) {
                return reject({ message: "User not found" });
            }
            
            // Resolve with success message
            resolve({
                success: true,
                affectedRows: result.affectedRows,
                message: "User role updated successfully"
            });
        });
    });
};

// Function to fetch team members with their roles
export const getTeamMembersWithRoles = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT u.id, u.first_name, u.last_name, u.email, u.status, u.role_id,
                   r.title as role_title
            FROM _users u
            LEFT JOIN _roles r ON u.role_id = r.id
            WHERE u.deleted = 0
            ORDER BY u.first_name, u.last_name
        `;
        
        db.query(query, (err, result) => {
            if (err) {
                console.error("Error fetching team members:", err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};