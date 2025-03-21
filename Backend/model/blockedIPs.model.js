import db from "../config/db.js";

// Function to get all blocked IPs
export const getBlockedIPs = () => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM _blacklist WHERE type = 'ip'";

        db.query(query, (err, result) => {
            if (err) {
                console.error("❌ Error fetching blocked IPs:", err);
                return reject({ message: "Failed to fetch blocked IPs" });
            }

            resolve({ success: true, data: result });
        });
    });
};

// Function to remove IP from blacklist
export const removeFromBlacklist = (ipAddress) => {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM _blacklist WHERE ip_email = ? AND type = 'ip'";

        db.query(query, [ipAddress], (err, result) => {
            if (err) {
                console.error("❌ Error removing IP from blacklist:", err);
                return reject({ message: "Failed to remove IP from blacklist" });
            }

            if (result.affectedRows === 0) {
                return reject({ message: "IP not found in blacklist" });
            }

            resolve({ success: true, message: `IP ${ipAddress} removed from blacklist successfully` });
        });
    });
}; 