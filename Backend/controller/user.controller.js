import { registerUser, loginUser, updateUserProfile } from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ✅ **Function to Generate Access Token (Short Expiry)**
const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.email, role_id: user.role_id, is_admin: user.is_admin },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES || "1h" } // Short expiry for security
    );
};

// ✅ **Function to Generate Refresh Token (Longer Expiry)**
const generateRefreshToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.email, role_id: user.role_id, is_admin: user.is_admin }, // Include role info
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d" } // Refresh token lasts 7 days
    );
};

// ✅ **User Registration**
export const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password, role_id = 0, is_admin = 0, ...rest } = req.body;

        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        // ✅ Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Capture User’s IP Address
        const userIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        // ✅ Capture Device Details
        const userDevice = req.get("User-Agent");

        // ✅ Capture Registration & Last Online Timestamp
        const createdAt = new Date();
        const lastOnline = new Date();

        // ✅ Ensure role_id is valid (Avoid passing undefined)
        const assignedRoleId = role_id ? role_id : 28; // Default role_id (28 for staff)

        // ✅ User Data Object
        const userData = {
            first_name,
            last_name,
            email,
            password: hashedPassword, // Hashed password
            role_id: assignedRoleId,
            is_admin,
            last_ip: userIP, // Store User IP
            device_details: userDevice, // Store Device Info
            created_at: createdAt, // Timestamp when registered
            last_online: lastOnline, // Set last_online initially as created_at
            is_logged_in: 1, // Mark as logged in after registration
            ...rest // Include other optional fields (phone, dob, etc.)
        };

        // ✅ Call the `registerUser` function from the Model
        const result = await registerUser(userData);

        res.status(201).json({
            message: "User registered successfully",
            userId: result.data.id
        });

    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Email already exists" });
        }
        console.error("❌ Registration Error:", err);
        res.status(500).json({ message: "Server error", error: err });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if both email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Call the loginUser function from the model to validate the credentials
        const userResponse = await loginUser(email, password);  // Wait for the loginUser function to complete
        console.log("Login response:", userResponse); // Debugging: log the response from loginUser

        // Check if the login was successful
        if (!userResponse.success) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log("User Data from DB:", userResponse);  // Correctly log userResponse

        // ✅ Generate Access Token (Short Expiry)
        const accessToken = jwt.sign(
        {
            userId: userResponse.userId,  // Make sure you're passing the correct user fields
            email: userResponse.email,
            role_id: userResponse.role_id,
            is_admin: userResponse.is_admin
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES || "6h" } // Short expiry for security
        );


        // ✅ **Generate Refresh Token (Longer Expiry)**
        const refreshToken = jwt.sign(
            { userId: userResponse.userId, email: userResponse.email },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d" }
        );

        // ✅ **Store Refresh Token in HTTP-Only Secure Cookie**
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",  // Use true in production for secure cookies
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
        });

        // Send the response with the generated tokens
        res.status(200).json({
            message: "Login successful",
            accessToken: accessToken,  // Send the access token
            user: { 
                id: userResponse.userId, 
                email: userResponse.email, 
                role_id: userResponse.role_id, 
                is_admin: userResponse.is_admin 
            }
        });

    } catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};




// ✅ **Refresh Token Controller**
export const refreshAccessToken = (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "Unauthorized, no refresh token" });
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: "Invalid refresh token" });

            // ✅ **Reissue a new access token**
            const accessToken = generateAccessToken(user);
            res.json({ accessToken });
        });

    } catch (err) {
        console.error("❌ Refresh Token Error:", err);
        res.status(500).json({ message: "Server error", error: err });
    }
};

// ✅ **User Logout**
export const logout = (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    res.status(200).json({ message: "Logout successful" });
};

// ✅ **Update User Profile**
// export const updateProfile = async (req, res) => {
//     const userId = req.user.id; // Extract user ID from token
//     const { email, password } = req.body;

//     try {
//         let hashedPassword = null;
//         if (password) {
//             hashedPassword = await bcrypt.hash(password, 10);
//         }

//         const result = await updateUserProfile(userId, email, hashedPassword);

//         if (result.affectedRows > 0) {
//             return res.status(200).json({ message: "Profile updated successfully" });
//         }

//         return res.status(400).json({ message: "Failed to update profile" });
//     } catch (err) {
//         console.error("Error updating profile:", err);
//         res.status(500).json({ message: "Database error", error: err.message });
//     }
// };

// ✅ **Update User Profile**
export const updateProfile = async (req, res) => {
  const userId = req.user.id; // Extract user ID from token
  const { email, password } = req.body;

  try {
    // Hash password (if provided)
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user profile
    const result = await updateUserProfile(userId, email, hashedPassword);

    if (result.success) {
      return res.status(200).json({ success: true, message: "Profile updated successfully" });
    } else {
      return res.status(400).json({ success: false, message: result.message });
    }
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ success: false, message: "Database error", error: err.message });
  }
};