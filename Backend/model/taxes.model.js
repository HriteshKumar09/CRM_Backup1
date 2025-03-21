import db from "../config/db.js";  // Import the database connection

// _taxes model
// Fetching taxes model
export const getTaxes = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT id, title, percentage FROM _taxes WHERE deleted = 0`; // Query to fetch non-deleted taxes

    db.query(query, (err, result) => {
      if (err) {
        console.error("❌ Error fetching taxes:", err);
        return reject(err); // Reject the promise if there is an error
      }

      resolve({
        success: true,  // Return success flag
        data: result    // Return the data from the query (list of taxes)
      });
    });
  });
};
