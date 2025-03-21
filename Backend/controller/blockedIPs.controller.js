import { getBlockedIPs, removeFromBlacklist } from "../model/blockedIPs.model.js";

// Controller to get all blocked IPs
export const getBlockedIPsController = async (req, res) => {
    try {
        const result = await getBlockedIPs();
        return res.status(200).json(result);
    } catch (error) {
        console.error("❌ Error in getBlockedIPsController:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to remove IP from blacklist
export const removeFromBlacklistController = async (req, res) => {
    const { ipAddress } = req.params;

    if (!ipAddress) {
        return res.status(400).json({ success: false, message: "IP address is required" });
    }

    try {
        const result = await removeFromBlacklist(ipAddress);
        return res.status(200).json(result);
    } catch (error) {
        console.error("❌ Error in removeFromBlacklistController:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}; 