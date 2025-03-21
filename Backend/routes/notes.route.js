import express from 'express';
import {
    createNote,
    getNoteById,
    getUserNotes,
    updateNote,
    softDeleteNote
} from "../controller/notes.controller.js"; // ✅ Fixed folder name to "controllers"
import { authenticate } from '../middleware/authenticate.js'; // ✅ Updated middleware name for clarity

const router = express.Router();

// 📝 Notes Routes (All Private - Require JWT Authentication)
router.get('/', authenticate, getUserNotes); // ✅ Fetch all notes for logged-in user
router.get('/:id', authenticate, getNoteById); // ✅ Fetch a single note (only if owned by the user)
router.post('/', authenticate, createNote); // ✅ Create a new note (user_id is auto-filled from JWT)
router.put('/:id', authenticate, updateNote); // ✅ Update a note (only if owned by the user)
router.delete('/:id', authenticate, softDeleteNote); // ✅ Soft delete a note (only if owned by the user)

export default router;
