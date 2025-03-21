import Note from "../model/notes.model.js"; // Import Notes Model

/**
 * @desc Create a new note
 * @route POST /api/notes
 * @access Private (User ID is taken from JWT)
 */
export const createNote = async (req, res) => {
    try {
        const userId = req.user.id; // ✅ Get user ID from JWT
        const { title, description, project_id, client_id, labels, files } = req.body;

        // ✅ Validation: Title is required
        if (!title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        const newNote = await Note.createNote(userId, {
            title,
            description,
            project_id: project_id || null,
            client_id: client_id || null,
            labels: labels || null,
            files: files || null
        });

        return res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: newNote
        });
    } catch (error) {
        console.error("❌ Error creating note:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * @desc Get a specific note by ID (Only the owner can view)
 * @route GET /api/notes/:id
 * @access Private
 */
export const getNoteById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const note = await Note.getNoteById(userId, id);

        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        return res.status(200).json({ success: true, data: note });
    } catch (error) {
        console.error("❌ Error fetching note:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * @desc Get all notes for a user
 * @route GET /api/notes
 * @access Private (Only logged-in user)
 */
export const getUserNotes = async (req, res) => {
    try {
        const userId = req.user.id;

        const notes = await Note.getUserNotes(userId);

        return res.status(200).json({ success: true, data: notes });
    } catch (error) {
        console.error("❌ Error fetching user notes:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * @desc Update a note (Only the owner can update)
 * @route PUT /api/notes/:id
 * @access Private
 */
export const updateNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { title, description, project_id, client_id, labels, files } = req.body;

        // ✅ Ensure only provided fields are updated (null means "keep old value")
        const updateData = {
            title: title !== undefined ? title : null,
            description: description !== undefined ? description : null,
            project_id: project_id !== undefined ? project_id : null, // ✅ Keep previous value if not sent
            client_id: client_id !== undefined ? client_id : null,
            labels: labels !== undefined ? labels : null,
            files: files !== undefined ? files : null
        };

        // ✅ Check if the note exists before updating
        const existingNote = await Note.getNoteById(userId, id);
        if (!existingNote) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        const result = await Note.updateNote(userId, id, updateData);

        if (!result) {
            return res.status(404).json({ success: false, message: "Note not updated" });
        }

        return res.status(200).json({ success: true, message: "Note updated successfully" });
    } catch (error) {
        console.error("❌ Error updating note:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


/**
 * @desc Soft delete a note
 * @route DELETE /api/notes/:id
 * @access Private (Only the owner can delete)
 */
export const softDeleteNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const result = await Note.softDeleteNote(userId, id);

        if (!result) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        return res.status(200).json({ success: true, message: "Note deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting note:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
