import express from "express";
import {
    sendMessage,
    getMessageById,
    getUserMessages,
    markMessageAsRead,
    softDeleteMessage,
    deleteMessagePermanently,
    getConversation
} from "../controller/message.controller.js";

const router = express.Router();

/**
 * 📩 Send a message
 * @route POST /api/messages/send
 */
router.post("/send", sendMessage);


// ✅ Add conversation endpoint
router.get("/conversation", getConversation);

/**
 * 🔍 Get a specific message by ID
 * @route GET /api/messages/:id
 */
router.get("/:id", getMessageById);

/**
 * 📬 Get all messages for a specific user
 * @route GET /api/messages/user/:user_id
 */
router.get("/user/:user_id", getUserMessages);

/**
 * ✅ Mark a message as read
 * @route PUT /api/messages/:id/read
 */
router.put("/:id/read", markMessageAsRead);

/**
 * 🗑 Soft delete a message (hide for user)
 * @route PUT /api/messages/:id/soft-delete
 */
router.put("/:id/soft-delete", softDeleteMessage);




/**
 * 🚮 Permanently delete a message (if both users delete it)
 * @route DELETE /api/messages/:id
 */
router.delete("/:id", deleteMessagePermanently);

export default router;
