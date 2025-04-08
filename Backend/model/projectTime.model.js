import db from "../config/db.js";

// Start timer
export const startTimer = (timerData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO _project_time (
        project_id,
        task_id,
        user_id,
        start_time,
        status
      ) VALUES (?, ?, ?, ?, 'running')
    `;

    const values = [
      timerData.project_id,
      timerData.task_id,
      timerData.user_id,
      timerData.start_time
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to start timer',
          error: err.message
        });
      }
      
      resolve({
        success: true,
        message: 'Timer started successfully',
        data: {
          id: result.insertId,
          ...timerData
        }
      });
    });
  });
};

// Stop timer
export const stopTimer = (timerId, endTime) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE _project_time 
      SET end_time = ?,
          status = 'stopped',
          duration = TIMESTAMPDIFF(SECOND, start_time, ?)
      WHERE id = ? AND status = 'running'
    `;

    db.query(query, [endTime, endTime, timerId], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to stop timer',
          error: err.message
        });
      }

      if (result.affectedRows === 0) {
        return reject({
          success: false,
          message: 'No running timer found'
        });
      }

      resolve({
        success: true,
        message: 'Timer stopped successfully'
      });
    });
  });
};

// Get total time for a task
export const getTaskTotalTime = (taskId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT COALESCE(SUM(duration), 0) as total_seconds
      FROM _project_time
      WHERE task_id = ? AND status = 'stopped'
    `;

    db.query(query, [taskId], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to fetch task time',
          error: err.message
        });
      }

      resolve({
        success: true,
        data: {
          total_seconds: result[0].total_seconds
        }
      });
    });
  });
};

// Get total time for a project
export const getProjectTotalTime = (projectId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT COALESCE(SUM(duration), 0) as total_seconds
      FROM _project_time
      WHERE project_id = ? AND status = 'stopped'
    `;

    db.query(query, [projectId], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to fetch project time',
          error: err.message
        });
      }

      resolve({
        success: true,
        data: {
          total_seconds: result[0].total_seconds
        }
      });
    });
  });
};

// Get running timer for a task
export const getRunningTimer = (taskId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT *
      FROM _project_time
      WHERE task_id = ? AND status = 'running'
      ORDER BY start_time DESC
      LIMIT 1
    `;

    db.query(query, [taskId], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return reject({
          success: false,
          message: 'Failed to fetch running timer',
          error: err.message
        });
      }

      resolve({
        success: true,
        data: result[0] || null
      });
    });
  });
}; 