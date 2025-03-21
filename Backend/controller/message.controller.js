import Message from "../model/message.model.js";

/**
 * @desc Send a new message
 * @route POST /api/messages/send
 */
export const sendMessage = async (req, res) => {
    try {
        const { subject, message, from_user_id, to_user_id, message_id, files } = req.body;

        // Validate required fields
        if (!from_user_id || !to_user_id || !message) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const newMessage = await Message.createMessage({
            subject,
            message,
            from_user_id,
            to_user_id,
            message_id: message_id || 0, // Default to 0 for new messages
            files: files || '',
            status: 'unread' // Default status
        });

        return res.status(201).json({ success: true, message: "Message sent successfully", data: newMessage });
    } catch (error) {
        console.error("❌ Error sending message:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

/**
 * @desc Get a specific message by ID
 * @route GET /api/messages/:id
 */
export const getMessageById = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await Message.getMessageById(id);

        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        return res.status(200).json({ success: true, data: message });
    } catch (error) {
        console.error("❌ Error fetching message:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

/**
 * @desc Get all messages for a user
 * @route GET /api/messages/user/:user_id
 */
export const getUserMessages = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const messages = await Message.getUserMessages(user_id);

        return res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error("❌ Error fetching user messages:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

/**
 * @desc Mark a message as read
 * @route PUT /api/messages/read/:id
 */
export const markMessageAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Message ID is required" });
        }

        await Message.markAsRead(id);

        return res.status(200).json({ success: true, message: "Message marked as read" });
    } catch (error) {
        console.error("❌ Error marking message as read:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

/**
 * @desc Soft delete a message
 * @route PUT /api/messages/delete/:id
 */
export const softDeleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id } = req.body;

        if (!id || !user_id) {
            return res.status(400).json({ success: false, message: "Message ID and User ID are required for deletion" });
        }
        
        await Message.softDeleteMessage(id, user_id);

        return res.status(200).json({ success: true, message: "Message soft deleted" });
    } catch (error) {
        console.error("❌ Error soft deleting message:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

/**
 * @desc Get full conversation between two users
 * @route GET /api/messages/conversation
 */
export const getConversation = async (req, res) => {
    try {
        const { user1, user2 } = req.query; // Get user IDs from request

        if (!user1 || !user2) {
            return res.status(400).json({ success: false, message: "Both user1 and user2 are required." });
        }

        const conversation = await Message.getConversation(user1, user2);

        return res.status(200).json({ success: true, messages: conversation });
    } catch (error) {
        console.error("❌ Error fetching conversation:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/**
 * @desc Permanently delete a message
 * @route DELETE /api/messages/delete/:id
 */
export const deleteMessagePermanently = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Message ID is required for deletion" });
        }

        await Message.deleteMessagePermanently(id);

        return res.status(200).json({ success: true, message: "Message permanently deleted" });
    } catch (error) {
        console.error("❌ Error permanently deleting message:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
