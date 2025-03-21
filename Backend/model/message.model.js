import db from "../config/db.js"; // Import database connection

const Message = {
    // 📩 Create a new message
    createMessage: (messageData) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO _messages (
                    subject, message, from_user_id, to_user_id, created_at, message_id, status, files, deleted_by_users
                ) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?)
            `;

            const values = [
                messageData.subject || 'Untitled', // Default subject
                messageData.message || '', // Message content
                messageData.from_user_id, // Sender ID
                messageData.to_user_id, // Receiver ID
                messageData.message_id || 0, // Default to 0 if it's a new message thread
                messageData.status || 'unread', // Default status
                messageData.files || '', // Store file details (if any)
                JSON.stringify([]) // Default empty array for deleted_by_users
            ];

            db.query(query, values, (err, result) => {
                if (err) {
                    console.error("❌ Error sending message:", err);
                    return reject(err);
                }

                resolve({
                    success: true,
                    data: {
                        id: result.insertId,
                        ...messageData
                    }
                });
            });
        });
    },

    // 📥 Get a message by ID
    getMessageById: (message_id) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT m.*, 
                    sender.first_name AS sender_name, sender.email AS sender_email,
                    receiver.first_name AS receiver_name, receiver.email AS receiver_email
                FROM _messages m
                JOIN _users sender ON m.from_user_id = sender.id
                JOIN _users receiver ON m.to_user_id = receiver.id
                WHERE m.id = ?
            `;

            db.query(query, [message_id], (err, rows) => {
                if (err) {
                    console.error("❌ Error fetching message:", err);
                    return reject(err);
                }

                resolve(rows[0] || null);
            });
        });
    },

    // 📬 Fetch all messages for a user
    getUserMessages: (user_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT m.*, 
                sender.first_name AS sender_name, sender.email AS sender_email,
                receiver.first_name AS receiver_name, receiver.email AS receiver_email
            FROM _messages m
            JOIN _users sender ON m.from_user_id = sender.id
            JOIN _users receiver ON m.to_user_id = receiver.id
            WHERE (m.from_user_id = ? OR m.to_user_id = ?)
            AND (m.deleted_by_users IS NULL OR m.deleted_by_users = '' OR NOT JSON_CONTAINS(m.deleted_by_users, ?))
            ORDER BY m.created_at DESC
        `;

        db.query(query, [user_id, user_id, JSON.stringify(user_id)], (err, rows) => {
            if (err) {
                console.error("❌ Error fetching messages:", err);
                return reject(err);
            }

            resolve(rows);
        });
    });
    },


    // ✅ Mark a message as read
    markAsRead: (message_id) => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE _messages SET status = 'read' WHERE id = ?`;

            db.query(query, [message_id], (err, result) => {
                if (err) {
                    console.error("❌ Error marking message as read:", err);
                    return reject(err);
                }

                resolve({ success: true });
            });
        });
    },

    // 🗑 Soft delete a message (hide for user)
    softDeleteMessage: (message_id, user_id) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE _messages 
                SET deleted_by_users = JSON_ARRAY_APPEND(deleted_by_users, '$', ?) 
                WHERE id = ?
            `;

            db.query(query, [user_id, message_id], (err, result) => {
                if (err) {
                    console.error("❌ Error soft deleting message:", err);
                    return reject(err);
                }

                resolve({ success: true });
            });
        });
    },
    
    // ✅ Fetch conversation between two users
    getConversation: (user1, user2) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM _messages
            WHERE (from_user_id = ? AND to_user_id = ?) 
            OR (from_user_id = ? AND to_user_id = ?)
            ORDER BY created_at ASC
        `;

        db.query(query, [user1, user2, user2, user1], (err, rows) => {
            if (err) {
                console.error("❌ Error fetching conversation:", err);
                return reject(err);
            }
                resolve(rows);
            });
        });
    },


    // 🚮 Permanently delete a message (only if both sender & receiver deleted it)
    deleteMessagePermanently: (message_id) => {
        return new Promise((resolve, reject) => {
            const query = `
                DELETE FROM _messages 
                WHERE id = ? 
                AND JSON_LENGTH(deleted_by_users) >= 2
            `;

            db.query(query, [message_id], (err, result) => {
                if (err) {
                    console.error("❌ Error deleting message permanently:", err);
                    return reject(err);
                }

                resolve({ success: true });
            });
        });
    }
};

export default Message;
