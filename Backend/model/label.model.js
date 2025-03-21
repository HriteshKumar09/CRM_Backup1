import db from "../config/db.js"; 

/**
 * 🔹 Fetch labels by context (For Users & Admins)
 * @param {string} context - The context of labels (e.g., "task", "event", "invoice").
 * @returns {Promise} - Resolves with label data.
 */
export const getLabelsByContext = (context) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM _labels WHERE context = ? AND deleted = 0 ORDER BY id DESC`;
      
     db.query(query, [context], (err, results) => {
        if (err) {
          console.error("Database Query Error:", err);
          return reject(err);
        }
        // Debugging
        resolve(results);
      });
    });
  };
  

/**
 * 🔹 Fetch all labels created by an admin (For Admins)
 * @param {number} adminId - The ID of the admin.
 * @returns {Promise} - Resolves with label data.
 */
export const getLabelsByAdmin = (adminId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM _labels WHERE user_id = ? AND deleted = 0 ORDER BY id DESC`;
    db.query(query, [adminId], (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

/**
 * 🔹 Create a new label (Admin Only)
 * @param {string} title - Label title.
 * @param {string} color - Label color (hex code or predefined name).
 * @param {string} context - The label context (task, event, etc.).
 * @param {number} adminId - The ID of the admin creating the label.
 * @returns {Promise} - Resolves with the new label ID.
 */
export const createLabel = (title, color, context, adminId) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO _labels (title, color, context, user_id) VALUES (?, ?, ?, ?)`;
    db.query(query, [title, color, context, adminId], (err, result) => {
      if (err) reject(err);
      resolve(result.insertId);
    });
  });
};

/**
 * 🔹 Update an existing label (Admin Only)
 * @param {number} id - Label ID to update.
 * @param {string} title - New label title.
 * @param {string} color - New label color.
 * @param {string} context - New label context.
 * @returns {Promise} - Resolves when update is successful.
 */
export const updateLabel = (id, title, color, context) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE _labels SET title = ?, color = ?, context = ? WHERE id = ?`;
    db.query(query, [title, color, context, id], (err, result) => {
      if (err || result.affectedRows === 0) reject("Label not found or not updated.");
      resolve("Label updated successfully.");
    });
  });
};

/**
 * 🔹 Soft delete a label (Admin Only)
 * @param {number} id - Label ID to delete.
 * @returns {Promise} - Resolves when deletion is successful.
 */
export const deleteLabel = (id) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE _labels SET deleted = 1 WHERE id = ?`;
    db.query(query, [id], (err, result) => {
      if (err || result.affectedRows === 0) reject("Label not found or already deleted.");
      resolve("Label deleted successfully.");
    });
  });
};
