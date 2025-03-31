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
