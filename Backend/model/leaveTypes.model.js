import db from "../config/db.js";

// Get all leave types
export const getLeaveTypes = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, title, status, color, description 
      FROM _leave_types 
      WHERE deleted = 0 
      ORDER BY id ASC`;

    console.log('Executing query:', query); // Debug log

    db.query(query, (err, result) => {
      if (err) {
        console.error("❌ Error fetching leave types:", err);
        return reject(err);
      }
      console.log('Leave types fetched:', result); // Debug log
      resolve(result);
    });
  });
};

// Create a new leave type
export const createLeaveType = (data) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO _leave_types (title, status, color, description, deleted) 
      VALUES (?, ?, ?, ?, 0)`;

    const values = [
      data.title,
      data.status || 'active',
      data.color,
      data.description
    ];

    console.log('Creating leave type with values:', values); // Debug log

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("❌ Error creating leave type:", err);
        return reject(err);
      }

      // Fetch the newly created leave type
      const selectQuery = `
        SELECT id, title, status, color, description 
        FROM _leave_types 
        WHERE id = ?`;

      db.query(selectQuery, [result.insertId], (err, rows) => {
        if (err) {
          console.error("❌ Error fetching created leave type:", err);
          return reject(err);
        }
        console.log('Created leave type:', rows[0]); // Debug log
        resolve(rows[0]);
      });
    });
  });
};

// Update a leave type
export const updateLeaveType = (id, data) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE _leave_types 
      SET title = ?, 
          status = ?,
          color = ?,
          description = ?
      WHERE id = ? AND deleted = 0`;

    const values = [
      data.title,
      data.status || 'active',
      data.color,
      data.description,
      id
    ];

    console.log('Updating leave type with values:', values); // Debug log

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("❌ Error updating leave type:", err);
        return reject(err);
      }

      if (result.affectedRows === 0) {
        return reject(new Error('Leave type not found'));
      }

      // Fetch the updated leave type
      const selectQuery = `
        SELECT id, title, status, color, description 
        FROM _leave_types 
        WHERE id = ?`;

      db.query(selectQuery, [id], (err, rows) => {
        if (err) {
          console.error("❌ Error fetching updated leave type:", err);
          return reject(err);
        }
        console.log('Updated leave type:', rows[0]); // Debug log
        resolve(rows[0]);
      });
    });
  });
};

// Delete a leave type (soft delete)
export const deleteLeaveType = (id) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE _leave_types SET deleted = 1 WHERE id = ?`;

    console.log('Deleting leave type with ID:', id); // Debug log

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("❌ Error deleting leave type:", err);
        return reject(err);
      }

      if (result.affectedRows === 0) {
        return reject(new Error('Leave type not found'));
      }

      console.log('Leave type deleted successfully'); // Debug log
      resolve({ success: true });
    });
  });
}; 