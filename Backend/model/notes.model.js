import db from "../config/db.js"; // Import database connection

const Note = {
    // 📌 Create a new note (User ID taken from JWT)
    createNote: (userId, noteData) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO _notes (
                    created_by, user_id, created_at, title, description, project_id, client_id, labels, files
                ) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                userId, // ✅ created_by (Set from JWT)
                userId, // ✅ user_id (Set from JWT, same as created_by)
                noteData.title || "Untitled Note", // Default title
                noteData.description || "",
                noteData.project_id || 1,
                noteData.client_id || 1,
                noteData.labels || "",
                noteData.files || "" // Changed from null to empty string
            ];

            db.query(query, values, (err, result) => {
                if (err) {
                    console.error("❌ Error creating note:", err);
                    return reject(err);
                }

                resolve({
                    success: true,
                    data: {
                        id: result.insertId,
                        created_by: userId, // ✅ Ensure response contains user_id
                        user_id: userId,
                        ...noteData
                    }
                });
            });
        });
    },

    // 📌 Get a note by ID (Ensures only the owner can access)
    getNoteById: (userId, noteId) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM _notes WHERE id = ? AND created_by = ? AND deleted = 0`;

            db.query(query, [noteId, userId], (err, rows) => {
                if (err) {
                    console.error("❌ Error fetching note:", err);
                    return reject(err);
                }

                resolve(rows.length > 0 ? rows[0] : null);
            });
        });
    },

    // 📌 Fetch all notes for a user (Private Notes Only)
    getUserNotes: (userId) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM _notes WHERE created_by = ? AND deleted = 0 ORDER BY created_at DESC`;

            db.query(query, [userId], (err, rows) => {
                if (err) {
                    console.error("❌ Error fetching user notes:", err);
                    return reject(err);
                }

                resolve(rows);
            });
        });
    },

    updateNote: (userId, noteId, noteData) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE _notes 
                SET 
                    title = COALESCE(?, title), 
                    description = COALESCE(?, description), 
                    project_id = COALESCE(?, project_id), 
                    client_id = COALESCE(?, client_id), 
                    labels = COALESCE(?, labels), 
                    files = COALESCE(?, files)
                WHERE id = ? AND created_by = ? AND deleted = 0
            `;
    
            const values = [
                noteData.title !== undefined ? noteData.title : null, 
                noteData.description !== undefined ? noteData.description : null,
                noteData.project_id !== undefined ? noteData.project_id : null,
                noteData.client_id !== undefined ? noteData.client_id : null,
                noteData.labels !== undefined ? noteData.labels : "", // ✅ Default to empty string
                noteData.files !== undefined ? noteData.files : "",  // ✅ Default to empty string
                noteId, 
                userId
            ];
    
            db.query(query, values, (err, result) => {
                if (err) {
                    console.error("❌ Error updating note:", err);
                    return reject(err);
                }
    
                resolve(result.affectedRows ? { success: true, message: "Note updated successfully" } : null);
            });
        });
    },
    

    // 📌 Soft delete a note (Ensures only the owner can delete)
    softDeleteNote: (userId, noteId) => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE _notes SET deleted = 1 WHERE id = ? AND created_by = ?`;

            db.query(query, [noteId, userId], (err, result) => {
                if (err) {
                    console.error("❌ Error soft deleting note:", err);
                    return reject(err);
                }

                resolve(result.affectedRows ? { success: true, message: "Note deleted successfully" } : null);
            });
        });
    }
};

export default Note;
