import db from "../config/db.js"; // Import the database connection

// Helper functions for date formatting
const formatDateTime = (date) => new Date(date).toISOString().slice(0, 19).replace("T", " ");
const formatDate = (date) => new Date(date).toISOString().split('T')[0];

export const createPoll = (pollData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO _polls (
        title, description, created_by, created_at, expire_at, status
      ) VALUES (?, ?, ?, ?, ?, ?)`;

    // Ensuring correct defaults and format
    const validStatuses = ['active', 'inactive'];
    const createdAt = pollData.created_at ? formatDateTime(pollData.created_at) : formatDateTime(new Date());
    const expireAt = pollData.expire_at ? formatDate(pollData.expire_at) : null;
    const status = validStatuses.includes(pollData.status) ? pollData.status : 'active';

    const values = [
      pollData.title || '',
      pollData.description || '',
      pollData.created_by || 1, // Default Admin User
      createdAt, // Formatted DateTime
      expireAt,  // Formatted Date or NULL
      status,    // Validated status
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("❌ Error creating poll:", err);
        return reject(err);
      }

      resolve({
        success: true,
        data: {
          id: result.insertId,
          ...pollData,
          created_at: createdAt,
          expire_at: expireAt,
          status,
        }
      });
    });
  });
};

// Get all polls
export const getAllPolls = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM _polls WHERE deleted = 0`;
    db.query(query, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

// Get specific poll by id
export const getPollById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM _polls WHERE id = ? AND deleted = 0`;
    db.query(query, [id], (err, results) => {
      if (err) reject(err);
      resolve(results[0]);
    });
  });
};

// Update poll by ID
export const updatePollById = (pollId, pollData) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE _polls SET 
        title = COALESCE(?, title), 
        description = COALESCE(?, description), 
        expire_at = COALESCE(?, expire_at), 
        status = COALESCE(?, status) 
      WHERE id = ? AND deleted = 0`;

    // Ensure proper formatting and default values
    const validStatuses = ['active', 'inactive'];
    const status = validStatuses.includes(pollData.status) ? pollData.status : 'active';
    const expireAt = pollData.expire_at ? formatDate(pollData.expire_at) : null;

    const values = [
      pollData.title || null,
      pollData.description || null,
      expireAt,
      status,
      pollId
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("❌ Error updating poll:", err);
        return reject(err);
      }

      resolve({
        success: result.affectedRows > 0, // Returns true if a row was updated
        affectedRows: result.affectedRows, // Number of rows updated
      });
    });
  });
};

// Delete poll by id (soft delete)
export const deletePollById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE _polls SET deleted = 1 WHERE id = ?`;
    db.query(query, [id], (err, results) => {
      if (err) reject(err);
      resolve(results.affectedRows);  // Return the number of rows affected
    });
  });
};

export const createPollAnswer = async (answerData) => {
  const { poll_id, title, deleted } = answerData;
  const query = `INSERT INTO _poll_answers (poll_id, title, deleted) VALUES (?, ?, ?)`;
  return new Promise((resolve, reject) => {
    db.query(query, [poll_id, title, deleted], (err, results) => {
      if (err) reject(err);
      resolve(results.insertId);
    });
  });
};

export const getPollAnswersByPollId = async (poll_id) => {
  const query = `SELECT * FROM _poll_answers WHERE poll_id = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [poll_id], (err, results) => {
      if (err) reject(err);
      resolve(results);  // Resolving with the list of poll answers
    });
  });
};


// Poll Vote model: Store votes for answers
export const createPollVote = (voteData) => {
  return new Promise((resolve, reject) => {
    const { poll_id, poll_answer_id, created_by, created_at, deleted } = voteData;
    const query = `INSERT INTO _poll_votes (poll_id, poll_answer_id, created_by, created_at, deleted) 
                   VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [poll_id, poll_answer_id, created_by, created_at, deleted], (err, results) => {
      if (err) reject(err);
      resolve(results.insertId);  // Return the vote id
    });
  });
};

// Get all votes for a specific poll by pollId
export const getPollVotes = (pollId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT pv.id, pv.poll_id, pv.poll_answer_id, pv.created_by, pv.created_at, 
             pv.deleted, a.title AS answer_title, u.first_name AS voted_by_first_name, 
             u.last_name AS voted_by_last_name
      FROM _poll_votes pv
      JOIN _poll_answers a ON pv.poll_answer_id = a.id
      JOIN _users u ON pv.created_by = u.id
      WHERE pv.poll_id = ? AND pv.deleted = 0
    `;
    db.query(query, [pollId], (err, results) => {
      if (err) {
        reject(new Error(`Error retrieving poll votes: ${err.message}`));
      }
      resolve(results);  // Return the list of votes
    });
  });
};


