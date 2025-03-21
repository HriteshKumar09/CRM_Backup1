import express from 'express';
import {
  addAnnouncement,
  fetchAnnouncements,
  fetchAnnouncementById,
  readAnnouncement,
  removeAnnouncement
} from '../controller/announcements.controller.js';

const router = express.Router();

// ✅ Create new announcement
router.post('/announcements', addAnnouncement);

// ✅ Get all announcements
router.get('/announcements', fetchAnnouncements);

// ✅ Get specific announcement by ID
router.get('/announcements/:id', fetchAnnouncementById);

// ✅ Mark announcement as read
router.put('/announcements/:id/read', readAnnouncement);

// ✅ Soft delete an announcement
router.delete('/announcements/:id', removeAnnouncement);

export default router;
