import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  markAnnouncementAsRead,
  deleteAnnouncement
} from '../model/announcements.model.js';

// ✅ Create Announcement
export const addAnnouncement = async (req, res) => {
  try {
    const result = await createAnnouncement(req.body);
    res.status(201).json({ message: "Announcement created successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Announcements
export const fetchAnnouncements = async (req, res) => {
  try {
    const announcements = await getAllAnnouncements();
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Single Announcement
export const fetchAnnouncementById = async (req, res) => {
  try {
    const announcement = await getAnnouncementById(req.params.id);
    if (!announcement) return res.status(404).json({ message: "Announcement not found" });
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Mark Announcement as Read
export const readAnnouncement = async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await markAnnouncementAsRead(req.params.id, userId);
    res.json({ message: "Marked as read", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Announcement
export const removeAnnouncement = async (req, res) => {
  try {
    const result = await deleteAnnouncement(req.params.id);
    res.json({ message: "Announcement deleted", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
