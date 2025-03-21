import { blockIP, isIPBlocked } from "../model/blacklist.model.js"; // Import model functions

// Controller to handle blocking an IP address
export const blockIPController = async (req, res) => {
    const { ipAddress } = req.body;  // IP address from the request body

    if (!ipAddress) {
        return res.status(400).json({ success: false, message: "IP address is required" });
    }

    try {
        // Call the model function to block the IP
        const result = await blockIP(ipAddress);
        return res.status(200).json(result);
    } catch (error) {
        console.error("❌ Error blocking IP:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to check if an IP address is blocked
export const checkBlockedIPController = async (req, res) => {
    const { ipAddress } = req.body;  // IP address from the request body

    if (!ipAddress) {
        return res.status(400).json({ success: false, message: "IP address is required" });
    }

    try {
        // Call the model function to check if the IP is blocked
        const result = await isIPBlocked(ipAddress);
        return res.status(200).json(result);
    } catch (error) {
        console.error("❌ Error checking IP:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
