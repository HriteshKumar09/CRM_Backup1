import db from "../config/db.js";

// Get all task priorities
export const getAllTaskPriorities = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM _task_priority WHERE deleted = 0 ORDER BY id ASC`;
    db.query(query, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Get task priority by ID
export const getTaskPriorityById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM _task_priority WHERE id = ? AND deleted = 0`;
    db.query(query, [id], (err, result) => {
      if (err) return reject(err);
      if (!result.length) {
        return reject(new Error('Task priority not found'));
      }
      resolve(result[0]);
    });
  });
};

// Create new task priority
export const createTaskPriority = (priorityData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO _task_priority (title, icon, color, deleted)
      VALUES (?, ?, ?, 0)
    `;
    const values = [
      priorityData.title,
      priorityData.icon,
      priorityData.color
    ];

    db.query(query, values, (err, result) => {
      if (err) return reject(err);
      resolve({
        id: result.insertId,
        ...priorityData
      });
    });
  });
};

// Update task priority
export const updateTaskPriority = (id, priorityData) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE _task_priority 
      SET title = ?, icon = ?, color = ?
      WHERE id = ? AND deleted = 0
    `;
    const values = [
      priorityData.title,
      priorityData.icon,
      priorityData.color,
      id
    ];

    db.query(query, values, (err, result) => {
      if (err) return reject(err);
      if (result.affectedRows === 0) {
        return reject(new Error('Task priority not found'));
      }
      resolve({
        id,
        ...priorityData
      });
    });
  });
};

// Delete task priority (soft delete)
export const deleteTaskPriority = (id) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE _task_priority SET deleted = 1 WHERE id = ?`;
    db.query(query, [id], (err, result) => {
      if (err) return reject(err);
      if (result.affectedRows === 0) {
        return reject(new Error('Task priority not found'));
      }
      resolve({ success: true });
    });
  });
}; 