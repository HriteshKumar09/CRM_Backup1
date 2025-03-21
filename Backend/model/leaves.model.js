import db from "../config/db.js";

// Get all leave requests
export const getAllLeaves = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM leaves";
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Update leave request (approve/reject/pending)
export const updateLeaveStatus = (id, status) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE leaves SET status = ? WHERE id = ?";
    db.query(query, [status, id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Create a new leave request
export const createLeaveRequest = (applicant, leave_type, date, duration, status) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO leaves (applicant, leave_type, date, duration, status) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [applicant, leave_type, date, duration, status], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
