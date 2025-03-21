import db from '../config/db.js'; // Import the database connection

//  {/*TIme-Cards Model */}
// Function to create new attendance record (for clocking in)
//  Function to create attendance record (for clocking in)
export const createAttendance = async (userId, status = 'incomplete', inTime, note = null) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO _attendance (user_id, status, in_time, note) 
                   VALUES (?, ?, ?, ?)`;

    db.query(query, [userId, status, inTime, note], (err, result) => {
      if (err) {
        console.error('Error creating attendance record:', err.message);
        return reject(new Error('Failed to create attendance record: ' + err.message));
      }
      resolve(result.insertId);  // Return the inserted record ID
    });
  });
};



// // // Function to get attendance records by user ID (fetching clock-in and clock-out times)
export const getAttendanceByUserId = async (userId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM _attendance WHERE user_id = ? AND deleted = 0 ORDER BY in_time DESC`;

    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching attendance records:', err.message);
        return reject(new Error('Failed to fetch attendance records: ' + err.message));
      }
      if (results.length === 0) {
        return reject(new Error(`No attendance records found for user ID: ${userId}`));
      }
      resolve(results);  // Return the list of attendance records for the user
    });
  });
};



// // // Function to update attendance record (clock-out, add notes, etc.)
export const updateAttendance = async (attendanceId, updatedFields) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE _attendance SET 
                    out_time = ?, note = ?, status = ?, checked_by = ?, checked_at = ?
                    WHERE id = ? AND deleted = 0`;

    db.query(query, [
      updatedFields.out_time, updatedFields.note, updatedFields.status,
      updatedFields.checked_by, updatedFields.checked_at, attendanceId
    ], (err, result) => {
      if (err) {
        console.error('Error updating attendance record:', err.message);
        return reject(new Error('Failed to update attendance record: ' + err.message));
      }
      resolve(result.affectedRows);  // Return the number of affected rows
    });
  });
};

// // Function to add a note to an attendance record (e.g., when a staff forgets to clock out)
export const addNoteToAttendance = async (attendanceId, note) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE _attendance SET note = ? WHERE id = ? AND deleted = 0`;

    db.query(query, [note, attendanceId], (err, result) => {
      if (err) {
        console.error('Error adding note to attendance:', err.message);
        return reject(new Error('Failed to add note to attendance: ' + err.message));
      }
      resolve(result.affectedRows);  // Return the number of affected rows
    });
  });
};


// // Function to delete attendance record (soft delete)
export const deleteAttendance = async (attendanceId, adminId) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE _attendance SET deleted = 1, checked_by = ?, checked_at = NOW()
                   WHERE id = ? AND deleted = 0`;

    db.query(query, [adminId, attendanceId], (err, result) => {
      if (err) {
        console.error('Error deleting attendance record:', err.message);
        return reject(new Error('Failed to delete attendance record: ' + err.message));
      }
      resolve(result.affectedRows);  // Return the number of affected rows
    });
  });
};

// // Function to update attendance status (approved/rejected)
export const updateAttendanceStatus = async (attendanceId, status, rejectReason = null) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE _attendance SET status = ?, reject_reason = ? WHERE id = ? AND deleted = 0`;

    db.query(query, [status, rejectReason, attendanceId], (err, result) => {
      if (err) {
        console.error('Error updating attendance status:', err.message);
        return reject(new Error('Failed to update attendance status: ' + err.message));
      }
      resolve(result.affectedRows);  // Return the number of affected rows
    });
  });
};
