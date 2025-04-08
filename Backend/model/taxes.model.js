import db from "../config/db.js";  // Import the database connection

// _taxes model
// Fetching taxes model
export const getTaxes = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT id, title, percentage, stripe_tax_id FROM _taxes WHERE deleted = 0 ORDER BY id DESC`;

    db.query(query, (err, result) => {
      if (err) {
        console.error("❌ Error fetching taxes:", err);
        return reject(err);
      }

      resolve(result); // Return just the result array
    });
  });
};

// Creating a new tax
export const createTax = ({ title, percentage }) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO _taxes (title, percentage, deleted, stripe_tax_id) VALUES (?, ?, 0, '')`;
    
    db.query(query, [title, percentage], (err, result) => {
      if (err) {
        console.error("❌ Error creating tax:", err);
        return reject(err);
      }

      // Fetch the newly created tax
      const selectQuery = `SELECT id, title, percentage, stripe_tax_id FROM _taxes WHERE id = ?`;
      db.query(selectQuery, [result.insertId], (err, rows) => {
        if (err) {
          console.error("❌ Error fetching created tax:", err);
          return reject(err);
        }

        resolve(rows[0]); // Return just the created tax object
      });
    });
  });
};

// Update an existing tax
export const updateTax = ({ id, title, percentage }) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE _taxes SET title = ?, percentage = ? WHERE id = ? AND deleted = 0`;
    
    db.query(query, [title, percentage, id], (err, result) => {
      if (err) {
        console.error("❌ Error updating tax:", err);
        return reject(err);
      }

      if (result.affectedRows === 0) {
        return reject(new Error("Tax not found or already deleted"));
      }

      // Fetch the updated tax
      const selectQuery = `SELECT id, title, percentage, stripe_tax_id FROM _taxes WHERE id = ?`;
      db.query(selectQuery, [id], (err, rows) => {
        if (err) {
          console.error("❌ Error fetching updated tax:", err);
          return reject(err);
        }

        resolve(rows[0]); // Return the updated tax object
      });
    });
  });
};

// Delete a tax (soft delete)
export const deleteTax = (id) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE _taxes SET deleted = 1 WHERE id = ? AND deleted = 0`;
    
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("❌ Error deleting tax:", err);
        return reject(err);
      }

      if (result.affectedRows === 0) {
        return reject(new Error("Tax not found or already deleted"));
      }

      resolve({ success: true, message: "Tax deleted successfully" });
    });
  });
};
