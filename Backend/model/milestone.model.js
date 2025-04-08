import db from "../config/db.js";

// Create a new milestone
export const createMilestone = (milestoneData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO _milestones (
        title, project_id, due_date, description, deleted
      ) VALUES (?, ?, ?, ?, 0)
    `;

    const values = [
      milestoneData.title,
      milestoneData.project_id,
      milestoneData.due_date,
      milestoneData.description || ''
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error creating milestone:', err);
        return reject(err);
      }
      resolve({
        success: true,
        id: result.insertId,
        ...milestoneData
      });
    });
  });
};

// Get all milestones for a project
export const getMilestonesByProject = (projectId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM _milestones 
      WHERE project_id = ? AND deleted = 0 
      ORDER BY due_date ASC
    `;

    db.query(query, [projectId], (err, results) => {
      if (err) {
        console.error('Error fetching milestones:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Get a single milestone by ID
export const getMilestoneById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM _milestones 
      WHERE id = ? AND deleted = 0
    `;

    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error fetching milestone:', err);
        return reject(err);
      }
      resolve(results[0]);
    });
  });
};

// Update a milestone
export const updateMilestone = (id, milestoneData) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE _milestones 
      SET title = ?, project_id = ?, due_date = ?, description = ? 
      WHERE id = ? AND deleted = 0
    `;

    const values = [
      milestoneData.title,
      milestoneData.project_id,
      milestoneData.due_date,
      milestoneData.description || '',
      id
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error updating milestone:', err);
        return reject(err);
      }
      resolve({
        success: true,
        id: id,
        ...milestoneData
      });
    });
  });
};

// Delete a milestone (soft delete)
export const deleteMilestone = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE _milestones 
      SET deleted = 1 
      WHERE id = ?
    `;

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error deleting milestone:', err);
        return reject(err);
      }
      resolve({
        success: true,
        message: 'Milestone deleted successfully'
      });
    });
  });
}; 