import db from "../config/db.js"; // Import the centralized MySQL connection
import bcrypt from 'bcryptjs'; // Use bcryptjs
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {unserialize } from "php-serialize"; // ✅ Correct PHP serialization package

// ✅ **Compare Password function** - Comparing stored password (MD5 or bcrypt)
const comparePassword = (storedPassword, inputPassword) => {
    console.log("Comparing entered password:", inputPassword, "with stored password hash:", storedPassword);
    
    // If the stored password is MD5 (length 32)
    if (storedPassword.length === 32) {
        const md5Hash = crypto.createHash('md5').update(inputPassword).digest('hex');
        console.log("MD5 hash of entered password:", md5Hash);
        return storedPassword === md5Hash; // MD5 comparison
    } else {
        console.log("Performing bcrypt comparison...");
        return bcrypt.compare(inputPassword, storedPassword);  // bcrypt comparison (with bcryptjs)
    }
};

// Function to register a new user in the database
export const registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO _users (
                first_name, last_name, email, password, user_type, is_admin, role_id, 
                status, language, job_title, disable_login, note, address, alternative_address, 
                phone, alternative_phone, dob, ssn, gender, sticky_note, skype, enable_web_notification, 
                enable_email_notification, created_at, last_online, requested_account_removal, deleted, 
                vendor_id, expiry_date, device_details, is_logged_in, last_ip
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            userData.first_name || '', // first_name
            userData.last_name || '',  // last_name
            userData.email || '',      // email
            userData.password || '',   // password
            userData.user_type || 'client', // user_type
            userData.is_admin || 0,    // is_admin
            userData.role_id || 0,     // role_id
            userData.status || 'active',  // status
            userData.language || 'English', // language
            userData.job_title || 'Untitled', // job_title
            userData.disable_login || 0,   // disable_login
            userData.note || null,     // note
            userData.address || null,  // address
            userData.alternative_address || null, // alternative_address
            userData.phone || null,    // phone
            userData.alternative_phone || null,   // alternative_phone
            userData.dob || null,      // dob
            userData.ssn || null,      // ssn
            userData.gender || null,   // gender
            userData.sticky_note || null, // sticky_note
            userData.skype || null,    // skype
            userData.enable_web_notification || 1, // enable_web_notification
            userData.enable_email_notification || 1, // enable_email_notification
            userData.created_at || null,  // created_at (using NOW() in the query)
            userData.last_online || null, // last_online
            userData.requested_account_removal || 0,  // requested_account_removal
            userData.deleted || 0,         // deleted
            userData.vendor_id || null,    // vendor_id
            userData.expiry_date || null,  // expiry_date
            userData.device_details || null,  // device_details
            userData.is_logged_in || 0,    // is_logged_in
            userData.last_ip || null      // last_ip
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ Error registering user:", err);
                return reject(err);
            }

            resolve({
                success: true,
                data: {
                    id: result.insertId,
                    ...userData
                }
            });
        });
    });
};

// Function to fetch a user from the database by email (for login)
export const loginUser = (email, password) => {
    console.log("Received email:", email);
    console.log("Received password:", password); // Log received password to ensure it's coming correctly

    return new Promise((resolve, reject) => {
        const query = `
            SELECT id, email, password, status, role_id, is_admin
            FROM _users
            WHERE email = ? AND deleted = 0`; // Ensure user is not deleted

        db.query(query, [email], (err, result) => {
            if (err) {
                console.error("❌ Error fetching user:", err.message);
                return reject({ message: "Database error", error: err });
            }

            if (result.length === 0) {
                console.log("No user found with this email:", email);
                return reject({ message: "User not found or account disabled." });
            }

            const user = result[0];

            // Check if the user is active
            if (user.status !== "active") {
                console.log("User account is inactive:", user);
                return reject({ message: "User account is inactive. Please contact admin." });
            }

            // Log the stored password hash and comparison
            console.log("Stored password hash:", user.password);
            console.log("Entered password:", password);

            // Compare the entered password with stored password (MD5 or bcrypt)
            comparePassword(user.password, password)  // This calls the comparePassword function
                .then((isMatch) => {
                    console.log("Password match result:", isMatch);  // Log the comparison result

                    if (!isMatch) {
                        console.log("Password does not match.");
                        return reject({ message: "Invalid credentials" });
                    }

                    console.log("Password matched, generating token...");

                    // Password matched, generate JWT token
                    const payload = {
                        userId: user.id,
                        email: user.email,
                        role_id: user.role_id,
                        is_admin: user.is_admin
                    };

                    // Now resolving with the correct user data
                    resolve({
                        success: true,
                        message: 'Login successful',
                        userId: user.id, // We ensure user info is available
                        email: user.email,
                        role_id: user.role_id,
                        is_admin: user.is_admin
                    });
                })
                
                .catch((err) => {
                    console.error("Error during password comparison:", err);
                    reject({ message: "Error during password comparison", error: err });
                });
        });
    });
};

