// models/_announcements.js
import db from '../config/db.js'; // MySQL connection


// ✅ Create a new announcement
export const createAnnouncement = (announcementData) => {
  return new Promise((resolve, reject) => {
    const { title, description, start_date, end_date, created_by, share_with, files } = announcementData;
    const query = `
      INSERT INTO \`_announcements\` (title, description, start_date, end_date, created_by, share_with, created_at, files, read_by, deleted)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, '[]', 0)
    `;
    db.query(query, [title, description, start_date, end_date, created_by, JSON.stringify(share_with), JSON.stringify(files)], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// ✅ Get all active announcements
export const getAllAnnouncements = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM \`_announcements\` WHERE deleted = 0 ORDER BY created_at DESC`;
    db.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// ✅ Get a specific announcement by ID
export const getAnnouncementById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM \`_announcements\` WHERE id = ? AND deleted = 0`;
    db.query(query, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]); // Return a single announcement
    });
  });
};

// ✅ Mark an announcement as read
export const markAnnouncementAsRead = (id, userId) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE \`_announcements\` SET read_by = JSON_ARRAY_APPEND(read_by, '$', ?) WHERE id = ?`;
    db.query(query, [userId, id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// ✅ Soft delete an announcement
export const deleteAnnouncement = (id) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE \`_announcements\` SET deleted = 1 WHERE id = ?`;
    db.query(query, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
