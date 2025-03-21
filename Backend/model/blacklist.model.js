import db from "../config/db.js"; // Your database connection

// Function to add an IP address to the blacklist
export const blockIP = (ipAddress) => {
    return new Promise((resolve, reject) => {
        // Check if the IP is already in the blacklist
        const checkQuery = "SELECT * FROM _blacklist WHERE ip_email = ? AND type = 'ip'";

        db.query(checkQuery, [ipAddress], (err, result) => {
            if (err) {
                console.error("❌ Error checking blocked IP:", err);
                return reject({ message: "Failed to check blocked IP" });
            }

            if (result.length > 0) {
                // If the IP is already blocked, reject the request
                return reject({ message: "IP address is already blocked" });
            }

            // Insert the IP into the blacklist table
            const insertQuery = "INSERT INTO _blacklist (ip_email, type) VALUES (?, 'ip')";
            db.query(insertQuery, [ipAddress], (err, result) => {
                if (err) {
                    console.error("❌ Error blocking IP:", err);
                    return reject({ message: "Failed to block IP" });
                }

                resolve({ success: true, message: `IP address ${ipAddress} blocked successfully` });
            });
        });
    });
};

// Function to check if an IP address is blocked
export const isIPBlocked = (ipAddress) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM _blacklist WHERE ip_email = ? AND type = 'ip'";

        db.query(query, [ipAddress], (err, result) => {
            if (err) {
                console.error("❌ Error checking IP:", err);
                return reject({ message: "Failed to check IP" });
            }

            // If result is empty, IP is not blocked
            if (result.length === 0) {
                resolve({ success: true, message: "IP is not blocked" });
            } else {
                resolve({ success: false, message: "IP is blocked" });
            }
        });
    });
};