// // Function to update a user's profile in the database
// export const updateUserProfile = async (userId, email, password) => {
//     const updates = [];
//     const values = [];
//     let query = "UPDATE _users SET ";

//     // If email is provided, add to the update query
//     if (email) {
//         updates.push('email = ?');
//         values.push(email);
//     }

//     // If password is provided, hash it and add to the update query
//     if (password) {
//         updates.push('password = ?');
//         try {
//             const hashedPassword = await bcrypt.hash(password, 10);
//             values.push(hashedPassword); // Store hashed password
//         } catch (err) {
//             return { message: "Error hashing password", error: err }; // Return error if bcrypt fails
//         }
//     }

//     // If no fields are provided, reject the request
//     if (updates.length === 0) {
//         return { message: 'No fields to update' };
//     }

//     // Finalize the update query
//     query += updates.join(', ') + " WHERE id = ?";
//     values.push(userId);

//     // Execute the query
//     try {
//         const result = await db.query(query, values);
//         return result;
//     } catch (err) {
//         console.error("❌ Error updating user:", err);
//         return { message: "Database error", error: err };
//     }
// };

// Function to update a user's profile in the database
export const updateUserProfile = async (userId, email, password) => {
    try {
      // Validate email format (if provided)
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, message: "Invalid email format" };
      }
  
      // Hash password (if provided)
      let hashedPassword = null;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }
  
      // Update email (if provided)
      if (email) {
        const emailQuery = "UPDATE _users SET email = ? WHERE id = ?";
        await db.query(emailQuery, [email, userId]);
      }
  
      // Update password (if provided)
      if (hashedPassword) {
        const passwordQuery = "UPDATE _users SET password = ? WHERE id = ?";
        await db.query(passwordQuery, [hashedPassword, userId]);
      }
  
      return { success: true, message: "Profile updated successfully" };
    } catch (err) {
      console.error("❌ Error updating user:", err);
      return { success: false, message: "Database error", error: err };
    }
  };



  /**
   * ✅ Fetch user permissions based on their role (using same structure as `loginUser`)
   */
  export const getUserPermissions = (userId) => {
      console.log("🔍 Fetching permissions for user ID:", userId);
  
      return new Promise((resolve, reject) => {
          // ✅ Step 1: Get user's role ID from `_users` table
          const userQuery = "SELECT role_id FROM _users WHERE id = ?";
  
          db.query(userQuery, [userId], (err, userResult) => {
              if (err) {
                  console.error("❌ Error fetching user:", err.message);
                  return reject({ message: "Database error while fetching user", error: err });
              }
  
              if (userResult.length === 0) {
                  console.log("No user found with this ID:", userId);
                  return reject({ message: "User not found or has no assigned role." });
              }
  
              const roleId = userResult[0].role_id;
              console.log("✅ Step 1 Passed: User role ID:", roleId);
  
              if (!roleId || roleId === 0) {
                  console.error("❌ ERROR: User has no valid role assigned.");
                  return resolve([]); // Return an empty array (no permissions)
              }
  
              // ✅ Step 2: Fetch role permissions from `_roles` table
              const roleQuery = "SELECT permissions FROM _roles WHERE id = ?";
  
              db.query(roleQuery, [roleId], (err, roleResult) => {
                  if (err) {
                      console.error("❌ Error fetching role:", err.message);
                      return reject({ message: "Database error while fetching role", error: err });
                  }
  
                  if (roleResult.length === 0 || !roleResult[0].permissions) {
                      console.log("No permissions found for role ID:", roleId);
                      return resolve([]); // Return empty permissions if none are found
                  }
  
                  console.log("📝 Step 2 Passed: Raw permissions from DB:", roleResult[0].permissions);
  
                  // ✅ Step 3: Try to unserialize permissions
                  let permissions;
                  try {
                      permissions = unserialize(roleResult[0].permissions);
  
                      console.log("✅ Step 3 Passed: Unserialized permissions:", permissions);
  
                      if (!permissions || typeof permissions !== "object") {
                          console.error("❌ ERROR: Unserialized permissions returned an invalid value:", permissions);
                          return resolve([]); // Return empty permissions
                      }
                  } catch (error) {
                      console.error("❌ ERROR: Unserialization failed:", error);
                      return resolve([]); // Return empty permissions
                  }
  
                  // ✅ Step 4: Convert object keys to an array of allowed permissions
                  const permissionList = Object.keys(permissions).filter((key) => permissions[key] === "1");
  
                  console.log("✅ Step 4 Passed: Returning permissions as array:", permissionList);
                  return resolve(permissionList);
              });
          });
      });
  };
  