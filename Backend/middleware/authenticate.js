import jwt from "jsonwebtoken";
import db from "../config/db.js"; 

export const authenticate = (req, res, next) => {
    try {
        // ✅ Extract the access token from the Authorization header
        let token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            console.log("❌ No access token found.");
            return res.status(401).json({ success: false, message: "No token, authorization denied" });
        }

        console.log("🔍 Extracted Token:", token);
        console.log("🔐 Expected Secret Key:", process.env.JWT_SECRET);

        // ✅ Verify the access token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log("❌ Token Verification Failed:", err.message);
                
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ success: false, message: "Access token expired. Please refresh your token." });
                }
                return res.status(401).json({ success: false, message: "Invalid token" });
            }

             // ✅ Extract user details (INCLUDING `role_id`) from the database
             const query = "SELECT id, email, role_id, is_admin FROM _users WHERE id = ?";
             db.query(query, [decoded.userId], (dbErr, results) => {
                 if (dbErr) {
                     console.error("❌ Database Query Error:", dbErr);
                     return res.status(500).json({ success: false, message: "Database error" });
                 }
                 if (results.length === 0) {
                     return res.status(401).json({ success: false, message: "User not found" });
                 }
 
                 // ✅ Attach user info to `req.user`
                 req.user = {
                     id: results[0].id,
                     email: results[0].email,
                     roleId: results[0].role_id,
                     isAdmin: results[0].is_admin
                 };
 
                 console.log("✅ Token Verified, User:", req.user);
                 next(); // ✅ Proceed to the next middleware or route handler
             });
         });

    } catch (error) {
        console.error("⚠️ Authorization error:", error.message);
        res.status(401).json({ success: false, message: "Authorization error" });
    }
};
